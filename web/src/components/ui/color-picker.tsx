"use client";

import { Paintbrush } from "lucide-react";
import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
	value?: string;
	onChange?: (value: string) => void;
	className?: string;
}

export function ColorPicker({ value = "#000000", onChange, className }: ColorPickerProps) {
	const [open, setOpen] = useState(false);

	const handleColorChange = (newColor: string) => {
		onChange?.(newColor);
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
					<div className="flex w-full items-center gap-2">
						<div
							className="h-4 w-4 rounded !bg-cover !bg-center transition-all"
							style={{ background: value }}
						/>
						<div className="flex-1 truncate">{value}</div>
						<Paintbrush className="ml-auto h-4 w-4" />
					</div>
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" align="start">
				<div className="space-y-3 p-3">
					<HexColorPicker color={value} onChange={handleColorChange} />
					<Input
						id="custom"
						value={value}
						onChange={(e) => handleColorChange(e.target.value)}
						className="col-span-2 h-8"
					/>
				</div>
			</PopoverContent>
		</Popover>
	);
}
