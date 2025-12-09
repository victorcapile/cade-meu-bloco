"use client"

import { useState, useRef } from "react"
import dynamic from "next/dynamic"
import { MapPin, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StageCard } from "@/components/stage-card"
import type { LeafletMapRef } from "@/components/leaflet-map"

const LeafletMap = dynamic(
    () => import("@/components/leaflet-map").then(mod => mod.LeafletMap),
    {
        ssr: false,
        loading: () => <div className="w-full h-full bg-muted/30 animate-pulse" />,
    }
)

interface MusicStage {
    id: string
    name: string
    genre: string
    currentArtist: string
    location: { lat: number; lng: number }
    friendsCount: number
    isLive: boolean
    isFixed: boolean  // novo campo
    lastMoved: string
}

const mockStages: MusicStage[] = [
    // CENTRO
    {
        id: "1",
        name: "Cordão da Bola Preta",
        genre: "Marchinhas",
        currentArtist: "Orquestra Bola Preta",
        location: { lat: -22.9028, lng: -43.1778 },
        friendsCount: 45,
        isLive: true,
        isFixed: false,  // móvel
        lastMoved: "2 min ago",
    },
    {
        id: "2",
        name: "Monobloco",
        genre: "Percussão",
        currentArtist: "Monobloco Band",
        location: { lat: -22.9035, lng: -43.1745 },
        friendsCount: 32,
        isLive: true,
        isFixed: false,
        lastMoved: "5 min ago",
    },
    {
        id: "3",
        name: "Bloco da Anitta",
        genre: "Funk & Pop",
        currentArtist: "Anitta",
        location: { lat: -22.9055, lng: -43.1795 },
        friendsCount: 58,
        isLive: true,
        isFixed: true,  // fixo - tem trio elétrico parado
        lastMoved: "Av. Rio Branco",
    },

    // SANTA TERESA
    {
        id: "4",
        name: "Carmelitas",
        genre: "Marchinhas",
        currentArtist: "Banda Carmelitas",
        location: { lat: -22.9175, lng: -43.1825 },
        friendsCount: 18,
        isLive: true,
        isFixed: false,
        lastMoved: "3 min ago",
    },
    {
        id: "5",
        name: "Céu na Terra",
        genre: "Maracatu",
        currentArtist: "Céu na Terra",
        location: { lat: -22.9195, lng: -43.1870 },
        friendsCount: 12,
        isLive: true,
        isFixed: false,
        lastMoved: "4 min ago",
    },

    // LAPA
    {
        id: "6",
        name: "Quizomba",
        genre: "Samba",
        currentArtist: "Quizomba",
        location: { lat: -22.9135, lng: -43.1805 },
        friendsCount: 22,
        isLive: true,
        isFixed: true,  // fixo - Arcos da Lapa
        lastMoved: "Arcos da Lapa",
    },

    // ZONA SUL
    {
        id: "7",
        name: "Banda de Ipanema",
        genre: "Marchinhas",
        currentArtist: "Banda de Ipanema",
        location: { lat: -22.9838, lng: -43.1985 },
        friendsCount: 28,
        isLive: true,
        isFixed: false,
        lastMoved: "6 min ago",
    },
    {
        id: "8",
        name: "Simpatia é Quase Amor",
        genre: "MPB",
        currentArtist: "Simpatia Band",
        location: { lat: -22.9865, lng: -43.1920 },
        friendsCount: 35,
        isLive: false,
        isFixed: false,
        lastMoved: "3 min ago",
    },
    {
        id: "9",
        name: "Bloco da Preta",
        genre: "Pop & Axé",
        currentArtist: "Preta Gil",
        location: { lat: -22.9668, lng: -43.1815 },
        friendsCount: 42,
        isLive: true,
        isFixed: true,  // fixo
        lastMoved: "Av. Atlântica",
    },
    {
        id: "10",
        name: "Fervo da Lud",
        genre: "Funk",
        currentArtist: "Ludmilla",
        location: { lat: -22.9705, lng: -43.1825 },
        friendsCount: 55,
        isLive: true,
        isFixed: true,
        lastMoved: "Copacabana",
    },

    // BOTAFOGO / FLAMENGO
    {
        id: "11",
        name: "Boka de Espuma",
        genre: "Samba",
        currentArtist: "Boka de Espuma",
        location: { lat: -22.9515, lng: -43.1835 },
        friendsCount: 15,
        isLive: true,
        isFixed: false,
        lastMoved: "5 min ago",
    },
    {
        id: "12",
        name: "Estica do Flamengo",
        genre: "Samba",
        currentArtist: "Estica Band",
        location: { lat: -22.9325, lng: -43.1765 },
        friendsCount: 19,
        isLive: false,
        isFixed: false,
        lastMoved: "Começa às 16h",
    },

    // LEBLON
    {
        id: "13",
        name: "Filhos da P!",
        genre: "Pop Rock",
        currentArtist: "Filhos da P!",
        location: { lat: -22.9875, lng: -43.2235 },
        friendsCount: 25,
        isLive: false,
        isFixed: true,  // fixo - Posto 12
        lastMoved: "Posto 12",
    },

    // TIJUCA
    {
        id: "14",
        name: "Banda Cultural do Jiló",
        genre: "Samba",
        currentArtist: "Jiló Band",
        location: { lat: -22.9245, lng: -43.2325 },
        friendsCount: 20,
        isLive: true,
        isFixed: false,
        lastMoved: "4 min ago",
    },

    // VILA ISABEL
    {
        id: "15",
        name: "Bloco Gargalhada",
        genre: "Samba",
        currentArtist: "Gargalhada",
        location: { lat: -22.9165, lng: -43.2415 },
        friendsCount: 18,
        isLive: true,
        isFixed: false,
        lastMoved: "5 min ago",
    },

    // BARRA DA TIJUCA
    {
        id: "16",
        name: "Bloco da Barra",
        genre: "Axé & Pop",
        currentArtist: "Banda da Barra",
        location: { lat: -23.0005, lng: -43.3655 },
        friendsCount: 30,
        isLive: true,
        isFixed: true,  // fixo
        lastMoved: "Av. Lúcio Costa",
    },

    // ILHA DO GOVERNADOR
    {
        id: "17",
        name: "Carijó",
        genre: "Samba",
        currentArtist: "Carijó Band",
        location: { lat: -22.8165, lng: -43.2095 },
        friendsCount: 15,
        isLive: false,
        isFixed: false,
        lastMoved: "4 min ago",
    },

    // MÉIER
    {
        id: "18",
        name: "Loucura Suburbana",
        genre: "Samba",
        currentArtist: "Loucura Suburbana",
        location: { lat: -22.8965, lng: -43.2925 },
        friendsCount: 24,
        isLive: true,
        isFixed: false,
        lastMoved: "3 min ago",
    },

    // BANGU
    {
        id: "19",
        name: "Virilha de Minhoca",
        genre: "Samba",
        currentArtist: "Virilha Band",
        location: { lat: -22.8735, lng: -43.4635 },
        friendsCount: 17,
        isLive: true,
        isFixed: false,
        lastMoved: "5 min ago",
    },

    // GLÓRIA
    {
        id: "20",
        name: "Arteiros da Glória",
        genre: "MPB",
        currentArtist: "Arteiros",
        location: { lat: -22.9225, lng: -43.1755 },
        friendsCount: 21,
        isLive: false,
        isFixed: false,
        lastMoved: "5 min ago",
    },
]

interface MapViewProps {
    selectedStage: string | null
    onSelectStage: (id: string | null) => void
}

export function MapView({ selectedStage, onSelectStage }: MapViewProps) {
    const [stages] = useState(mockStages)
    const [userLocation] = useState({ lat: -22.9068, lng: -43.1729 })
    const mapRef = useRef<LeafletMapRef>(null)

    const selectedStageData = stages.find((s) => s.id === selectedStage)

    const handleCenterOnUser = () => {
        mapRef.current?.centerOnUser()
    }

    return (
        <div className="relative w-full h-full">
            <LeafletMap
                ref={mapRef}
                stages={stages}
                userLocation={userLocation}
                selectedStage={selectedStage}
                onSelectStage={onSelectStage}
            />

            {/* Legend */}
            <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 space-y-2 z-[1000]">
                <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full bg-orange-500 animate-pulse" />
                    <span className="text-foreground">Bloco móvel</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full bg-violet-500 animate-pulse" />
                    <span className="text-foreground">Bloco fixo</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full bg-zinc-600" />
                    <span className="text-muted-foreground">Começa em breve</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full bg-cyan-500" />
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
                onClick={handleCenterOnUser}
            >
                <MapPin className="w-5 h-5" />
            </Button>

            {/* Selected stage card */}
            {selectedStageData && (
                <div className="absolute bottom-20 left-4 right-4 z-[1000]">
                    <StageCard
                        stage={selectedStageData}
                        userLocation={userLocation}
                        onClose={() => onSelectStage(null)}
                    />
                </div>
            )}
        </div>
    )
}