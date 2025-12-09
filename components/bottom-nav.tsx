"use client"

import { Map, Users, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

interface BottomNavProps {
  activeTab: "map" | "friends" | "events"
  onTabChange: (tab: "map" | "friends" | "events") => void
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: "map" as const, label: "Live Map", icon: Map },
    { id: "friends" as const, label: "Amigos", icon: Users },
    { id: "events" as const, label: "Blocos", icon: Calendar },
  ]

  return (
    <nav className="flex items-center justify-around py-2 bg-card border-t border-border safe-area-inset-bottom">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all",
              isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className={cn("w-6 h-6", isActive && "animate-pulse-music")} />
            <span className="text-xs font-medium">{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
