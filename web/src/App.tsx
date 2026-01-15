import { Route, Routes } from "react-router-dom";
import { AuthenticatedLayout } from "@/components/layout";
import { ApiKeysPage } from "@/pages/ApiKeysPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { TemplatesPage } from "@/pages/TemplatesPage";

function App() {
	return (
		<AuthenticatedLayout credits={1000} userName="John Doe" userEmail="john@example.com">
			<Routes>
				<Route path="/" element={<DashboardPage />} />
				<Route path="/templates" element={<TemplatesPage />} />
				<Route path="/api-keys" element={<ApiKeysPage />} />
			</Routes>
		</AuthenticatedLayout>
	);
}

export default App;
