"use client";

import * as React from "react";
import { Clock } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

/* -------------------------------------------------------------------------- */
/* Utils                                                                       */
/* -------------------------------------------------------------------------- */

type Meridiem = "AM" | "PM";

const HOURS_12 = Array.from({ length: 12 }, (_, i) =>
  String(i + 1).padStart(2, "0")
);

const MINUTES = [
  "00",
  "05",
  "10",
  "15",
  "20",
  "25",
  "30",
  "35",
  "40",
  "45",
  "50",
  "55",
];

const MERIDIEMS: Meridiem[] = ["AM", "PM"];

function parse24h(value?: string) {
  if (!value) return { hour: "12", minute: "00", meridiem: "AM" as Meridiem };

  const [H, M] = value.split(":").map(Number);
  const meridiem: Meridiem = H >= 12 ? "PM" : "AM";
  const hour12 = H % 12 === 0 ? 12 : H % 12;

  return {
    hour: String(hour12).padStart(2, "0"),
    minute: String(M).padStart(2, "0"),
    meridiem,
  };
}

function format24h(hour: string, minute: string, meridiem: Meridiem) {
  let h = Number(hour);
  if (meridiem === "AM") h = h === 12 ? 0 : h;
  else h = h === 12 ? 12 : h + 12;

  return `${String(h).padStart(2, "0")}:${minute}`;
}

/* -------------------------------------------------------------------------- */
/* Types                                                                       */
/* -------------------------------------------------------------------------- */

export interface TimeInputProps {
  value?: string; // HH:mm
  onChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

/* -------------------------------------------------------------------------- */
/* Component                                                                   */
/* -------------------------------------------------------------------------- */

export const TimeInput = React.forwardRef<HTMLButtonElement, TimeInputProps>(
  ({ value, onChange, disabled, className }, ref) => {
    const parsed = React.useMemo(() => parse24h(value), [value]);

    const [hour, setHour] = React.useState(parsed.hour);
    const [minute, setMinute] = React.useState(parsed.minute);
    const [meridiem, setMeridiem] = React.useState<Meridiem>(parsed.meridiem);

    React.useEffect(() => {
      setHour(parsed.hour);
      setMinute(parsed.minute);
      setMeridiem(parsed.meridiem);
    }, [parsed]);

    const commit = React.useCallback(
      (h = hour, m = minute, mer = meridiem) => {
        onChange?.(format24h(h, m, mer));
      },
      [hour, minute, meridiem, onChange]
    );

    return (
      <Popover>
        <PopoverTrigger asChild>
          {/* INPUT-LOOK BUTTON */}
          <button
            ref={ref}
            type="button"
            disabled={disabled}
            aria-label="Select time"
            className={cn(
              "h-9 w-full rounded-md border border-input dark:bg-input/30 px-3 py-2 text-sm",
              "flex items-center justify-between",
              "text-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
          >
            <span className="font-mono text-foreground">
              {hour}:{minute} {meridiem}
            </span>
            <Clock className="h-4 w-4 opacity-60" />
          </button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          className="w-[260px] rounded-xl bg-background p-3 shadow-lg"
        >
          <div className="grid grid-cols-3 gap-2">
            <TimeColumn
              label="Hour"
              values={HOURS_12}
              active={hour}
              onSelect={(v) => {
                setHour(v);
                commit(v);
              }}
            />

            <TimeColumn
              label="Min"
              values={MINUTES}
              active={minute}
              onSelect={(v) => {
                setMinute(v);
                commit(hour, v);
              }}
            />

            <TimeColumn
              label="AM/PM"
              values={MERIDIEMS}
              active={meridiem}
              onSelect={(v) => {
                setMeridiem(v);
                commit(hour, minute, v);
              }}
            />
          </div>
        </PopoverContent>
      </Popover>
    );
  }
);

TimeInput.displayName = "TimeInput";

/* -------------------------------------------------------------------------- */
/* Sub Components                                                              */
/* -------------------------------------------------------------------------- */

interface TimeColumnProps<T extends string> {
  label: string;
  values: readonly T[];
  active: T;
  onSelect: (value: T) => void;
}

function TimeColumn<T extends string>({
  label,
  values,
  active,
  onSelect,
}: TimeColumnProps<T>) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-center text-xs text-muted-foreground">{label}</span>

      <ScrollArea className="h-40 rounded-md border">
        <div className="grid gap-1 p-1">
          {values.map((value) => (
            <Button
              key={value}
              type="button"
              variant={value === active ? "secondary" : "ghost"}
              className="h-8 font-mono"
              onClick={() => onSelect(value)}
            >
              {value}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
