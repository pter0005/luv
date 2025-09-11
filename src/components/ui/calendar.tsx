
"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "react-feather"
import { DayPicker, DropdownProps } from "react-day-picker"
import { ptBR } from 'date-fns/locale';

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"
import { ScrollArea } from "./scroll-area"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const { fromYear, toYear } = props;
  
  return (
    <DayPicker
      locale={ptBR}
      showOutsideDays={showOutsideDays}
      className={cn("p-3 bg-card/80 rounded-lg border border-border", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium hidden",
        caption_dropdowns: "flex gap-2 w-full justify-between",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary/90 focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
        Dropdown: (dropdownProps: DropdownProps) => {
           if (dropdownProps.name === "years" && (!fromYear || !toYear)) {
            return null;
          }

          const options =
            dropdownProps.name === "months"
              ? Array.from({ length: 12 }, (_, i) => ({
                  value: i,
                  label: format(new Date(2023, i), "MMMM", { locale: ptBR }),
                }))
              : Array.from({ length: toYear! - fromYear! + 1 }, (_, i) => ({
                  value: fromYear! + i,
                  label: (fromYear! + i).toString(),
                }));
          
          const handleValueChange = (value: string) => {
            if (dropdownProps.onChange) {
                const changeEvent = {
                    target: { value: value },
                } as React.ChangeEvent<HTMLSelectElement>;
                dropdownProps.onChange(changeEvent);
            }
          };

          return (
            <Select
              onValueChange={handleValueChange}
              value={dropdownProps.value?.toString()}
            >
              <SelectTrigger className="bg-card border-border w-[48%] capitalize">
                <SelectValue placeholder={dropdownProps.caption} />
              </SelectTrigger>
              <SelectContent className="max-h-60 bg-popover border-border text-popover-foreground">
                <ScrollArea>
                   {options.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value.toString()}
                      className="capitalize"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
          )
        }
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

import { format } from "date-fns";

export { Calendar }
