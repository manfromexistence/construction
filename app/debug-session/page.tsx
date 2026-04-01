import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export default async function DebugSessionPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Session Debug</h1>
      <pre className="bg-gray-100 p-4 rounded overflow-auto">
        {JSON.stringify(session, null, 2)}
      </pre>
      <div className="mt-4">
        <h2 className="text-xl font-bold mb-2">Validation Check:</h2>
        <ul className="list-disc pl-6">
          <li>
            Role: {String(session?.user?.role || "undefined")} (is "user"?{" "}
            {String(session?.user?.role === "user")})
          </li>
          <li>
            Organization: {String(session?.user?.organization || "undefined")} (is empty?{" "}
            {String(
              !session?.user?.organization ||
                String(session?.user?.organization).trim().length === 0
            )}
            )
          </li>
          <li>
            Should redirect?{" "}
            {String(
              session?.user?.role === "user" ||
                !session?.user?.organization ||
                String(session?.user?.organization).trim().length === 0
            )}
          </li>
        </ul>
      </div>
    </div>
  );
}
