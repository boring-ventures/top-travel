"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { useParams, useRouter } from "next/navigation";

export default function OfferDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await fetch(`/api/offers/${id}`);
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
  }, [id]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Offer</h1>
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
                <div className="text-muted-foreground">Status</div>
                <div>
                  <StatusBadge status={item.status} />
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">Featured</div>
                <div>
                  {item.isFeatured ? (
                    <Badge variant="secondary">Featured</Badge>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </div>
              </div>
              {item.startAt ? (
                <div>
                  <div className="text-muted-foreground">Start</div>
                  <div>{new Date(item.startAt).toLocaleDateString()}</div>
                </div>
              ) : null}
              {item.endAt ? (
                <div>
                  <div className="text-muted-foreground">End</div>
                  <div>{new Date(item.endAt).toLocaleDateString()}</div>
                </div>
              ) : null}
            </div>
            <div className="pt-4">
              <Button asChild size="sm">
                <Link href="/cms/offers">Back to list</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
