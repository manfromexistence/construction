import { Search } from "lucide-react";
import Link from "next/link";
import { EdmsDataState } from "@/components/edms/data-state";
import { EdmsPageHeader } from "@/components/edms/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getGlobalSearchData } from "@/lib/edms/search";
import { getRequiredDashboardSessionUser } from "@/lib/edms/session";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const sessionUser = await getRequiredDashboardSessionUser();
  const params = await searchParams;
  const query = params.q ?? "";
  const data = await getGlobalSearchData(sessionUser, query);

  return (
    <div className="flex flex-1 flex-col">
      <EdmsPageHeader
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Search" }]}
        title="Global search"
        description="Find projects, documents, workflows, transmittals, and alerts from one EDMS search surface."
      />

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 md:px-6 lg:px-8">
        <EdmsDataState
          isUsingFallbackData={data.isUsingFallbackData}
          message={data.statusMessage}
        />

        <Card className="bg-card/95">
          <CardHeader className="space-y-1">
            <CardTitle>Search workspace</CardTitle>
            <CardDescription>
              Search by document number, title, project, workflow, or transmittal reference.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4 md:grid-cols-[1fr_auto]">
              <Input name="q" defaultValue={query} placeholder="Search the EDMS" />
              <Button type="submit">
                <Search className="size-4" />
                Search
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-card/95">
          <CardHeader className="space-y-1">
            <CardTitle>Results</CardTitle>
            <CardDescription>
              {data.query.trim().length === 0
                ? "Enter a term to search the current EDMS workspace."
                : `${data.results.length} result${data.results.length === 1 ? "" : "s"} for "${data.query}"`}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {data.query.trim().length === 0 ? (
              <EmptySearchState message="Search results will appear here once you enter a query." />
            ) : data.results.length === 0 ? (
              <EmptySearchState message="No matching EDMS records were found for this query." />
            ) : (
              data.results.map((result) => (
                <Link
                  key={`${result.category}-${result.id}`}
                  href={result.href}
                  className="rounded-2xl border border-border/70 bg-muted/25 p-4 shadow-sm transition-colors hover:bg-muted/40"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium">{result.title}</p>
                        <Badge variant="outline" className="rounded-full">
                          {result.category}
                        </Badge>
                      </div>
                      <p className="font-mono text-xs text-muted-foreground">{result.subtitle}</p>
                      <p className="text-sm leading-6 text-muted-foreground">{result.meta}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      Open
                    </Button>
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function EmptySearchState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border/70 bg-muted/20 p-5">
      <p className="font-medium">Nothing to show yet</p>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">{message}</p>
    </div>
  );
}
