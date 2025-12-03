"use client";

import {
  Breadcrumb,
  BreadcrumbSeparator,
  BreadcrumbLink,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import AddUser from "@/components/add-user";
import { useUsers } from "@/hooks/use-users";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon, SearchIcon } from "lucide-react";
import DataTableSkeleton from "@/components/datatable-skeleton";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const UsersPage = () => {
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const { data: users, isLoading, error } = useUsers(query);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("search", value);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    setQuery(value);
  };

  const handleRemoveSearch = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("search");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    setQuery("");
    setSearch("");
  };

  return (
    <div>
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Users</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div
        className="mb-8 px-4 py-2 bg-secondary roundedn-md flex items-center
      justify-between"
      >
        <h1 className="font-semiboldnn">All Users</h1>
        <div>
          <InputGroup>
            <InputGroupInput
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">
              <InputGroupButton onClick={() => handleSearch(search)}>
                Search
              </InputGroupButton>
              <InputGroupButton asChild>
                <Button variant="outline" onClick={handleRemoveSearch}>
                  Clear
                </Button>
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </div>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="default">Add User</Button>
          </SheetTrigger>
          <AddUser onClose={() => setSheetOpen(false)} />
        </Sheet>
      </div>
      {isLoading ? (
        <DataTableSkeleton columns={5} rows={3} compact={false} />
      ) : error ? (
        <Alert variant={"destructive"}>
          <AlertCircleIcon />
          <AlertTitle>
            {error instanceof Error ? error.message : "Error"}
          </AlertTitle>
        </Alert>
      ) : (
        <DataTable columns={columns} data={users.data} />
      )}
    </div>
  );
};

export default UsersPage;
