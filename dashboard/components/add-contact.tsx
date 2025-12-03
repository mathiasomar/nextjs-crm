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
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { ScrollArea } from "./ui/scroll-area";
import { useState } from "react";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";

const formSchema = z.object({
  salutation: z.string(),
  firstName: z.string().min(1, { message: "First name is required!" }),
  lastName: z.string().min(1, { message: "Last name is required!" }),
  email: z
    .string()
    .min(1, { message: "Email is required!" })
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
      message: "Invalid email address!",
    }),
  phone: z.string().regex(/^[0-9]{10}$/, { message: "Invalid phone number!" }),
  mobilePhone: z
    .string()
    .regex(/^[0-9]{10}$/, { message: "Invalid phone number!" }),
  jobTitle: z.string(),
  dateOfBirth: z.date(),
  mailingAddress: z.string(),
  shippingAddress: z.string(),
  leadSource: z.string(),
  customerType: z.string(),
  loyaltyTier: z.string(),
  customFields: z.record(z.string(), z.string()),
});

const AddContact = () => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      salutation: "Mr.",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      mobilePhone: "",
      jobTitle: "",
      dateOfBirth: date,
      mailingAddress: "",
      shippingAddress: "",
      leadSource: "",
      customerType: "",
      loyaltyTier: "",
      customFields: undefined,
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // Do something with the form values.
    console.log(data);
  };
  return (
    <SheetContent>
      <ScrollArea className="h-screen">
        <SheetHeader>
          <SheetTitle className="mb-4">Add Contact</SheetTitle>
          <SheetDescription asChild>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <Controller
                  name="firstName"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="fname">
                        First Name <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Input
                        {...field}
                        id="fname"
                        aria-invalid={fieldState.invalid}
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
                      <FieldLabel htmlFor="lname">
                        Last Name <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Input
                        {...field}
                        id="lname"
                        aria-invalid={fieldState.invalid}
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
                      <FieldLabel htmlFor="email">
                        Email <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Input
                        {...field}
                        id="email"
                        aria-invalid={fieldState.invalid}
                        autoComplete="off"
                        placeholder="someone@gmail.com"
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
                        autoComplete="off"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="mobilePhone"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="mobilePhone">
                        Mobile Phone
                      </FieldLabel>
                      <Input
                        {...field}
                        id="mobilePhone"
                        aria-invalid={fieldState.invalid}
                        autoComplete="off"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="jobTitle"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="jobTitle">Job Title</FieldLabel>
                      <Input
                        {...field}
                        id="jobTitle"
                        aria-invalid={fieldState.invalid}
                        autoComplete="off"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <div className="flex flex-col gap-3">
                  <Label htmlFor="date" className="px-1">
                    Date of birth
                  </Label>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        id="date"
                        className="w-48 justify-between font-normal"
                      >
                        {date ? date.toLocaleDateString() : "Select date"}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto overflow-hidden p-0"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={date}
                        captionLayout="dropdown"
                        onSelect={(date) => {
                          setDate(date);
                          setOpen(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <Controller
                  name="mailingAddress"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="mailingAddress">
                        Mailing Address
                      </FieldLabel>
                      <Input
                        {...field}
                        id="mailingAddress"
                        aria-invalid={fieldState.invalid}
                        autoComplete="off"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="shippingAddress"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="shippingAddress">
                        Shipping Address
                      </FieldLabel>
                      <Input
                        {...field}
                        id="shippingAddress"
                        aria-invalid={fieldState.invalid}
                        autoComplete="off"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="customerType"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="customerType">
                        Customer Type
                      </FieldLabel>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Customer Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Prospect">Prospect</SelectItem>
                          <SelectItem value="Customer">Customer</SelectItem>
                          <SelectItem value="VIP">VIP</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="loyaltyTier"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="loyaltyTier">
                        Customer Type
                      </FieldLabel>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a Loyalty Tier" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Bronze">Bronze</SelectItem>
                          <SelectItem value="Silver">Silver</SelectItem>
                          <SelectItem value="Gold">Gold</SelectItem>
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

export default AddContact;
