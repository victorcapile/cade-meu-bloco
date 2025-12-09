"use client"

import { useState, useEffect } from "react"
import { MapPin, Music, Navigation, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StageCard } from "@/components/stage-card"
import { cn } from "@/lib/utils"

interface MusicStage {
  id: string
  name: string
  genre: string
  currentArtist: string
  location: { x: number; y: number }
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
    location: { x: 25, y: 30 },
    friendsCount: 12,
    isLive: true,
    lastMoved: "2 min ago",
  },
  {
    id: "2",
    name: "Cordão do Bola Preta",
    genre: "Marchinhas",
    currentArtist: "Pedro Sampaio",
    location: { x: 60, y: 45 },
    friendsCount: 8,
    isLive: true,
    lastMoved: "5 min ago",
  },
  {
    id: "3",
    name: "Bloco da Preta",
    genre: "Funk & Pop",
    currentArtist: "Preta Gil",
    location: { x: 40, y: 70 },
    friendsCount: 5,
    isLive: true,
    lastMoved: "1 min ago",
  },
  {
    id: "4",
    name: "Monobloco",
    genre: "Percussion",
    currentArtist: "Monobloco",
    location: { x: 75, y: 25 },
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
  const [stages, setStages] = useState(mockStages)
  const [userLocation] = useState({ x: 50, y: 50 })

  // Simulate stage movement
  useEffect(() => {
    const interval = setInterval(() => {
      setStages((prev) =>
        prev.map((stage) => ({
          ...stage,
          location: {
            x: Math.max(10, Math.min(90, stage.location.x + (Math.random() - 0.5) * 3)),
            y: Math.max(10, Math.min(90, stage.location.y + (Math.random() - 0.5) * 3)),
          },
        })),
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const selectedStageData = stages.find((s) => s.id === selectedStage)

  return (
    <div className="relative w-full h-full">
      {/* Map Background */}
      <div className="absolute inset-0 bg-muted/30">
        <div
          className="w-full h-full opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, var(--border) 1px, transparent 1px),
              linear-gradient(to bottom, var(--border) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Street labels */}
        <div className="absolute top-[20%] left-[10%] text-xs text-muted-foreground/50 rotate-0">Av. Rio Branco</div>
        <div className="absolute top-[50%] left-[5%] text-xs text-muted-foreground/50 -rotate-90">R. da Carioca</div>
        <div className="absolute bottom-[30%] right-[15%] text-xs text-muted-foreground/50">Praça XV</div>
      </div>

      {/* Music Stages */}
      {stages.map((stage) => (
        <button
          key={stage.id}
          onClick={() => onSelectStage(stage.id === selectedStage ? null : stage.id)}
          className={cn(
            "absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 z-10",
            selectedStage === stage.id && "z-20",
          )}
          style={{ left: `${stage.location.x}%`, top: `${stage.location.y}%` }}
        >
          <div className={cn("relative flex items-center justify-center", stage.isLive && "animate-pulse-music")}>
            {/* Pulse rings for live stages */}
            {stage.isLive && (
              <>
                <div className="absolute w-16 h-16 rounded-full bg-primary/20 animate-ping" />
                <div className="absolute w-12 h-12 rounded-full bg-primary/30" />
              </>
            )}

            {/* Stage marker */}
            <div
              className={cn(
                "relative w-10 h-10 rounded-full flex items-center justify-center shadow-lg",
                stage.isLive ? "bg-primary" : "bg-muted",
                selectedStage === stage.id && "ring-2 ring-secondary ring-offset-2 ring-offset-background",
              )}
            >
              <Music className={cn("w-5 h-5", stage.isLive ? "text-primary-foreground" : "text-muted-foreground")} />
            </div>

            {/* Friends badge */}
            {stage.friendsCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 min-w-5 flex items-center justify-center p-0 bg-secondary text-secondary-foreground text-xs">
                {stage.friendsCount}
              </Badge>
            )}
          </div>

          {/* Stage name label */}
          <div
            className={cn(
              "mt-1 px-2 py-0.5 rounded-md text-xs font-medium whitespace-nowrap transition-all",
              selectedStage === stage.id ? "bg-primary text-primary-foreground" : "bg-card/90 text-foreground",
            )}
          >
            {stage.name}
          </div>
        </button>
      ))}

      {/* User location */}
      <div
        className="absolute transform -translate-x-1/2 -translate-y-1/2 z-30"
        style={{ left: `${userLocation.x}%`, top: `${userLocation.y}%` }}
      >
        <div className="relative">
          <div className="absolute w-8 h-8 rounded-full bg-accent/30 animate-ping" />
          <div className="relative w-6 h-6 rounded-full bg-accent border-2 border-background flex items-center justify-center">
            <Navigation className="w-3 h-3 text-accent-foreground" />
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 space-y-2">
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 rounded-full bg-primary animate-pulse-music" />
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

      {/* Recenter button */}
      <Button size="icon" variant="secondary" className="absolute bottom-24 right-4 rounded-full shadow-lg">
        <MapPin className="w-5 h-5" />
      </Button>

      {/* Selected stage card */}
      {selectedStageData && (
        <div className="absolute bottom-20 left-4 right-4">
          <StageCard stage={selectedStageData} onClose={() => onSelectStage(null)} />
        </div>
      )}

      {/* Live indicator */}
      <div className="absolute top-4 right-4 flex items-center gap-2 bg-card/90 backdrop-blur-sm rounded-full px-3 py-1.5">
        <Volume2 className="w-4 h-4 text-primary animate-pulse-music" />
        <span className="text-xs font-medium text-foreground">{stages.filter((s) => s.isLive).length} blocos ao vivo</span>
      </div>
    </div>
  )
}
