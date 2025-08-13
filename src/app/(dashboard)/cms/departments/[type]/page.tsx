"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function DepartmentDetailPage() {
  const { type } = useParams<{ type: string }>();
  const router = useRouter();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await fetch(`/api/departments/${type}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted) setItem(data);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [type]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/departments/${type}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      router.push("/cms/departments");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Department</h1>
        <div className="flex items-center gap-2">
          <Button asChild variant="secondary" size="sm">
            <Link href={`/cms/departments/${type}/edit`}>Edit</Link>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setConfirmOpen(true)}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
          <Button variant="outline" onClick={() => router.back()} size="sm">
            Back
          </Button>
        </div>
      </div>
      {loading ? (
        <div className="text-sm text-muted-foreground">Loading...</div>
      ) : !item ? (
        <div className="text-sm text-red-600">Not found.</div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              {item.title}
              <Badge variant="secondary">{item.type}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
              <div className="space-y-2 sm:col-span-2">
                <div className="text-muted-foreground">Intro</div>
                <div className="whitespace-pre-wrap">{item.intro || "—"}</div>
                <Separator className="my-2" />
                <div className="text-muted-foreground">Created</div>
                <div>{new Date(item.createdAt).toLocaleString()}</div>
                <div className="text-muted-foreground">Updated</div>
                <div>{new Date(item.updatedAt).toLocaleString()}</div>
              </div>
              <div className="space-y-2">
                <div className="text-muted-foreground">Hero Image</div>
                {item.heroImageUrl ? (
                  <a href={item.heroImageUrl} target="_blank" className="block">
                    <img
                      src={item.heroImageUrl}
                      alt="hero"
                      className="h-32 w-full rounded object-cover ring-1 ring-border"
                    />
                  </a>
                ) : (
                  <div className="text-muted-foreground">—</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={handleDelete}
        title="Delete department?"
        description="This action cannot be undone. The department will be permanently removed."
      />
    </div>
  );
}
