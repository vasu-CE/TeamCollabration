"use client"

import * as React from "react"
import { BarChart3, Home, MessageSquare, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Sidebar() {
  return (
    <div className="w-64 border-r bg-background p-6">
      <div className="text-xl font-bold">TAPMS</div>
      <div className="mt-6 space-y-1">
        <h2 className="px-2 text-lg font-semibold tracking-tight">Discover</h2>
        <div className="space-y-1">
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Home className="h-4 w-4" />
            Dashboard
          </Button>
          <Button variant="secondary" className="w-full justify-start gap-2">
            <Users className="h-4 w-4" />
            Teams
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <MessageSquare className="h-4 w-4" />
            Communication
          </Button>
        </div>
        <h2 className="px-2 text-lg font-semibold tracking-tight">Library</h2>
        <div className="space-y-1">
          <Button variant="ghost" className="w-full justify-start gap-2">
            <BarChart3 className="h-4 w-4" />
            Projects
          </Button>
        </div>
      </div>
    </div>
  )
}
