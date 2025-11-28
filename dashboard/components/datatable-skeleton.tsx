import React from "react";

// Shadcn UI components (assumes shadcn folder structure)
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface DataTableSkeletonProps {
  columns?: number; // how many columns the table shows
  rows?: number; // how many skeleton rows to render
  compact?: boolean; // smaller row heights
}

export default function DataTableSkeleton({
  columns = 6,
  rows = 6,
  compact = false,
}: DataTableSkeletonProps) {
  const cells = Array.from({ length: columns }).map((_, i) => (
    <TableCell key={i}>
      <Skeleton className={compact ? "h-3 w-24" : "h-4 w-36"} />
    </TableCell>
  ));

  return (
    <Card className="w-full">
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-8 w-24" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-12 rounded-md" />
            <Skeleton className="h-8 w-12 rounded-md" />
          </div>
        </div>

        <div className="overflow-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                {Array.from({ length: columns }).map((_, idx) => (
                  <TableHead key={idx}>
                    <Skeleton className={compact ? "h-3 w-20" : "h-4 w-32"} />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: rows }).map((_, rIdx) => (
                <TableRow key={rIdx} className={compact ? "h-8" : "h-12"}>
                  {Array.from({ length: columns }).map((_, cIdx) => (
                    <TableCell key={cIdx}>
                      {/* Vary widths so it feels more "real" */}
                      <Skeleton
                        className={`${compact ? "h-3" : "h-4"} w-[${
                          20 + ((rIdx + cIdx) % 5) * 8
                        }] max-w-full`}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile-friendly stacked skeleton (visible on small screens) */}
        <div className="mt-4 space-y-3 md:hidden">
          {Array.from({ length: Math.min(rows, 4) }).map((_, i) => (
            <div key={i} className="p-3 border rounded-md animate-pulse">
              <div className="flex items-center justify-between mb-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-3 w-8" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
