import { Route, Routes } from "react-router-dom";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { AuthenticatedLayout } from "@/components/layout";
import { ApiKeysPage } from "@/pages/ApiKeysPage";
import { LoginPage } from "@/pages/auth/LoginPage";
import { LogoutPage } from "@/pages/auth/LogoutPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { MyTemplatesPage } from "@/pages/MyTemplatesPage";
import { TemplateEditorPage } from "@/pages/TemplateEditorPage";
import { TemplatesPage } from "@/pages/TemplatesPage";

function App() {
	return (
		<Routes>
			<Route path="/login" element={<LoginPage />} />
			<Route path="/logout" element={<LogoutPage />} />
			<Route
				path="*"
				element={
					<RequireAuth>
						<AuthenticatedLayout credits={1000} userName="John Doe" userEmail="john@example.com">
							<Routes>
								<Route path="/" element={<DashboardPage />} />
								<Route path="/templates" element={<TemplatesPage />} />
								<Route path="/my-templates" element={<MyTemplatesPage />} />
								<Route path="/my-templates/:id/edit" element={<TemplateEditorPage />} />
								<Route path="/api-keys" element={<ApiKeysPage />} />
							</Routes>
						</AuthenticatedLayout>
					</RequireAuth>
				}
			/>
		</Routes>
	);
}

export default App;
