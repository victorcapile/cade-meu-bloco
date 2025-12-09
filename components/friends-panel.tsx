"use client"

import { useState } from "react"
import { Search, UserPlus, MapPin, Music, Instagram, MessageCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface Friend {
  id: string
  name: string
  avatar: string
  status: "at-carnival" | "going" | "maybe" | "offline"
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
    socialPlatform: "whatsapp",
  },
  {
    id: "3",
    name: "Maria Silva",
    avatar: "/woman-party-outfit.jpg",
    status: "going",
    socialPlatform: "instagram",
    lastSeen: "Arriving in 30 min",
  },
  {
    id: "4",
    name: "João Costa",
    avatar: "/man-casual-party.jpg",
    status: "at-carnival",
    currentStage: "Bloco da Preta",
    socialPlatform: "whatsapp",
  },
  {
    id: "5",
    name: "Lucia Ferreira",
    avatar: "/woman-summer-dress.jpg",
    status: "maybe",
    socialPlatform: "instagram",
    lastSeen: "Might join later",
  },
  {
    id: "6",
    name: "Rafael Lima",
    avatar: "/man-sunglasses-beach.jpg",
    status: "offline",
    socialPlatform: "whatsapp",
    lastSeen: "Last seen 2h ago",
  },
]

const statusConfig = {
  "at-carnival": { label: "At Carnival", color: "bg-primary", textColor: "text-primary" },
  going: { label: "On the way", color: "bg-accent", textColor: "text-accent" },
  maybe: { label: "Maybe", color: "bg-chart-4", textColor: "text-chart-4" },
  offline: { label: "Offline", color: "bg-muted", textColor: "text-muted-foreground" },
}

export function FriendsPanel() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<"all" | "at-carnival" | "going">("all")

  const filteredFriends = mockFriends.filter((friend) => {
    const matchesSearch = friend.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = activeFilter === "all" || friend.status === activeFilter
    return matchesSearch && matchesFilter
  })

  const atCarnivalCount = mockFriends.filter((f) => f.status === "at-carnival").length
  const goingCount = mockFriends.filter((f) => f.status === "going").length

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">Friends</h2>
            <p className="text-sm text-muted-foreground">
              {atCarnivalCount} no carnaval, {goingCount} a caminho
            </p>
          </div>
          <Button size="sm" variant="outline" className="gap-2 bg-transparent">
            <UserPlus className="w-4 h-4" />
            Invite
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search friends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-muted border-border"
          />
        </div>

          {/* Connect Social */}
          <div className="px-4 pb-4">
              <div className="bg-card border border-border rounded-lg p-3">
                  <p className="text-sm font-medium text-foreground mb-2">Conecte sua rede para descobrir amigos!</p>
                  <div className="flex gap-2">
                      <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 gap-2 border-secondary text-secondary hover:bg-secondary/10 bg-transparent"
                      >
                          <Instagram className="w-4 h-4" />
                          Instagram
                      </Button>
                  </div>
              </div>
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
            <TabsTrigger value="going" className="flex-1">
              Chegando
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>



      {/* Friends list */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="space-y-2">
          {filteredFriends.map((friend) => {
            const status = statusConfig[friend.status]

            return (
              <div
                key={friend.id}
                className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors"
              >
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={friend.avatar || "/placeholder.svg"} alt={friend.name} />
                    <AvatarFallback className="bg-muted text-muted-foreground">
                      {friend.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={cn(
                      "absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-card",
                      status.color,
                    )}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground truncate">{friend.name}</span>
                    {friend.socialPlatform === "instagram" ? (
                      <Instagram className="w-3.5 h-3.5 text-secondary" />
                    ) : (
                      <MessageCircle className="w-3.5 h-3.5 text-accent" />
                    )}
                  </div>

                  {friend.status === "at-carnival" && friend.currentStage ? (
                    <div className="flex items-center gap-1 text-sm text-primary">
                      <Music className="w-3 h-3" />
                      <span className="truncate">{friend.currentStage}</span>
                    </div>
                  ) : (
                    <span className={cn("text-sm", status.textColor)}>{friend.lastSeen || status.label}</span>
                  )}
                </div>

                {friend.status === "at-carnival" && (
                  <Button size="sm" variant="ghost" className="text-primary hover:text-primary hover:bg-primary/10">
                    <MapPin className="w-4 h-4" />
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
