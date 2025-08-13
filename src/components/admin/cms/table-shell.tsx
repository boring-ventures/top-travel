import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type TableShellProps = {
  title: string;
  children: ReactNode;
  isLoading?: boolean;
  empty?: ReactNode;
};

export const TableShell = ({ title, children, isLoading, empty }: TableShellProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-3/4" />
          </div>
        ) : empty ? (
          empty
        ) : (
          <div className="overflow-auto rounded border">{children}</div>
        )}
      </CardContent>
    </Card>
  );
};




