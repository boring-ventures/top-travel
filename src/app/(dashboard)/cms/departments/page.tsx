"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

async function fetchDepartments() {
  const res = await fetch(`/api/departments`);
  if (!res.ok) throw new Error("Failed to load departments");
  return res.json();
}

export default function CmsDepartmentsList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["cms", "departments"],
    queryFn: fetchDepartments,
  });
  const items = data ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Departments</h1>
        <Button asChild size="sm">
          <Link href="/cms/departments/new">New Department</Link>
        </Button>
      </div>
      {isLoading ? (
        <div className="text-sm text-muted-foreground">Loading...</div>
      ) : error ? (
        <div className="text-sm text-red-600">Failed to load.</div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">All Departments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto rounded border">
              <table className="min-w-full text-sm">
                <thead className="bg-neutral-50 dark:bg-neutral-900">
                  <tr>
                    <th className="px-3 py-2 text-left">Type</th>
                    <th className="px-3 py-2 text-left">Title</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((d: any) => (
                    <tr key={d.id} className="border-t hover:bg-muted/40">
                      <td className="px-3 py-2">
                        <Link
                          href={`/cms/departments/${d.type}`}
                          className="underline"
                        >
                          {d.type}
                        </Link>
                      </td>
                      <td className="px-3 py-2">{d.title}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
