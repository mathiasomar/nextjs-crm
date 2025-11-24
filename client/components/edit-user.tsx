"use client";

import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "./ui/field";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";

const formSchema = z.object({
  username: z
    .string()
    .min(2, "Username must be at least 2 characters!")
    .max(50, "Username must be atmost 50 characters"),
  email: z.string().email("Invalid email address!"),
  phone: z
    .string()
    .min(10, "Phone must be atleast 10 digit")
    .max(15, "Phone must not exceed 15 digit"),
  location: z.string().min(2),
  role: z.enum(["admin", "user"]),
});

const EditUser = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "ommy",
      email: "ommy@gmail.com",
      phone: "+1 234 5678",
      location: "New York, NY",
      role: "admin",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // Do something with the form values.
    console.log(data);
  };
  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle className="mb-4">Edit User</SheetTitle>
        <SheetDescription asChild>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="username"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="username">Username</FieldLabel>
                    <Input
                      {...field}
                      id="username"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter Username"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="email"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter Email"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="phone"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="phone">Phone</FieldLabel>
                    <Input
                      {...field}
                      id="phone"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter Phone"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="location"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="location">Location</FieldLabel>
                    <Input
                      {...field}
                      id="location"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter Location"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="role"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="role">Role</FieldLabel>
                    <Select aria-invalid={fieldState.invalid}>
                      <SelectTrigger>
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FieldDescription>
                      Only verified users can be admin.
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <Button type="submit" className="mt-6 w-full">
              Submit
            </Button>
          </form>
        </SheetDescription>
      </SheetHeader>
    </SheetContent>
  );
};

export default EditUser;
