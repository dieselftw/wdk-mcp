"use client"

import { Menu, Search, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Sidebar } from "@/components/sidebar"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b border-primary/10 bg-background/95 backdrop-blur-sm px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 lg:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0 w-64">
          <Sidebar />
        </SheetContent>
      </Sheet>
      
      <div className="flex-1">
        <form>
          <div className="relative">
          </div>
        </form>
      </div>
      
      <div className="flex items-center gap-2">

        <ThemeSwitcher />
      </div>
    </header>
  )
}

