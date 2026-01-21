"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { useState } from "react";

interface DateTimePickerProps {
	value?: string;
	onChange?: (value: string) => void;
	className?: string;
}

export function DateTimePicker({ value, onChange, className }: DateTimePickerProps) {
	const [open, setOpen] = useState(false);

	// Parse ISO datetime string or default to current date/time
	const dateValue = value ? new Date(value) : undefined;
	const timeValue = dateValue ? format(dateValue, "HH:mm") : "12:00";

	const handleDateSelect = (date: Date | undefined) => {
		if (date && value) {
			// Keep existing time when changing date
			const [hours, minutes] = timeValue.split(":").map(Number);
			date.setHours(hours, minutes);
			onChange?.(date.toISOString().slice(0, 16)); // Format: YYYY-MM-DDTHH:mm
		} else if (date) {
			// New date selection with default time
			const [hours, minutes] = timeValue.split(":").map(Number);
			date.setHours(hours, minutes);
			onChange?.(date.toISOString().slice(0, 16));
		}
	};

	const handleTimeChange = (time: string) => {
		if (dateValue) {
			const [hours, minutes] = time.split(":").map(Number);
			const newDate = new Date(dateValue);
			newDate.setHours(hours, minutes);
			onChange?.(newDate.toISOString().slice(0, 16));
		}
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
					{dateValue ? (
						<>
							{format(dateValue, "PPP")}
							<Clock className="mx-2 h-3 w-3" />
							{format(dateValue, "HH:mm")}
						</>
					) : (
						<span>Pick a date and time</span>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" align="start">
				<div className="space-y-3 p-3">
					<Calendar mode="single" selected={dateValue} onSelect={handleDateSelect} initialFocus />
					<div className="flex items-center gap-2 border-t pt-3">
						<Clock className="h-4 w-4 text-muted-foreground" />
						<Input
							type="time"
							value={timeValue}
							onChange={(e) => handleTimeChange(e.target.value)}
							className="h-8"
						/>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}
