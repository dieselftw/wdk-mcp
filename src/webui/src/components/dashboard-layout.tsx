import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="hidden border-r border-primary/10 bg-sidebar lg:block w-64">
        <Sidebar />
      </aside>
      <div className="flex flex-1 flex-col">
        <Navbar />
        <main className="flex-1 p-4 lg:p-6 bg-gradient-to-br from-background via-background to-primary/5">
          {children}
        </main>
      </div>
    </div>
  )
}

