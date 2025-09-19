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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, isBefore, startOfDay } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import { useId, useState } from "react";
import { DateRange } from "react-day-picker";
import { Control, Controller } from "react-hook-form";

interface EventDateRangePickerProps {
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
}

interface DateTimeRange {
  from?: Date;
  to?: Date;
  startTime?: string; // Format: "HH:mm"
  endTime?: string; // Format: "HH:mm"
}

export function EventDateRangePicker({
  control,
  name,
  label = "Período del Evento",
  placeholder = "Seleccionar período del evento",
}: EventDateRangePickerProps) {
  const id = useId();
  const [isOpen, setIsOpen] = useState(false);

  // Generate time options (00:00 to 23:30 in 30-minute intervals)
  const timeOptions: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
      timeOptions.push(timeString);
    }
  }

  // Helper function to combine date and time into a DateTime
  const combineDateTime = (
    date: Date | undefined,
    time: string | undefined
  ): Date | undefined => {
    if (!date || !time) return date;

    const [hours, minutes] = time.split(":").map(Number);
    const combined = new Date(date);
    combined.setHours(hours, minutes, 0, 0);
    return combined;
  };

  // Helper function to extract time from DateTime
  const extractTime = (dateTime: Date | undefined): string => {
    if (!dateTime) return "";
    return `${dateTime.getHours().toString().padStart(2, "0")}:${dateTime.getMinutes().toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button
                id={id}
                variant={"outline"}
                className={cn(
                  "group w-full justify-between bg-background px-3 font-normal outline-offset-0 hover:bg-background focus-visible:border-ring focus-visible:outline-[3px] focus-visible:outline-ring/20",
                  !field.value?.from && "text-muted-foreground"
                )}
              >
                <span
                  className={cn(
                    "truncate",
                    !field.value?.from && "text-muted-foreground"
                  )}
                >
                  {field.value?.from ? (
                    field.value.to ? (
                      <>
                        {format(field.value.from, "dd MMM yyyy")} -{" "}
                        {format(field.value.to, "dd MMM yyyy")}
                        {extractTime(field.value.from) &&
                          extractTime(field.value.to) && (
                            <span className="text-muted-foreground ml-2">
                              ({extractTime(field.value.from)} -{" "}
                              {extractTime(field.value.to)})
                            </span>
                          )}
                      </>
                    ) : (
                      <>
                        {format(field.value.from, "dd MMM yyyy")}
                        {extractTime(field.value.from) && (
                          <span className="text-muted-foreground ml-2">
                            {extractTime(field.value.from)}
                          </span>
                        )}
                      </>
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
            <PopoverContent className="w-auto p-4" align="start">
              <div className="space-y-4">
                {/* Calendar */}
                <Calendar
                  mode="range"
                  selected={field.value}
                  onSelect={(range) => {
                    // Preserve existing times when dates change
                    const newRange = {
                      from: range?.from
                        ? combineDateTime(
                            range.from,
                            extractTime(field.value?.from)
                          )
                        : undefined,
                      to: range?.to
                        ? combineDateTime(
                            range.to,
                            extractTime(field.value?.to)
                          )
                        : undefined,
                    };
                    field.onChange(newRange);
                  }}
                  numberOfMonths={1}
                  disabled={(date) =>
                    isBefore(startOfDay(date), startOfDay(new Date()))
                  }
                />

                {/* Time Selection */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Hora de Inicio
                    </Label>
                    <Select
                      value={extractTime(field.value?.from) || ""}
                      onValueChange={(time) => {
                        const newFrom = combineDateTime(
                          field.value?.from,
                          time
                        );
                        field.onChange({
                          ...field.value,
                          from: newFrom,
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar hora" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Hora de Fin
                    </Label>
                    <Select
                      value={extractTime(field.value?.to) || ""}
                      onValueChange={(time) => {
                        const newTo = combineDateTime(field.value?.to, time);
                        field.onChange({
                          ...field.value,
                          to: newTo,
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar hora" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}
      />
    </div>
  );
}
