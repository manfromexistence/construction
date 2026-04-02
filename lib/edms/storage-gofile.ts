import "server-only";

export interface UploadedEdmsFile {
  fileName: string;
  fileType: string;
  fileUrl: string;
  fileSize: number;
  pathname: string;
}

export function isGoFileConfigured() {
  return Boolean(process.env.GOFILE_API_TOKEN);
}

export async function uploadEdmsFile(input: {
  file: File;
  projectId: string;
  folder: "documents" | "versions";
}) {
  if (!isGoFileConfigured()) {
    throw new Error("GOFILE_API_TOKEN is not configured.");
  }

  const token = process.env.GOFILE_API_TOKEN;

  // Step 1: Get the best upload server
  const serverResponse = await fetch("https://api.gofile.io/servers", {
    method: "GET",
  });

  if (!serverResponse.ok) {
    throw new Error("Failed to get GoFile upload server");
  }

  const serverData = await serverResponse.json();
  const uploadServer = serverData.data?.servers?.[0]?.name || "store1";

  // Step 2: Upload the file
  const formData = new FormData();
  formData.append("file", input.file);

  // Optional: Create a folder structure (requires premium)
  // For now, we'll upload to root and use naming convention
  const uploadUrl = `https://${uploadServer}.gofile.io/uploadfile`;

  const uploadResponse = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!uploadResponse.ok) {
    const errorText = await uploadResponse.text();
    throw new Error(`GoFile upload failed: ${errorText}`);
  }

  const uploadData = await uploadResponse.json();

  if (uploadData.status !== "ok") {
    throw new Error(
      uploadData.message || "GoFile upload failed with unknown error"
    );
  }

  const fileData = uploadData.data;

  return {
    fileName: input.file.name,
    fileType: input.file.type || getExtensionFromFileName(input.file.name),
    fileUrl: fileData.downloadPage || fileData.fileId,
    fileSize: input.file.size,
    pathname: `${input.projectId}/${input.folder}/${input.file.name}`,
  } satisfies UploadedEdmsFile;
}

function getExtensionFromFileName(fileName: string) {
  const parts = fileName.split(".");
  return parts.length > 1 ? (parts.at(-1) ?? "file") : "file";
}
