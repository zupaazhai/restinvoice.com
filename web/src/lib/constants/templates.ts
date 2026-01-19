import type { TemplateVariable } from "@/types/template.types";

export const DEFAULT_TEMPLATE_HTML = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice Template</title>
    <style>
        /* * General Styles
         * Using generic fonts and avoiding modern CSS units like vh/vw
         */
        body {
            font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
            color: #555;
            margin: 0;
            padding: 0;
            font-size: 16px;
            line-height: 24px;
        }

        /* * Container
         * Fixed width usually works best for PDF generation to simulate A4/Letter
         */
        .invoice-box {
            max-width: 800px;
            margin: auto;
            padding: 30px;
            border: 1px solid #eee;
            background-color: #fff;
        }

        /* * Layout Tables
         * collapse borders to prevent double lines
         */
        table {
            width: 100%;
            line-height: inherit;
            text-align: left;
            border-collapse: collapse;
        }

        table td {
            padding: 5px;
            vertical-align: top;
        }

        /* Header Alignment */
        table tr td:last-child {
            text-align: right;
        }

        /* * Top Header Section
         */
        .top-header-title {
            font-size: 45px;
            line-height: 45px;
            color: #333;
            font-weight: bold;
        }

        .company-info {
            font-size: 14px;
            line-height: 20px;
            color: #777;
        }

        /* * Information Section (Bill To / Ship To)
         */
        .information-table td {
            padding-bottom: 40px;
        }

        .info-label {
            font-weight: bold;
            color: #333;
            text-transform: uppercase;
            font-size: 12px;
            margin-bottom: 5px;
            display: block;
        }

        /* * Item List Styling
         * Specific borders for the items table
         */
        .heading td {
            background: #eee;
            border-bottom: 1px solid #ddd;
            font-weight: bold;
            font-size: 13px;
            text-transform: uppercase;
            padding: 10px 5px;
        }

        .item td {
            border-bottom: 1px solid #eee;
            padding: 10px 5px;
        }

        .item.last td {
            border-bottom: none;
        }

        /* * Totals Section
         */
        .total-row td {
            padding: 10px 5px;
            border-top: 2px solid #eee;
            font-weight: bold;
        }

        .total-label {
            text-align: right;
            padding-right: 20px;
        }

        /* * Helpers for wkhtmltopdf page breaks
         */
        tr {
            page-break-inside: avoid;
        }
    </style>
</head>
<body>
    <div class="invoice-box">
        <!-- Main Layout Table -->
        <table cellpadding="0" cellspacing="0">

            <!-- Header Row -->
            <tr class="top">
                <td colspan="2">
                    <table>
                        <tr>
                            <td class="title">
                                <!-- Using text or an img tag here -->
                                <div class="top-header-title" style="color: {{primary_color}};">INVOICE</div>
                            </td>
                            <td>
                                <strong>Invoice #:</strong> {{invoice_number}}<br>
                                <strong>Created:</strong> {{created_date}}<br>
                                <strong>Due:</strong> {{due_date}}
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>

            <!-- Company Info Row -->
            <tr>
                <td colspan="2">
                    <table>
                        <tr>
                            <td class="company-info">
                                <strong>{{company_name}}</strong><br>
                                {{company_address}}<br>
                                {{company_email}}
                            </td>
                            <td>
                                <!-- Spacer or additional info -->
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>

            <!-- Spacing Row -->
            <tr><td colspan="2" style="height: 20px;"></td></tr>

            <!-- Addresses -->
            <tr class="information">
                <td colspan="2">
                    <table class="information-table">
                        <tr>
                            <td width="50%">
                                <span class="info-label">Bill To</span><br>
                                <strong>{{client_name}}</strong><br>
                                {{client_address}}
                            </td>
                            <td width="50%">
                                <span class="info-label">Ship To</span><br>
                                <strong>{{client_name}}</strong><br>
                                {{client_address}}
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>

            <!-- Invoice Items -->
            <tr>
                <td colspan="2">
                    <table cellspacing="0" cellpadding="0">
                        <!-- Headings -->
                        <tr class="heading">
                            <td width="50%">Description</td>
                            <td width="15%" style="text-align: center;">Price</td>
                            <td width="15%" style="text-align: center;">Quantity</td>
                            <td width="20%" style="text-align: right;">Total</td>
                        </tr>

                        <!-- Item 1 -->
                        <tr class="item">
                            <td>Website Design - Homepage</td>
                            <td style="text-align: center;">$300.00</td>
                            <td style="text-align: center;">1</td>
                            <td style="text-align: right;">$300.00</td>
                        </tr>

                        <!-- Item 2 -->
                        <tr class="item">
                            <td>Hosting (Annual)</td>
                            <td style="text-align: center;">$75.00</td>
                            <td style="text-align: center;">1</td>
                            <td style="text-align: right;">$75.00</td>
                        </tr>

                        <!-- Item 3 -->
                        <tr class="item last">
                            <td>Domain Registration</td>
                            <td style="text-align: center;">$10.00</td>
                            <td style="text-align: center;">2</td>
                            <td style="text-align: right;">$20.00</td>
                        </tr>
                    </table>
                </td>
            </tr>

            <!-- Totals Section -->
            <tr>
                <td colspan="2">
                    <table cellspacing="0" cellpadding="0">
                        <tr>
                            <!-- Empty cell to push totals to the right -->
                            <td width="60%"></td>
                            <td width="40%">
                                <table cellspacing="0" cellpadding="0">
                                    <tr>
                                        <td class="total-label" style="padding: 5px; border-bottom: 1px solid #eee;">Subtotal:</td>
                                        <td style="text-align: right; padding: 5px; border-bottom: 1px solid #eee;">$395.00</td>
                                    </tr>
                                    <tr>
                                        <td class="total-label" style="padding: 5px; border-bottom: 1px solid #eee;">Tax (10%):</td>
                                        <td style="text-align: right; padding: 5px; border-bottom: 1px solid #eee;">$39.50</td>
                                    </tr>
                                    <tr class="total-row">
                                        <td class="total-label" style="font-size: 18px; color: {{primary_color}};">Total:</td>
                                        <td style="text-align: right; font-size: 18px; color: {{primary_color}};">$434.50</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>

            <!-- Notes / Footer -->
            <tr>
                <td colspan="2" style="padding-top: 50px;">
                   <strong>Notes:</strong><br>
                   <span style="font-size: 12px; color: #777;">
                       Payment is due within 15 days. Checks payable to {{company_name}}.
                       Thank you for your business!
                   </span>
                </td>
            </tr>

        </table>
    </div>
</body>
</html>`;

export const DEFAULT_TEMPLATE_VARIABLES: TemplateVariable[] = [
	{
		id: "primary_color",
		label: "Primary Color",
		type: "color",
		value: "#0087C3",
	},
	{
		id: "invoice_number",
		label: "Invoice Number",
		type: "text",
		value: "10234",
	},
	{
		id: "created_date",
		label: "Created Date",
		type: "text",
		value: "January 19, 2026",
	},
	{
		id: "due_date",
		label: "Due Date",
		type: "text",
		value: "February 01, 2026",
	},
	{
		id: "company_name",
		label: "Company Name",
		type: "text",
		value: "Acme Corp Solutions",
	},
	{
		id: "company_address",
		label: "Company Address",
		type: "text",
		value: "1234 Innovation Drive<br>Tech City, CA 94000",
	},
	{
		id: "company_email",
		label: "Company Email",
		type: "text",
		value: "support@acme.example.com",
	},
	{
		id: "client_name",
		label: "Client Name",
		type: "text",
		value: "John Doe",
	},
	{
		id: "client_address",
		label: "Client Address",
		type: "text",
		value: "555 Main Street<br>Apartment 4B<br>New York, NY 10012",
	},
];
