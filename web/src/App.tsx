import { AuthenticatedLayout } from "@/components/layout"

function App() {
  return (
    <AuthenticatedLayout
      credits={1000}
      userName="John Doe"
      userEmail="john@example.com"
    >
      {/* Grey placeholder content */}
      <div className="flex h-96 items-center justify-center rounded-lg bg-muted">
        <span className="text-muted-foreground">Content Area</span>
      </div>
    </AuthenticatedLayout>
  )
}

export default App
