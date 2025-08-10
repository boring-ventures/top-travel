"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";

export default function TestimonialDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await fetch(`/api/testimonials/${id}`);
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
        <h1 className="text-xl font-semibold">Testimonial</h1>
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
            <CardTitle className="text-base">{item.authorName}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Rating</div>
                <div>{item.rating}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Status</div>
                <div>
                  <StatusBadge status={item.status} />
                </div>
              </div>
              {item.location ? (
                <div>
                  <div className="text-muted-foreground">Location</div>
                  <div>{item.location}</div>
                </div>
              ) : null}
              {item.content ? (
                <div className="sm:col-span-2">
                  <div className="text-muted-foreground">Content</div>
                  <div className="whitespace-pre-wrap">{item.content}</div>
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
