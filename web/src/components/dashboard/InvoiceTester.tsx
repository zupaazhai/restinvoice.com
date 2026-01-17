import { ChevronDown, FileText, Key, Play } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const MOCK_API_KEYS = [
	{ label: "Test Key (sk_test_...)", value: "sk_test_51Mz..." },
	{ label: "Live Key (sk_live_...)", value: "sk_live_29Ka..." },
];

export function InvoiceTester() {
	const [selectedKey, setSelectedKey] = useState(MOCK_API_KEYS[0]);
	const [templateId, setTemplateId] = useState("system-modern-01");
	const [loading, setLoading] = useState(false);

	const handleTest = async () => {
		setLoading(true);
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1500));
		setLoading(false);
	};

	return (
		<Card className="h-full rounded-xl border py-6 gap-6">
			<CardHeader className="px-6">
				<div className="flex items-center gap-3">
					<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
						<Play className="h-5 w-5 text-primary" />
					</div>
					<div>
						<CardTitle className="text-lg">Test Invoice</CardTitle>
						<p className="text-sm text-muted-foreground">
							Quickly generate a test invoice
						</p>
					</div>
				</div>
			</CardHeader>
			<CardContent className="px-6 grid gap-6 flex-1 flex flex-col">
				<div className="space-y-6">
					<div className="space-y-2">
						<Label>API Key</Label>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline" className="w-full justify-between px-3">
									<span className="flex items-center gap-2 truncate">
										<Key className="h-4 w-4 text-muted-foreground" />
										{selectedKey.label}
									</span>
									<ChevronDown className="h-4 w-4 opacity-50" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="start" className="w-[--radix-dropdown-menu-trigger-width]">
								{MOCK_API_KEYS.map((key) => (
									<DropdownMenuItem
										key={key.value}
										onClick={() => setSelectedKey(key)}
										className="cursor-pointer"
									>
										{key.label}
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					<div className="space-y-2">
						<Label htmlFor="template-id">Template ID</Label>
						<div className="relative">
							<FileText className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								id="template-id"
								placeholder="e.g. system-modern-01"
								value={templateId}
								onChange={(e) => setTemplateId(e.target.value)}
								className="pl-9"
							/>
						</div>
					</div>
				</div>

				<div className="mt-auto">
					<Button
						className="w-full"
						onClick={handleTest}
						disabled={loading}
					>
						{loading ? (
							"Generating..."
						) : (
							<>
								<Play className="h-4 w-4 mr-2" />
								Generate
							</>
						)}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
