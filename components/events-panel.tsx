// components/events-panel.tsx
"use client"

import { useState } from "react"
import { Clock, MapPin, Users, Star, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface Event {
    id: string
    name: string
    color: string
    genre: string
    startTime: string
    endTime: string
    location: string
    friendsGoing: number
    expectedAudience: number  // novo campo
    isLive: boolean
    isFavorite: boolean
    artists: string[]
}const mockEvents: Event[] = [
    {
        id: "1",
        name: "Bloco da Favorita",
        color: "bg-gradient-to-br from-orange-500 to-pink-600",
        genre: "Samba",
        startTime: "14:00",
        endTime: "22:00",
        location: "Av. Rio Branco",
        friendsGoing: 12,
        expectedAudience: 50000,
        isLive: true,
        isFavorite: true,
        artists: ["Anitta", "Ludmilla", "Gloria Groove"],
    },
    {
        id: "2",
        name: "Cordão do Bola Preta",
        color: "bg-gradient-to-br from-violet-600 to-indigo-700",
        genre: "Marchinhas",
        startTime: "16:00",
        endTime: "00:00",
        location: "Centro",
        friendsGoing: 8,
        expectedAudience: 800000,
        isLive: true,
        isFavorite: false,
        artists: ["Pedro Sampaio", "Dennis DJ"],
    },
    {
        id: "3",
        name: "Bloco da Preta",
        color: "bg-gradient-to-br from-emerald-500 to-teal-600",
        genre: "Funk & Pop",
        startTime: "15:00",
        endTime: "23:00",
        location: "R. da Carioca",
        friendsGoing: 5,
        expectedAudience: 200000,
        isLive: true,
        isFavorite: true,
        artists: ["Preta Gil", "Pabllo Vittar"],
    },
    {
        id: "4",
        name: "Monobloco",
        color: "bg-gradient-to-br from-amber-500 to-orange-600",
        genre: "Percussão",
        startTime: "18:00",
        endTime: "02:00",
        location: "Praça XV",
        friendsGoing: 3,
        expectedAudience: 300000,
        isLive: false,
        isFavorite: false,
        artists: ["Monobloco Band", "Special Guests"],
    },
    {
        id: "5",
        name: "Carmelitas",
        color: "bg-gradient-to-br from-rose-500 to-red-600",
        genre: "Marchinhas",
        startTime: "13:00",
        endTime: "20:00",
        location: "Santa Teresa",
        friendsGoing: 7,
        expectedAudience: 25000,
        isLive: true,
        isFavorite: false,
        artists: ["Banda Carmelitas"],
    },
    {
        id: "6",
        name: "Céu na Terra",
        color: "bg-gradient-to-br from-cyan-500 to-blue-600",
        genre: "Maracatu",
        startTime: "07:00",
        endTime: "14:00",
        location: "Santa Teresa",
        friendsGoing: 4,
        expectedAudience: 15000,
        isLive: false,
        isFavorite: true,
        artists: ["Céu na Terra"],
    },
    {
        id: "7",
        name: "Quizomba",
        color: "bg-gradient-to-br from-fuchsia-500 to-purple-600",
        genre: "Samba",
        startTime: "10:00",
        endTime: "18:00",
        location: "Lapa",
        friendsGoing: 9,
        expectedAudience: 30000,
        isLive: true,
        isFavorite: false,
        artists: ["Quizomba"],
    },
    {
        id: "8",
        name: "Banda de Ipanema",
        color: "bg-gradient-to-br from-lime-500 to-green-600",
        genre: "Marchinhas",
        startTime: "16:00",
        endTime: "22:00",
        location: "Ipanema",
        friendsGoing: 15,
        expectedAudience: 100000,
        isLive: true,
        isFavorite: true,
        artists: ["Banda de Ipanema"],
    },
    {
        id: "9",
        name: "Simpatia é Quase Amor",
        color: "bg-gradient-to-br from-sky-500 to-indigo-600",
        genre: "MPB",
        startTime: "16:00",
        endTime: "21:00",
        location: "Ipanema",
        friendsGoing: 11,
        expectedAudience: 80000,
        isLive: true,
        isFavorite: false,
        artists: ["Simpatia Band"],
    },
    {
        id: "10",
        name: "Fervo da Lud",
        color: "bg-gradient-to-br from-yellow-500 to-amber-600",
        genre: "Funk",
        startTime: "14:00",
        endTime: "22:00",
        location: "Copacabana",
        friendsGoing: 22,
        expectedAudience: 500000,
        isLive: true,
        isFavorite: true,
        artists: ["Ludmilla"],
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

            {/* Events grid */}
            <div className="flex-1 overflow-y-auto px-4 pb-4">
                <div className="grid grid-cols-2 gap-3">
                    {filteredEvents.map((event) => (
                        <div
                            key={event.id}
                            className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-colors flex flex-col"
                        >
                            {/* Event color header */}
                            <div className={cn("relative h-24", event.color)}>
                                {/* Live badge */}
                                {event.isLive && (
                                    <Badge className="absolute top-2 left-2 bg-background/80 text-foreground text-[10px] px-1.5 py-0.5 animate-pulse-music">
                                        LIVE
                                    </Badge>
                                )}

                                {/* Favorite button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        toggleFavorite(event.id)
                                    }}
                                    className="absolute top-2 right-2 p-1.5 rounded-full bg-background/50 backdrop-blur-sm hover:bg-background/70 transition-colors"
                                >
                                    <Star className={cn("w-3 h-3", event.isFavorite ? "fill-primary text-primary" : "text-foreground")} />
                                </button>

                                {/* Event name overlay */}
                                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                                    <h3 className="font-bold text-white text-sm leading-tight truncate">{event.name}</h3>
                                </div>
                            </div>

                            {/* Event details */}
                            <div className="p-2.5 flex flex-col flex-1">
                                <Badge variant="secondary" className="bg-secondary/80 text-secondary-foreground text-[10px] w-fit mb-2">
                                    {event.genre}
                                </Badge>

                                {/* Time and location */}
                                <div className="space-y-1 text-[11px] text-muted-foreground mb-2">
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-3 h-3 flex-shrink-0" />
                                        <span>{event.startTime} - {event.endTime}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3 flex-shrink-0" />
                                        <span className="truncate">{event.location}</span>
                                    </div>
                                </div>

                                {/* Público estimado e amigos */}
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                        <Users className="w-2.5 h-2.5" />
                                        <span>{event.expectedAudience.toLocaleString('pt-BR')}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] text-primary">
                                        <span>{event.friendsGoing} amigos</span>
                                    </div>
                                </div>

                                {/* Navigate button */}
                                <Button
                                    size="sm"
                                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-xs h-7 mt-auto"
                                    onClick={() => handleNavigate(event.id)}
                                >
                                    <Navigation className="w-3 h-3 mr-1" />
                                    Ir
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}