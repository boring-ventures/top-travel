"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Trash2 } from "lucide-react";

export default function CleanupPage() {
  const [isCleaning, setIsCleaning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const handleCleanup = async () => {
    setIsCleaning(true);
    try {
      const response = await fetch("/api/cleanup-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Cleanup failed");
      }

      const data = await response.json();
      setResult(data.result);

      toast({
        title: "Cleanup completed",
        description: `Deleted ${data.result.deleted.length} orphaned images. ${data.result.errors.length} errors occurred.`,
      });
    } catch (error) {
      console.error("Cleanup error:", error);
      toast({
        title: "Cleanup failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsCleaning(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Image Cleanup
            </CardTitle>
            <CardDescription>
              Clean up orphaned images that are no longer referenced in the
              database.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleCleanup}
              disabled={isCleaning}
              variant="destructive"
              className="w-full"
            >
              {isCleaning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cleaning up...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clean Up Orphaned Images
                </>
              )}
            </Button>

            {result && (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="font-medium text-green-800">
                    Cleanup Results
                  </h3>
                  <p className="text-sm text-green-600">
                    Deleted {result.deleted.length} orphaned images
                  </p>
                  {result.errors.length > 0 && (
                    <p className="text-sm text-red-600">
                      {result.errors.length} errors occurred
                    </p>
                  )}
                </div>

                {result.deleted.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Deleted Files:</h4>
                    <div className="max-h-40 overflow-y-auto space-y-1">
                      {result.deleted.map((file: string, index: number) => (
                        <div
                          key={index}
                          className="text-sm text-gray-600 font-mono"
                        >
                          {file}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {result.errors.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 text-red-800">Errors:</h4>
                    <div className="max-h-40 overflow-y-auto space-y-1">
                      {result.errors.map((error: string, index: number) => (
                        <div key={index} className="text-sm text-red-600">
                          {error}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
