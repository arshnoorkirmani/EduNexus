"use client";

import { useState } from "react";
import { UseFormReturn, FieldValues, Path } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// ✅ Define types
type CourseOption = {
  value: string;
  label: string;
};

type OptionGroup = {
  title: string;
  courses: CourseOption[];
};

interface SearchableSelectFieldProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  groups: OptionGroup[];
}

export function SearchableSelectField<T extends FieldValues>({
  form,
  name,
  label,
  placeholder = "Select option",
  groups,
}: SearchableSelectFieldProps<T>) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-1.5">
          <FormLabel className="text-sm font-medium">{label}</FormLabel>
          <FormControl>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className={cn(
                    "w-full justify-between",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value
                    ? groups
                        .flatMap((g) => g.courses)
                        .find((c) => c.value === field.value)?.label
                    : placeholder}
                  <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-full p-0">
                <Command value={value} onValueChange={setValue}>
                  <CommandInput
                    placeholder={`Search ${label.toLowerCase()}...`}
                  />
                  <CommandList>
                    <CommandEmpty>No course found.</CommandEmpty>

                    {/* ✅ Render grouped options */}
                    {groups.map((group) => (
                      <CommandGroup key={group.title} heading={group.title}>
                        {group.courses.map((course) => (
                          <CommandItem
                            key={course.value}
                            value={course.value}
                            onSelect={() => {
                              form.setValue(name, course.value as any);
                              setOpen(false);
                            }}
                          >
                            {course.label}
                            {course.value === field.value && (
                              <CheckIcon className="ml-auto h-4 w-4" />
                            )}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    ))}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
