"use client"

import { useState } from "react"
import { BottomNav } from "@/components/bottom-nav"
import { MapView } from "@/components/map-view"
import { FriendsPanel } from "@/components/friends-panel"
import { EventsPanel } from "@/components/events-panel"
import { Header } from "@/components/header"

export default function CarnivalApp() {
  const [activeTab, setActiveTab] = useState<"map" | "friends" | "events">("map")
  const [selectedStage, setSelectedStage] = useState<string | null>(null)

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header />

      <main className="flex-1 overflow-hidden relative">
        {activeTab === "map" && <MapView selectedStage={selectedStage} onSelectStage={setSelectedStage} />}
        {activeTab === "friends" && <FriendsPanel />}
        {activeTab === "events" && (
          <EventsPanel onSelectStage={setSelectedStage} onNavigate={() => setActiveTab("map")} />
        )}
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
