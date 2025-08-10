"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DepartmentDetailPage() {
  const { type } = useParams<{ type: string }>();
  const router = useRouter();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Department</h1>
        <Button variant="secondary" onClick={() => router.back()} size="sm">
          Back
        </Button>
      </div>
      {loading ? (
        <div className="text-sm text-muted-foreground">Loading...</div>
      ) : !item ? (
        <div className="text-sm text-red-600">Not found.</div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{item.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Type</div>
                <div>{item.type}</div>
              </div>
              {item.heroImageUrl ? (
                <div className="sm:col-span-2">
                  <div className="text-muted-foreground">Hero Image</div>
                  <a
                    className="text-blue-600 underline"
                    href={item.heroImageUrl}
                    target="_blank"
                  >
                    {item.heroImageUrl}
                  </a>
                </div>
              ) : null}
              {item.intro ? (
                <div className="sm:col-span-2">
                  <div className="text-muted-foreground">Intro</div>
                  <div className="whitespace-pre-wrap">{item.intro}</div>
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
