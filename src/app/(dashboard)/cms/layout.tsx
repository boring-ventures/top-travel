import { ReactNode } from "react";

export default function CmsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container mx-auto py-8 md:py-10">
      <main className="flex-1 space-y-6">{children}</main>
    </div>
  );
}
