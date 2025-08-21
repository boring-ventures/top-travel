import { Calendar, Clock } from "lucide-react";
import {
  formatDate,
  formatTime,
  isSameDay,
  calculateDuration,
  formatDuration,
} from "@/lib/date-utils";

interface DateTimeDisplayProps {
  startDate: Date;
  endDate: Date;
  showTime?: boolean;
  showDuration?: boolean;
  className?: string;
}

export function DateTimeDisplay({
  startDate,
  endDate,
  showTime = false,
  showDuration = false,
  className,
}: DateTimeDisplayProps) {
  const sameDay = isSameDay(startDate, endDate);
  const duration = calculateDuration(startDate, endDate);

  return (
    <div className={`space-y-2 ${className || ""}`}>
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4" />
        <span>
          {sameDay ? (
            formatDate(startDate)
          ) : (
            <>
              {formatDate(startDate)} - {formatDate(endDate)}
            </>
          )}
        </span>
      </div>

      {showTime && (
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>
            {formatTime(startDate)} - {formatTime(endDate)}
          </span>
        </div>
      )}

      {showDuration && (
        <div className="text-sm text-muted-foreground">
          Duración: {formatDuration(duration)}
        </div>
      )}
    </div>
  );
}

interface DateRangeProps {
  startDate: Date;
  endDate: Date;
  className?: string;
}

export function DateRange({ startDate, endDate, className }: DateRangeProps) {
  const sameDay = isSameDay(startDate, endDate);

  return (
    <div className={`flex items-center gap-2 ${className || ""}`}>
      <Calendar className="h-4 w-4" />
      <span>
        {sameDay ? (
          formatDate(startDate)
        ) : (
          <>
            {formatDate(startDate)} - {formatDate(endDate)}
          </>
        )}
      </span>
    </div>
  );
}

interface DurationDisplayProps {
  startDate: Date;
  endDate: Date;
  className?: string;
}

export function DurationDisplay({
  startDate,
  endDate,
  className,
}: DurationDisplayProps) {
  const duration = calculateDuration(startDate, endDate);

  return (
    <div className={`flex items-center gap-2 ${className || ""}`}>
      <Clock className="h-4 w-4" />
      <span>{formatDuration(duration)}</span>
    </div>
  );
}

