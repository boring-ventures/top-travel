"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { buildWhatsAppUrl } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function TemplateDetail() {
  const params = useParams<{ id: string }>();
  const [tpl, setTpl] = useState<any>(null);
  const [vars, setVars] = useState({
    itemTitle: "Rio Carnival 5D4N",
    url: "https://gabytoptravel.com/package/rio-carnival-5d4n",
    utmSource: "cms-preview",
    utmCampaign: "demo",
  });
  const phone = "+59170000000";

  useEffect(() => {
    fetch(`/api/whatsapp-templates/${params.id}`)
      .then((r) => r.json())
      .then(setTpl)
      .catch(() => setTpl(null));
  }, [params.id]);

  const previewUrl = tpl ? buildWhatsAppUrl(phone, tpl.templateBody, vars) : "";

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">WhatsApp Template</h1>
      {tpl ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{tpl.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Default</div>
                <div>{tpl.isDefault ? "Yes" : "No"}</div>
              </div>
              <div className="sm:col-span-2 space-y-3">
                <div>
                  <label className="block text-sm font-medium">
                    Item Title
                  </label>
                  <Input
                    value={vars.itemTitle}
                    onChange={(e) =>
                      setVars((v) => ({ ...v, itemTitle: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">URL</label>
                  <Input
                    value={vars.url}
                    onChange={(e) =>
                      setVars((v) => ({ ...v, url: e.target.value }))
                    }
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium">
                      UTM Source
                    </label>
                    <Input
                      value={vars.utmSource}
                      onChange={(e) =>
                        setVars((v) => ({ ...v, utmSource: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      UTM Campaign
                    </label>
                    <Input
                      value={vars.utmCampaign}
                      onChange={(e) =>
                        setVars((v) => ({ ...v, utmCampaign: e.target.value }))
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="sm:col-span-2 space-y-1">
                <div className="text-sm font-medium">Preview Link</div>
                <a
                  href={previewUrl}
                  target="_blank"
                  className="text-blue-600 underline text-sm break-all"
                >
                  {previewUrl}
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="text-sm text-muted-foreground">Loading...</div>
      )}
    </div>
  );
}
