"use client"

import { X, Navigation, Users, Clock, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface StageCardProps {
  stage: {
    id: string
    name: string
    genre: string
    currentArtist: string
    friendsCount: number
    isLive: boolean
    lastMoved: string
  }
  onClose: () => void
}

const friendAvatars = [
  { name: "Ana", image: "/woman-with-carnival-makeup.jpg" },
  { name: "Pedro", image: "/man-with-sunglasses-party.jpg" },
  { name: "Maria", image: "/woman-dancing-carnival.jpg" },
]

export function StageCard({ stage, onClose }: StageCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 shadow-xl animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-foreground">{stage.name}</h3>
            {stage.isLive && (
              <Badge variant="default" className="bg-primary text-primary-foreground text-xs">
                LIVE
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{stage.genre}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="bg-muted rounded-lg p-3 mb-3">
        <p className="text-xs text-muted-foreground mb-1">Ao vivo</p>
        <p className="font-semibold text-foreground">{stage.currentArtist}</p>
      </div>

      <div className="flex items-center gap-4 mb-4 text-sm">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>Moved {stage.lastMoved}</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Users className="w-4 h-4" />
          <span>{stage.friendsCount} amigos aqui</span>
        </div>
      </div>

      {stage.friendsCount > 0 && (
        <div className="flex items-center gap-2 mb-4">
          <div className="flex -space-x-2">
            {friendAvatars.slice(0, Math.min(3, stage.friendsCount)).map((friend, i) => (
              <Avatar key={i} className="w-8 h-8 border-2 border-card">
                <AvatarImage src={friend.image || "/placeholder.svg"} alt={friend.name} />
                <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                  {friend.name[0]}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
          {stage.friendsCount > 3 && (
            <span className="text-xs text-muted-foreground">+{stage.friendsCount - 3} more</span>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
          <Navigation className="w-4 h-4 mr-2" />
          Navigate
        </Button>
        <Button variant="outline" size="icon">
          <Share2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
