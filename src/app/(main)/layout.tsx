import { Sidebar, MobileNav } from '@/shared/components/Sidebar'
import { TopBar } from '@/shared/components/TopBar'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 px-5 lg:px-8 py-6 lg:py-8 pb-24 lg:pb-8 max-w-[1400px] w-full mx-auto">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
