// components/map-view.tsx
"use client"

import { useState, useRef, useEffect } from "react"
import dynamic from "next/dynamic"
import { Volume2, Locate, LoaderCircle } from "lucide-react"
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
    address: string  // novo campo
    friendsCount: number
    isLive: boolean
    isFixed: boolean
    lastMoved: string
}

const initialStages: MusicStage[] = [
    {
        id: "1",
        name: "Cordão da Bola Preta",
        genre: "Marchinhas",
        currentArtist: "Orquestra Bola Preta",
        location: { lat: -22.9028, lng: -43.1778 },
        address: "R. Primeiro de Março, Centro",
        friendsCount: 45,
        isLive: true,
        isFixed: false,
        lastMoved: "2 min ago",
    },
    {
        id: "2",
        name: "Monobloco",
        genre: "Percussão",
        currentArtist: "Monobloco Band",
        location: { lat: -22.9035, lng: -43.1745 },
        address: "R. Primeiro de Março, Centro",
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
        address: "R. Primeiro de Março, Centro",
        friendsCount: 58,
        isLive: true,
        isFixed: true,
        lastMoved: "Av. Rio Branco",
    },
    {
        id: "4",
        name: "Carmelitas",
        genre: "Marchinhas",
        currentArtist: "Banda Carmelitas",
        location: { lat: -22.9175, lng: -43.1825 },
        address: "R. Primeiro de Março, Centro",
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
        address: "R. Primeiro de Março, Centro",
        friendsCount: 12,
        isLive: true,
        isFixed: false,
        lastMoved: "4 min ago",
    },
    {
        id: "6",
        name: "Quizomba",
        genre: "Samba",
        currentArtist: "Quizomba",
        location: { lat: -22.9135, lng: -43.1805 },
        address: "R. Primeiro de Março, Centro",
        friendsCount: 22,
        isLive: true,
        isFixed: true,
        lastMoved: "Arcos da Lapa",
    },
    {
        id: "7",
        name: "Banda de Ipanema",
        genre: "Marchinhas",
        currentArtist: "Banda de Ipanema",
        location: { lat: -22.9838, lng: -43.1985 },
        address: "R. Primeiro de Março, Centro",
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
        address: "R. Primeiro de Março, Centro",
        friendsCount: 35,
        isLive: true,
        isFixed: false,
        lastMoved: "3 min ago",
    },
    {
        id: "9",
        name: "Bloco da Preta",
        genre: "Pop & Axé",
        currentArtist: "Preta Gil",
        location: { lat: -22.9668, lng: -43.1815 },
        address: "R. Primeiro de Março, Centro",
        friendsCount: 42,
        isLive: true,
        isFixed: true,
        lastMoved: "Av. Atlântica",
    },
    {
        id: "10",
        name: "Fervo da Lud",
        genre: "Funk",
        currentArtist: "Ludmilla",
        location: { lat: -22.9705, lng: -43.1825 },
        address: "R. Primeiro de Março, Centro",
        friendsCount: 55,
        isLive: true,
        isFixed: true,
        lastMoved: "Copacabana",
    },
    {
        id: "11",
        name: "Boka de Espuma",
        genre: "Samba",
        currentArtist: "Boka de Espuma",
        location: { lat: -22.9515, lng: -43.1835 },
        address: "R. Primeiro de Março, Centro",
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
        address: "R. Primeiro de Março, Centro",
        friendsCount: 19,
        isLive: false,
        isFixed: false,
        lastMoved: "Começa às 16h",
    },
    {
        id: "13",
        name: "Filhos da P!",
        genre: "Pop Rock",
        currentArtist: "Filhos da P!",
        location: { lat: -22.9875, lng: -43.2235 },
        address: "R. Primeiro de Março, Centro",
        friendsCount: 25,
        isLive: true,
        isFixed: true,
        lastMoved: "Posto 12",
    },
    {
        id: "14",
        name: "Banda Cultural do Jiló",
        genre: "Samba",
        currentArtist: "Jiló Band",
        location: { lat: -22.9245, lng: -43.2325 },
        address: "R. Primeiro de Março, Centro",
        friendsCount: 20,
        isLive: true,
        isFixed: false,
        lastMoved: "4 min ago",
    },
    {
        id: "15",
        name: "Bloco Gargalhada",
        genre: "Samba",
        currentArtist: "Gargalhada",
        location: { lat: -22.9165, lng: -43.2415 },
        address: "R. Primeiro de Março, Centro",
        friendsCount: 18,
        isLive: true,
        isFixed: false,
        lastMoved: "5 min ago",
    },
    {
        id: "16",
        name: "Bloco da Barra",
        genre: "Axé & Pop",
        currentArtist: "Banda da Barra",
        location: { lat: -23.0005, lng: -43.3655 },
        address: "R. Primeiro de Março, Centro",
        friendsCount: 30,
        isLive: true,
        isFixed: true,
        lastMoved: "Av. Lúcio Costa",
    },
    {
        id: "17",
        name: "Carijó",
        genre: "Samba",
        currentArtist: "Carijó Band",
        location: { lat: -22.8165, lng: -43.2095 },
        address: "R. Primeiro de Março, Centro",
        friendsCount: 15,
        isLive: true,
        isFixed: false,
        lastMoved: "4 min ago",
    },
    {
        id: "18",
        name: "Loucura Suburbana",
        genre: "Samba",
        currentArtist: "Loucura Suburbana",
        location: { lat: -22.8965, lng: -43.2925 },
        address: "R. Primeiro de Março, Centro",
        friendsCount: 24,
        isLive: true,
        isFixed: false,
        lastMoved: "3 min ago",
    },
    {
        id: "19",
        name: "Virilha de Minhoca",
        genre: "Samba",
        currentArtist: "Virilha Band",
        location: { lat: -22.8735, lng: -43.4635 },
        address: "R. Primeiro de Março, Centro",
        friendsCount: 17,
        isLive: true,
        isFixed: false,
        lastMoved: "5 min ago",
    },
    {
        id: "20",
        name: "Arteiros da Glória",
        genre: "MPB",
        currentArtist: "Arteiros",
        location: { lat: -22.9225, lng: -43.1755 },
        address: "R. Primeiro de Março, Centro",
        friendsCount: 21,
        isLive: true,
        isFixed: false,
        lastMoved: "5 min ago",
    },
]

const DEFAULT_LOCATION = { lat: -22.9068, lng: -43.1729 }

interface MapViewProps {
    selectedStage: string | null
    onSelectStage: (id: string | null) => void
}

export function MapView({ selectedStage, onSelectStage }: MapViewProps) {
    const [stages] = useState(initialStages)
    const [userLocation, setUserLocation] = useState(DEFAULT_LOCATION)
    const [isLoadingLocation, setIsLoadingLocation] = useState(true)
    const [locationError, setLocationError] = useState<string | null>(null)
    const [favorites, setFavorites] = useState<string[]>([])  // CERTO - dentro do componente
    const mapRef = useRef<LeafletMapRef>(null)

    const toggleFavorite = (id: string) => {
        setFavorites((prev) =>
            prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
        )
    }

    useEffect(() => {
        if (!navigator.geolocation) {
            setLocationError("Geolocalização não suportada pelo navegador")
            setIsLoadingLocation(false)
            return
        }

        const options: PositionOptions = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
        }

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                })
                setIsLoadingLocation(false)
                setLocationError(null)
            },
            (error) => {
                console.error("Erro ao obter localização:", error)
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        setLocationError("Permissão de localização negada")
                        break
                    case error.POSITION_UNAVAILABLE:
                        setLocationError("Localização indisponível")
                        break
                    case error.TIMEOUT:
                        setLocationError("Tempo esgotado ao obter localização")
                        break
                    default:
                        setLocationError("Erro ao obter localização")
                }
                setIsLoadingLocation(false)
            },
            options
        )

        return () => {
            navigator.geolocation.clearWatch(watchId)
        }
    }, [])

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

            {isLoadingLocation && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-card/90 backdrop-blur-sm rounded-lg p-4 z-[1000] flex items-center gap-2">
                    <LoaderCircle className="w-5 h-5 animate-spin text-primary" />
                    <span className="text-sm">Obtendo sua localização...</span>
                </div>
            )}

            {locationError && (
                <div className="absolute top-35 left-4 right-4 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg p-3 z-[2000] text-sm">
                    {locationError}. Usando localização padrão.
                </div>
            )}

            <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 space-y-2 z-[1000]">
                <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full bg-orange-500" />
                    <span className="text-foreground">Bloco móvel</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full bg-violet-500" />
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

            <div className="absolute top-4 right-4 flex items-center gap-2 bg-card/90 backdrop-blur-sm rounded-full px-3 py-1.5 z-[1000]">
                <Volume2 className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-xs font-medium text-foreground">
          {stages.filter((s) => s.isLive).length} blocos ao vivo
        </span>
            </div>

            <Button
                size="icon"
                variant="secondary"
                className="absolute bottom-24 right-4 rounded-full shadow-lg z-[1000] hover:!bg-zinc-700"
                onClick={handleCenterOnUser}
                disabled={isLoadingLocation}
            >
                {isLoadingLocation ? (
                    <LoaderCircle className="w-5 h-5 animate-spin" />
                ) : (
                    <Locate className="w-5 h-5" />
                )}
            </Button>

            {/* Card na parte inferior */}
            {selectedStageData && (
                <div className="absolute bottom-16 left-4 right-4 max-w-md mx-auto z-[1000]">
                    <StageCard
                        stage={selectedStageData}
                        userLocation={userLocation}
                        isFavorite={favorites.includes(selectedStageData.id)}
                        onToggleFavorite={toggleFavorite}
                        onClose={() => onSelectStage(null)}
                    />
                </div>
            )}
        </div>
    )
}