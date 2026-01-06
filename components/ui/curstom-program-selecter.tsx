"use client";

import * as React from "react";
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
import { Check, ChevronDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppForm } from "../custom/form/FormContext";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export type SelectOption = {
  label: string;
  value: string;
} & Record<string, any>;

export type SelectGroup = {
  title: string;
  options: SelectOption[];
};

interface SearchableSelectFieldProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  groups: SelectGroup[];
  loading?: boolean;
  disabled?: boolean;
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export function SearchableSelectField<T extends FieldValues>({
  form,
  name,
  label,
  placeholder = "Select option",
  groups,
  loading,
  disabled = false,
}: SearchableSelectFieldProps<T>) {
  const [open, setOpen] = React.useState(false);
  const { isLoading } = useAppForm<T>();
  const allOptions = React.useMemo(
    () => groups.flatMap((g) => g.options),
    [groups]
  );
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const selected = allOptions.find((opt) => opt.value === field.value);

        return (
          <FormItem className="space-y-1.5">
            <FormLabel className="text-sm font-medium">{label}</FormLabel>

            <FormControl>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild disabled={disabled || isLoading}>
                  <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    disabled={disabled}
                    className={cn(
                      "w-full justify-between gap-2 overflow-hidden",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    <span className="flex-1 min-w-0 truncate text-left">
                      {selected?.label ?? placeholder}
                    </span>

                    <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-fit p-1 mr-5">
                  <Command>
                    <CommandInput
                      placeholder={`Search ${label.toLowerCase()}...`}
                    />

                    <CommandList>
                      {!loading && (
                        <CommandEmpty>No options found.</CommandEmpty>
                      )}
                      {loading && (
                        <CommandEmpty className="flex items-center justify-center p-5 text-xs">
                          <Loader2 className="mr-1 h-4 w-4 animate-spin" />{" "}
                          Loading options...
                        </CommandEmpty>
                      )}
                      {groups.map((group) => (
                        <CommandGroup key={group.title} heading={group.title}>
                          {group.options.map((option) => (
                            <CommandItem
                              className="text-xs"
                              key={option.value}
                              value={option.value}
                              onSelect={() => {
                                field.onChange(option.value);
                                setOpen(false);
                              }}
                            >
                              {option.label}
                              {option.value === field.value && (
                                <Check className="ml-auto h-4 w-4" />
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
        );
      }}
    />
  );
}
