"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, isBefore, startOfDay } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useId } from "react";
import { DateRange } from "react-day-picker";
import { Control, Controller } from "react-hook-form";

interface FixedDepartureDateRangePickerProps {
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
}

export function FixedDepartureDateRangePicker({
  control,
  name,
  label = "Período del Viaje",
  placeholder = "Seleccionar período del viaje",
}: FixedDepartureDateRangePickerProps) {
  const id = useId();

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id={id}
                variant={"outline"}
                className={cn(
                  "group w-full justify-between bg-background px-3 font-normal outline-offset-0 hover:bg-background focus-visible:border-ring focus-visible:outline-[3px] focus-visible:outline-ring/20",
                  !field.value && "text-muted-foreground"
                )}
              >
                <span
                  className={cn(
                    "truncate",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value?.from ? (
                    field.value.to ? (
                      <>
                        {format(field.value.from, "dd MMM yyyy")} -{" "}
                        {format(field.value.to, "dd MMM yyyy")}
                      </>
                    ) : (
                      format(field.value.from, "dd MMM yyyy")
                    )
                  ) : (
                    placeholder
                  )}
                </span>
                <CalendarIcon
                  size={16}
                  strokeWidth={2}
                  className="shrink-0 text-muted-foreground/80 transition-colors group-hover:text-foreground"
                  aria-hidden="true"
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2" align="start">
              <Calendar
                mode="range"
                selected={field.value}
                onSelect={field.onChange}
                numberOfMonths={1}
                disabled={(date) =>
                  isBefore(startOfDay(date), startOfDay(new Date()))
                }
              />
            </PopoverContent>
          </Popover>
        )}
      />
    </div>
  );
}
