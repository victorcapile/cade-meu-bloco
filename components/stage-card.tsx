// components/stage-card.tsx
"use client"

import { useState } from "react"
import { X, Navigation, Users, Share2, MapPin, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface StageCardProps {
    stage: {
        id: string
        name: string
        genre: string
        currentArtist: string
        location: { lat: number; lng: number }
        address: string
        friendsCount: number
        isLive: boolean
        isFixed: boolean
        lastMoved: string
    }
    userLocation: { lat: number; lng: number }
    isFavorite?: boolean
    onToggleFavorite?: (id: string) => void
    onClose: () => void
}

export function StageCard({ stage, userLocation, isFavorite = false, onToggleFavorite, onClose }: StageCardProps) {
    const handleNavigate = () => {
        const origin = `${userLocation.lat},${userLocation.lng}`
        const destination = `${stage.location.lat},${stage.location.lng}`
        const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=walking`
        window.open(url, "_blank")
    }

    const handleShare = async () => {
        const shareData = {
            title: stage.name,
            text: `Vem pro ${stage.name}! ${stage.currentArtist} tá tocando agora 🎉`,
            url: `https://www.google.com/maps?q=${stage.location.lat},${stage.location.lng}`,
        }

        if (navigator.share) {
            try {
                await navigator.share(shareData)
            } catch (err) {
                console.log("Erro ao compartilhar:", err)
            }
        } else {
            navigator.clipboard.writeText(shareData.url)
        }
    }

    return (
        <div className="bg-card border border-border rounded-xl p-3 shadow-xl animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                        <h3 className="font-bold text-foreground text-sm truncate">{stage.name}</h3>
                        {stage.isLive && (
                            <Badge variant="default" className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0">
                                LIVE
                            </Badge>
                        )}
                        {stage.isFixed ? (
                            <Badge variant="secondary" className="bg-violet-500/20 text-violet-400 text-[10px] px-1.5 py-0">
                                Fixo
                            </Badge>
                        ) : (
                            <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 text-[10px] px-1.5 py-0">
                                Móvel
                            </Badge>
                        )}
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {stage.address}
                    </p>
                </div>
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onToggleFavorite?.(stage.id)}
                        className="h-6 w-6 hover:!bg-zinc-800"
                    >
                        <Star className={cn("w-3.5 h-3.5", isFavorite ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground")} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6 hover:!bg-zinc-800">
                        <X className="w-3 h-3" />
                    </Button>
                </div>
            </div>

            <div className="bg-muted rounded-lg p-2 mb-2">
                <p className="text-[10px] text-muted-foreground">Tocando agora</p>
                <p className="font-medium text-foreground text-xs">{stage.currentArtist}</p>
            </div>

            <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
                <Users className="w-3 h-3" />
                <span>{stage.friendsCount} amigos aqui</span>
            </div>

            <div className="flex gap-2">
                <Button
                    size="sm"
                    className="flex-1 bg-primary text-primary-foreground hover:!bg-primary/90 h-8 text-xs"
                    onClick={handleNavigate}
                >
                    <Navigation className="w-3 h-3 mr-1" />
                    Ir para o bloco
                </Button>
                <Button variant="outline" size="icon" onClick={handleShare} className="h-8 w-8 hover:!bg-zinc-800">
                    <Share2 className="w-3 h-3" />
                </Button>
            </div>
        </div>
    )
}