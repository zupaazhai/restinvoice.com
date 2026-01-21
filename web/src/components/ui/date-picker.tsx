"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";

interface DatePickerProps {
	value?: string;
	onChange?: (value: string) => void;
	className?: string;
}

export function DatePicker({ value, onChange, className }: DatePickerProps) {
	const [open, setOpen] = useState(false);

	// Parse the ISO date string to Date object
	const dateValue = value ? new Date(value) : undefined;

	const handleSelect = (date: Date | undefined) => {
		if (date) {
			// Format as ISO date string (YYYY-MM-DD)
			const isoDate = format(date, "yyyy-MM-dd");
			onChange?.(isoDate);
		}
		setOpen(false);
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					className={cn(
						"w-full justify-start text-left font-normal",
						!value && "text-muted-foreground",
						className
					)}
				>
					<CalendarIcon className="mr-2 h-4 w-4" />
					{dateValue ? format(dateValue, "PPP") : <span>Pick a date</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" align="start">
				<Calendar mode="single" selected={dateValue} onSelect={handleSelect} initialFocus />
			</PopoverContent>
		</Popover>
	);
}
