import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Page() {
  // Use `auth()` to access `isAuthenticated` - if false, the user is not signed in
  const { isAuthenticated } = await auth();

  // Use `user` to render user details or create UI elements
  return (
    <div className="flex items-center justify-center w-full h-screen flex-col gap-4">
      <p
        className={cn(
          "text-2xl font-bold",
          isAuthenticated ? "text-green-500" : "text-red-500"
        )}
      >
        {isAuthenticated ? "You are signed in!" : "You are not signed in."}
      </p>
      <Button asChild>
        <a href={isAuthenticated ? "/dashboard" : "/sign-in"} className="ml-4">
          {isAuthenticated ? "Go to Dashboard" : "Sign In"}
        </a>
      </Button>
    </div>
  );
}
