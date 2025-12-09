// components/friends-panel.tsx
"use client"

import { useState } from "react"
import { Search, UserPlus, MapPin, Music, Instagram } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface Friend {
    id: string
    name: string
    avatar: string
    status: "at-carnival" | "maybe" | "offline"
    currentStage?: string
    socialPlatform: "instagram" | "whatsapp"
    lastSeen?: string
}

const mockFriends: Friend[] = [
    {
        id: "1",
        name: "Ana Carolina",
        avatar: "/woman-carnival-costume.jpg",
        status: "at-carnival",
        currentStage: "Bloco da Favorita",
        socialPlatform: "instagram",
    },
    {
        id: "2",
        name: "Pedro Santos",
        avatar: "/man-festival-outfit.jpg",
        status: "at-carnival",
        currentStage: "Cordão do Bola Preta",
        socialPlatform: "instagram",
    },
    {
        id: "3",
        name: "Maria Silva",
        avatar: "/woman-party-outfit.jpg",
        status: "offline",
        socialPlatform: "instagram",
        lastSeen: "Em casa",
    },
    {
        id: "4",
        name: "João Costa",
        avatar: "/man-casual-party.jpg",
        status: "at-carnival",
        currentStage: "Bloco da Preta",
        socialPlatform: "instagram",
    },
    {
        id: "5",
        name: "Lucia Ferreira",
        avatar: "/woman-summer-dress.jpg",
        status: "at-carnival",
        currentStage: "Carmelitas",
        socialPlatform: "instagram",
        lastSeen: "",
    },
    {
        id: "6",
        name: "Rafael Lima",
        avatar: "/man-sunglasses-beach.jpg",
        status: "offline",
        socialPlatform: "instagram",
        lastSeen: "Em casa",
    },
]

const statusConfig = {
    "at-carnival": { label: "No Carnaval", color: "bg-orange-500", textColor: "text-orange-400" },
    maybe: { label: "Talvez", color: "bg-yellow-500", textColor: "text-yellow-400" },
    offline: { label: "Em casa", color: "bg-zinc-500", textColor: "text-zinc-400" },
}

export function FriendsPanel() {
    const [searchQuery, setSearchQuery] = useState("")
    const [activeFilter, setActiveFilter] = useState<"all" | "at-carnival" | "offline">("all")

    const filteredFriends = mockFriends.filter((friend) => {
        const matchesSearch = friend.name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesFilter = activeFilter === "all" || friend.status === activeFilter
        return matchesSearch && matchesFilter
    })

    const atCarnivalCount = mockFriends.filter((f) => f.status === "at-carnival").length
    const atHomeCount = mockFriends.filter((f) => f.status === "offline").length

    return (
        <div className="flex flex-col h-full bg-background">
            {/* Header */}
            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-foreground">Amigos</h2>
                        <p className="text-sm text-muted-foreground">
                            {atCarnivalCount} no carnaval, {atHomeCount} em casa
                        </p>
                    </div>
                    <Button size="sm" variant="outline" className="gap-2 bg-transparent hover:!bg-zinc-800">
                        <UserPlus className="w-4 h-4" />
                        Convidar
                    </Button>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar amigos..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-muted border-border"
                    />
                </div>

                {/* Connect Social */}
                <div className="bg-card border border-border rounded-lg p-3">
                    <p className="text-sm font-medium text-foreground mb-2">Conecte sua rede para descobrir amigos!</p>
                    <Button
                        size="sm"
                        variant="outline"
                        className="w-full gap-2 border-secondary text-secondary hover:!bg-secondary/10 bg-transparent"
                    >
                        <Instagram className="w-4 h-4" />
                        Instagram
                    </Button>
                </div>

                {/* Filter tabs */}
                <Tabs value={activeFilter} onValueChange={(v) => setActiveFilter(v as typeof activeFilter)}>
                    <TabsList className="w-full bg-muted">
                        <TabsTrigger value="all" className="flex-1">
                            Todos
                        </TabsTrigger>
                        <TabsTrigger value="at-carnival" className="flex-1">
                            No Carnaval
                        </TabsTrigger>
                        <TabsTrigger value="offline" className="flex-1">
                            Em casa
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {/* Friends grid - 3 por linha */}
            <div className="flex-1 overflow-y-auto px-4 pb-4">
                <div className="grid grid-cols-3 gap-2">
                    {filteredFriends.map((friend) => {
                        const status = statusConfig[friend.status]

                        return (
                            <div
                                key={friend.id}
                                className="flex flex-col items-center p-3 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors"
                            >
                                {/* Avatar com status */}
                                <div className="relative mb-2">
                                    <Avatar className="w-14 h-14">
                                        <AvatarImage src={friend.avatar || "/placeholder.svg"} alt={friend.name} />
                                        <AvatarFallback className="bg-muted text-muted-foreground text-sm">
                                            {friend.name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div
                                        className={cn(
                                            "absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-card",
                                            status.color,
                                        )}
                                    />
                                </div>

                                {/* Nome */}
                                <span className="font-medium text-foreground text-xs text-center truncate w-full">
                  {friend.name.split(" ")[0]}
                </span>

                                {/* Status / Bloco */}
                                {friend.status === "at-carnival" && friend.currentStage ? (
                                    <div className="flex flex-col items-center gap-0.5 text-[10px] text-orange-400 mt-1">
                                        <span className="text-center leading-tight">{friend.currentStage}</span>
                                    </div>
                                ) : (
                                    <span className={cn("text-[10px] mt-1", status.textColor)}>
    {friend.lastSeen || status.label}
  </span>
                                )}

                                {/* Botão de localização */}
                                {friend.status === "at-carnival" && (
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-primary hover:text-primary hover:!bg-primary/10 h-6 w-6 p-0 mt-1"
                                    >
                                        <MapPin className="w-3 h-3" />
                                    </Button>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}