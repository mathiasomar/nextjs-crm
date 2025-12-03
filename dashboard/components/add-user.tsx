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
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const formSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters!" })
    .max(50, { message: "First name must be atmost 50 characters" }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters!" })
    .max(50, { message: "Last name must be atmost 50 characters" }),
  email: z
    .string()
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: "Invalid email address" }),
  phone: z
    .string()
    .max(15, { message: "Phone must not exceed 15 digit" })
    .optional(),
  role: z.string().optional(),
  department: z.string().optional(),
});

const AddUser = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // Do something with the form values.
    console.log(data);
  };
  return (
    <SheetContent>
      <ScrollArea className="h-screen">
        <SheetHeader>
          <SheetTitle className="mb-4">Add User</SheetTitle>
          <SheetDescription asChild>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <Controller
                  name="firstName"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                      <Input
                        {...field}
                        id="firstName"
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter First Name"
                        autoComplete="off"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="lastName"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                      <Input
                        {...field}
                        id="lastName"
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter Last Name"
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
                      <FieldDescription>
                        Only admin can see your email
                      </FieldDescription>
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
                      <FieldDescription>
                        Only admin can see your phone number
                      </FieldDescription>
                    </Field>
                  )}
                />
                <Controller
                  name="department"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="department">Department</FieldLabel>
                      <Input
                        {...field}
                        id="department"
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter Department"
                        autoComplete="off"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                      <FieldDescription>
                        can be &apos;Sales&apos;, &apos;Support&apos;,
                        &apos;Marketing&apos;
                      </FieldDescription>
                    </Field>
                  )}
                />
                <Controller
                  name="role"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="User Role">Customer Type</FieldLabel>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select User Role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AGENT">Agent</SelectItem>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                          <SelectItem value="MANAGER">Manager</SelectItem>
                          <SelectItem value="SUPPORT">Support</SelectItem>
                        </SelectContent>
                      </Select>
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
      </ScrollArea>
    </SheetContent>
  );
};

export default AddUser;
