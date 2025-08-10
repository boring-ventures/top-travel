"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

async function fetchTemplates() {
  const res = await fetch(`/api/whatsapp-templates?page=1&pageSize=20`);
  if (!res.ok) throw new Error("Failed to load WhatsApp templates");
  return res.json();
}

export default function CmsWhatsAppTemplatesList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["cms", "whatsapp-templates", { page: 1, pageSize: 20 }],
    queryFn: fetchTemplates,
  });
  const items = data?.items ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">WhatsApp Templates</h1>
        <Button asChild size="sm">
          <Link href="/cms/whatsapp-templates/new">New Template</Link>
        </Button>
      </div>
      {isLoading ? (
        <div className="text-sm text-muted-foreground">Loading...</div>
      ) : error ? (
        <div className="text-sm text-red-600">Failed to load.</div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">All WhatsApp Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto rounded border">
              <table className="min-w-full text-sm">
                <thead className="bg-neutral-50 dark:bg-neutral-900">
                  <tr>
                    <th className="px-3 py-2 text-left">Name</th>
                    <th className="px-3 py-2 text-left">Default</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((t: any) => (
                    <tr key={t.id} className="border-t">
                      <td className="px-3 py-2">
                        <Link
                          href={`/cms/whatsapp-templates/${t.id}`}
                          className="underline"
                        >
                          {t.name}
                        </Link>
                      </td>
                      <td className="px-3 py-2">
                        {t.isDefault ? "Yes" : "No"}
                      </td>
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
