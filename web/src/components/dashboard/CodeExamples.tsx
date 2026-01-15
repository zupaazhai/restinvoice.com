import { useState } from "react";
import { Check, Copy, Code2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

const CODE_EXAMPLES = {
	curl: `curl -X POST https://api.restinvoice.com/v1/invoices/generate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "template_id": "system-modern-01",
    "data": {
      "invoice_number": "INV-2026-001",
      "date": "2026-01-15",
      "from": { "name": "Your Company", "email": "billing@company.com" },
      "to": { "name": "Client Inc", "email": "client@example.com" },
      "items": [
        { "description": "Web Development", "quantity": 10, "unit_price": 150 }
      ]
    }
  }'`,

	nodejs: `import fetch from 'node-fetch';

const response = await fetch('https://api.restinvoice.com/v1/invoices/generate', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    template_id: 'system-modern-01',
    data: {
      invoice_number: 'INV-2026-001',
      date: '2026-01-15',
      from: { name: 'Your Company', email: 'billing@company.com' },
      to: { name: 'Client Inc', email: 'client@example.com' },
      items: [
        { description: 'Web Development', quantity: 10, unit_price: 150 }
      ]
    }
  })
});

const result = await response.json();
console.log(result);`,

	php: `<?php
$ch = curl_init('https://api.restinvoice.com/v1/invoices/generate');

$data = [
    'template_id' => 'system-modern-01',
    'data' => [
        'invoice_number' => 'INV-2026-001',
        'date' => '2026-01-15',
        'from' => ['name' => 'Your Company', 'email' => 'billing@company.com'],
        'to' => ['name' => 'Client Inc', 'email' => 'client@example.com'],
        'items' => [
            ['description' => 'Web Development', 'quantity' => 10, 'unit_price' => 150]
        ]
    ]
];

curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer YOUR_API_KEY',
        'Content-Type: application/json'
    ],
    CURLOPT_POSTFIELDS => json_encode($data)
]);

$response = curl_exec($ch);
curl_close($ch);

print_r(json_decode($response, true));`,

	go: `package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "net/http"
)

func main() {
    data := map[string]interface{}{
        "template_id": "system-modern-01",
        "data": map[string]interface{}{
            "invoice_number": "INV-2026-001",
            "date":           "2026-01-15",
            "from":           map[string]string{"name": "Your Company", "email": "billing@company.com"},
            "to":             map[string]string{"name": "Client Inc", "email": "client@example.com"},
            "items": []map[string]interface{}{
                {"description": "Web Development", "quantity": 10, "unit_price": 150},
            },
        },
    }

    body, _ := json.Marshal(data)
    req, _ := http.NewRequest("POST", "https://api.restinvoice.com/v1/invoices/generate", bytes.NewBuffer(body))
    req.Header.Set("Authorization", "Bearer YOUR_API_KEY")
    req.Header.Set("Content-Type", "application/json")

    client := &http.Client{}
    resp, _ := client.Do(req)
    defer resp.Body.Close()

    fmt.Println("Status:", resp.Status)
}`,

	rust: `use reqwest::header::{AUTHORIZATION, CONTENT_TYPE};
use serde_json::json;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = reqwest::Client::new();

    let body = json!({
        "template_id": "system-modern-01",
        "data": {
            "invoice_number": "INV-2026-001",
            "date": "2026-01-15",
            "from": { "name": "Your Company", "email": "billing@company.com" },
            "to": { "name": "Client Inc", "email": "client@example.com" },
            "items": [
                { "description": "Web Development", "quantity": 10, "unit_price": 150 }
            ]
        }
    });

    let response = client
        .post("https://api.restinvoice.com/v1/invoices/generate")
        .header(AUTHORIZATION, "Bearer YOUR_API_KEY")
        .header(CONTENT_TYPE, "application/json")
        .json(&body)
        .send()
        .await?;

    println!("Status: {}", response.status());
    Ok(())
}`,
} as const;

type Language = keyof typeof CODE_EXAMPLES;

const LANGUAGE_LABELS: Record<Language, string> = {
	curl: "cURL",
	nodejs: "Node.js",
	php: "PHP",
	go: "Go",
	rust: "Rust",
};

function CodeBlock({ code, language }: { code: string; language: string }) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		await navigator.clipboard.writeText(code);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="relative">
			<Button
				variant="ghost"
				size="icon-sm"
				className="absolute right-3 top-3"
				onClick={handleCopy}
				aria-label={copied ? "Copied" : "Copy code"}
			>
				{copied ? (
					<Check className="h-4 w-4 text-chart-1" />
				) : (
					<Copy className="h-4 w-4" />
				)}
			</Button>
			<pre className="overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm leading-relaxed">
				<code className="text-foreground">{code}</code>
			</pre>
		</div>
	);
}

export function CodeExamples() {
	return (
		<Card className="rounded-xl border py-6 gap-6">
			<CardHeader className="px-6">
				<div className="flex items-center gap-3">
					<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
						<Code2 className="h-5 w-5 text-primary" />
					</div>
					<div>
						<CardTitle className="text-lg">Quick Start</CardTitle>
						<p className="text-sm text-muted-foreground">
							Generate your first invoice with these examples
						</p>
					</div>
				</div>
			</CardHeader>
			<CardContent className="px-6">
				<Tabs defaultValue="curl">
					<TabsList className="mb-4">
						{(Object.keys(CODE_EXAMPLES) as Language[]).map((lang) => (
							<TabsTrigger key={lang} value={lang}>
								{LANGUAGE_LABELS[lang]}
							</TabsTrigger>
						))}
					</TabsList>
					{(Object.entries(CODE_EXAMPLES) as [Language, string][]).map(
						([lang, code]) => (
							<TabsContent key={lang} value={lang}>
								<CodeBlock code={code} language={lang} />
							</TabsContent>
						)
					)}
				</Tabs>
			</CardContent>
		</Card>
	);
}
