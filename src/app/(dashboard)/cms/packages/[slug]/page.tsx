"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function PackageDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await fetch(`/api/packages/${slug}`);
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
  }, [slug]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Package</h1>
        <Button variant="secondary" onClick={() => router.back()} size="sm">
          Back
        </Button>
      </div>
      {loading ? (
        <div className="text-sm text-muted-foreground">Loading...</div>
      ) : !item ? (
        <div className="text-sm text-red-600">Not found.</div>
      ) : (
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-medium">Title:</span> {item.title}
          </div>
          <div>
            <span className="font-medium">Custom:</span>{" "}
            {item.isCustom ? "Yes" : "No"}
          </div>
          <div>
            <span className="font-medium">Status:</span> {item.status}
          </div>
        </div>
      )}
    </div>
  );
}

