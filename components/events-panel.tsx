"use client"

import { useState } from "react"
import { Clock, MapPin, Users, ChevronRight, Star, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface Event {
  id: string
  name: string
  image: string
  genre: string
  startTime: string
  endTime: string
  location: string
  friendsGoing: number
  isLive: boolean
  isFavorite: boolean
  artists: string[]
}

const mockEvents: Event[] = [
  {
    id: "1",
    name: "Bloco da Favorita",
    image: "",
    genre: "Samba",
    startTime: "14:00",
    endTime: "22:00",
    location: "Av. Rio Branco",
    friendsGoing: 12,
    isLive: true,
    isFavorite: true,
    artists: ["Anitta", "Ludmilla", "Gloria Groove"],
  },
  {
    id: "2",
    name: "Cordão do Bola Preta",
    image: "",
    genre: "Marchinhas",
    startTime: "16:00",
    endTime: "00:00",
    location: "Centro",
    friendsGoing: 8,
    isLive: true,
    isFavorite: false,
    artists: ["Pedro Sampaio", "Dennis DJ"],
  },
  {
    id: "3",
    name: "Bloco da Preta",
    image: "",
    genre: "Funk & Pop",
    startTime: "15:00",
    endTime: "23:00",
    location: "R. da Carioca",
    friendsGoing: 5,
    isLive: true,
    isFavorite: true,
    artists: ["Preta Gil", "Pabllo Vittar"],
  },
  {
    id: "4",
    name: "Monobloco",
    image: "",
    genre: "Percussion",
    startTime: "18:00",
    endTime: "02:00",
    location: "Praça XV",
    friendsGoing: 3,
    isLive: false,
    isFavorite: false,
    artists: ["Monobloco Band", "Special Guests"],
  },
]

interface EventsPanelProps {
  onSelectStage: (id: string) => void
  onNavigate: () => void
}

export function EventsPanel({ onSelectStage, onNavigate }: EventsPanelProps) {
  const [events, setEvents] = useState(mockEvents)
  const [filter, setFilter] = useState<"all" | "live" | "favorites">("all")

  const toggleFavorite = (id: string) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, isFavorite: !e.isFavorite } : e)))
  }

  const filteredEvents = events.filter((event) => {
    if (filter === "live") return event.isLive
    if (filter === "favorites") return event.isFavorite
    return true
  })

  const handleNavigate = (id: string) => {
    onSelectStage(id)
    onNavigate()
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-4">
        <h2 className="text-xl font-bold text-foreground mb-1">Blocos Hoje</h2>
        <p className="text-sm text-muted-foreground mb-4">
          {events.filter((e) => e.isLive).length} blocos acontecendo agora
        </p>

        {/* Filter pills */}
        <div className="flex gap-2">
          {[
            { id: "all", label: "Todos" },
            { id: "live", label: "Ao vivo" },
            { id: "favorites", label: "Favoritos" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as typeof filter)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
                filter === f.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Events list */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="space-y-4">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-colors"
            >
              {/* Event image */}
              <div className="relative h-36">
                <img src={event.image || "/placeholder.svg"} alt={event.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />

                {/* Live badge */}
                {event.isLive && (
                  <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground animate-pulse-music">
                    LIVE
                  </Badge>
                )}

                {/* Favorite button */}
                <button
                  onClick={() => toggleFavorite(event.id)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-background/50 backdrop-blur-sm hover:bg-background/70 transition-colors"
                >
                  <Star className={cn("w-4 h-4", event.isFavorite ? "fill-primary text-primary" : "text-foreground")} />
                </button>

                {/* Event name overlay */}
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="font-bold text-foreground text-lg">{event.name}</h3>
                  <Badge variant="secondary" className="bg-secondary/80 text-secondary-foreground mt-1">
                    {event.genre}
                  </Badge>
                </div>
              </div>

              {/* Event details */}
              <div className="p-4">
                {/* Time and location */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>
                      {event.startTime} - {event.endTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                </div>

                {/* Artists */}
                <div className="mb-3">
                  <p className="text-xs text-muted-foreground mb-1">Artists</p>
                  <p className="text-sm text-foreground">{event.artists.join(" • ")}</p>
                </div>

                {/* Friends going */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].slice(0, Math.min(3, event.friendsGoing)).map((_, i) => (
                        <Avatar key={i} className="w-6 h-6 border-2 border-card">
                          <AvatarImage src={`/diverse-group.png?height=24&width=24&query=person ${i + 1}`} />
                          <AvatarFallback className="bg-muted text-muted-foreground text-xs">{i + 1}</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {event.friendsGoing} amigos
                    </span>
                  </div>

                  <Button
                    size="sm"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1"
                    onClick={() => handleNavigate(event.id)}
                  >
                    <Navigation className="w-4 h-4" />
                    Find it
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
