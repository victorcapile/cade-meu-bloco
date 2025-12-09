"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { MapPin, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StageCard } from "@/components/stage-card"

// Import dinâmico pra evitar SSR (Leaflet não funciona no servidor)
const LeafletMap = dynamic(() => import("@/components/leaflet-map").then(mod => mod.LeafletMap), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-muted/30 animate-pulse" />,
})

interface MusicStage {
    id: string
    name: string
    genre: string
    currentArtist: string
    location: { lat: number; lng: number }
    friendsCount: number
    isLive: boolean
    lastMoved: string
}

const mockStages: MusicStage[] = [
    {
        id: "1",
        name: "Bloco da Favorita",
        genre: "Samba",
        currentArtist: "Anitta & Band",
        location: { lat: -22.9035, lng: -43.1823 },
        friendsCount: 12,
        isLive: true,
        lastMoved: "2 min ago",
    },
    {
        id: "2",
        name: "Cordão do Bola Preta",
        genre: "Marchinhas",
        currentArtist: "Pedro Sampaio",
        location: { lat: -22.9055, lng: -43.1765 },
        friendsCount: 8,
        isLive: true,
        lastMoved: "5 min ago",
    },
    {
        id: "3",
        name: "Bloco da Preta",
        genre: "Funk & Pop",
        currentArtist: "Preta Gil",
        location: { lat: -22.9085, lng: -43.1790 },
        friendsCount: 5,
        isLive: true,
        lastMoved: "1 min ago",
    },
    {
        id: "4",
        name: "Monobloco",
        genre: "Percussion",
        currentArtist: "Monobloco",
        location: { lat: -22.9020, lng: -43.1740 },
        friendsCount: 3,
        isLive: false,
        lastMoved: "Starting soon",
    },
]

interface MapViewProps {
    selectedStage: string | null
    onSelectStage: (id: string | null) => void
}

export function MapView({ selectedStage, onSelectStage }: MapViewProps) {
    const [stages] = useState(mockStages)
    const [userLocation] = useState({ lat: -22.9068, lng: -43.1729 })

    const selectedStageData = stages.find((s) => s.id === selectedStage)

    return (
        <div className="relative w-full h-full">
            <LeafletMap
                stages={stages}
                userLocation={userLocation}
                selectedStage={selectedStage}
                onSelectStage={onSelectStage}
            />

            {/* Legend */}
            <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 space-y-2 z-[1000]">
                <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                    <span className="text-foreground">Bloco rolando</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full bg-muted" />
                    <span className="text-muted-foreground">Começando em breve</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full bg-accent" />
                    <span className="text-foreground">Você</span>
                </div>
            </div>

            {/* Live indicator */}
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-card/90 backdrop-blur-sm rounded-full px-3 py-1.5 z-[1000]">
                <Volume2 className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-xs font-medium text-foreground">
          {stages.filter((s) => s.isLive).length} blocos ao vivo
        </span>
            </div>

            {/* Recenter button */}
            <Button
                size="icon"
                variant="secondary"
                className="absolute bottom-24 right-4 rounded-full shadow-lg z-[1000]"
            >
                <MapPin className="w-5 h-5" />
            </Button>

            {/* Selected stage card */}
            {selectedStageData && (
                <div className="absolute bottom-20 left-4 right-4 z-[1000]">
                    <StageCard stage={selectedStageData} onClose={() => onSelectStage(null)} />
                </div>
            )}
        </div>
    )
}