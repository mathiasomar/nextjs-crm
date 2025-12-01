"use client";

import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Checkbox } from "@/components/ui/checkbox";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export type Contact = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  mobilePhone?: string;
  jobTitle?: string;
  dateOfBirth?: Date;
  mailingAddress?: string;
  shippingAddress?: string;
  leadSource?: string;
  customerType?: string;
  loyaltyTier: string;
  status: string;
  lastActivityAt: Date;
  customFields?: Record<string, string>;
};

export const columns: ColumnDef<Contact>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "fullName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Full Name" />
    ),
    cell: ({ row }) => {
      const user = row.original;

      return (
        <p>
          {user.firstName} {user.lastName}
        </p>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "customerType",
    header: "Customer Type",
  },
  {
    accessorKey: "loyaltyTier",
    header: "Loyalty Tier",
    cell: ({ row }) => {
      const loyalty = row.original;

      return (
        <Badge
          className={cn(
            "text-xs",
            loyalty.loyaltyTier === "GOLD"
              ? "bg-[#FFD700]"
              : loyalty.loyaltyTier === "SILVER"
              ? "bg-[#C0C0C0]"
              : "bg-[#CD7F32]"
          )}
        >
          {loyalty.loyaltyTier as string}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original;

      return (
        <div
          className={cn(
            `p-1 rounded-md w-max text-xs`,
            status.status === "Active" ? "bg-green-500/40" : "bg-red-500/40"
          )}
        >
          {status.status as string}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const contact = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(contact.id)}
            >
              Copy Contact ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={`/dashboard/contacts/${contact.id}`}>
                View contact
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
