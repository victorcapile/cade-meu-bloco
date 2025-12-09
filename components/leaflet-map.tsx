// components/leaflet-map.tsx
"use client"

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { useEffect, useImperativeHandle, forwardRef, useRef } from "react"

// Ícone para blocos móveis (laranja) e fixos (roxo) - sempre com ícone de música
const createIcon = (isLive: boolean, isFixed: boolean) => {
    const bgColor = !isLive
        ? 'bg-zinc-600'
        : isFixed
            ? 'bg-violet-500'
            : 'bg-orange-500'

    const pingColor = !isLive
        ? ''
        : isFixed
            ? 'bg-violet-500/30'
            : 'bg-orange-500/30'

    return L.divIcon({
        className: "custom-marker",
        html: `
      <div class="relative flex items-center justify-center">
        ${isLive ? `<div class="absolute w-12 h-12 rounded-full ${pingColor} animate-ping"></div>` : ''}
        ${isLive ? `<div class="absolute w-12 h-12 rounded-full ${pingColor}"></div>` : ''}
        <div class="relative w-10 h-10 rounded-full ${bgColor} flex items-center justify-center shadow-lg border-2 border-zinc-900">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 18V5l12-2v13"/>
            <circle cx="6" cy="18" r="3"/>
            <circle cx="18" cy="16" r="3"/>
          </svg>
        </div>
      </div>
    `,
        iconSize: [48, 48],
        iconAnchor: [24, 24],
    })
}

const userIcon = L.divIcon({
    className: "custom-marker",
    html: `
    <div class="relative flex items-center justify-center">
      <div class="absolute w-8 h-8 rounded-full bg-cyan-500/30 animate-ping"></div>
      <div class="relative w-6 h-6 rounded-full bg-cyan-500 border-2 border-zinc-900 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="3 11 22 2 13 21 11 13 3 11"/>
        </svg>
      </div>
    </div>
  `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
})

interface Stage {
    id: string
    name: string
    genre: string
    currentArtist: string
    location: { lat: number; lng: number }
    friendsCount: number
    isLive: boolean
    isFixed: boolean
}

interface LeafletMapProps {
    stages: Stage[]
    userLocation: { lat: number; lng: number }
    selectedStage: string | null
    onSelectStage: (id: string | null) => void
}

export interface LeafletMapRef {
    centerOnUser: () => void
}

function MapController({
                           selectedStage,
                           stages,
                           userLocation,
                           mapRef
                       }: {
    selectedStage: string | null
    stages: Stage[]
    userLocation: { lat: number; lng: number }
    mapRef: React.MutableRefObject<{ centerOnUser: () => void } | null>
}) {
    const map = useMap()

    useEffect(() => {
        if (selectedStage) {
            const stage = stages.find(s => s.id === selectedStage)
            if (stage) {
                map.flyTo([stage.location.lat, stage.location.lng], 16, { duration: 0.5 })
            }
        }
    }, [selectedStage, stages, map])

    useEffect(() => {
        mapRef.current = {
            centerOnUser: () => {
                map.flyTo([userLocation.lat, userLocation.lng], 16, { duration: 0.5 })
            }
        }
    }, [map, userLocation, mapRef])

    return null
}

export const LeafletMap = forwardRef<LeafletMapRef, LeafletMapProps>(
    ({ stages, userLocation, selectedStage, onSelectStage }, ref) => {
        const mapRef = useRef<{ centerOnUser: () => void } | null>(null)

        useImperativeHandle(ref, () => ({
            centerOnUser: () => {
                mapRef.current?.centerOnUser()
            }
        }))

        return (
            <MapContainer
                center={[userLocation.lat, userLocation.lng]}
                zoom={13}
                className="w-full h-full"
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                <MapController
                    selectedStage={selectedStage}
                    stages={stages}
                    userLocation={userLocation}
                    mapRef={mapRef}
                />

                {stages.map((stage) => (
                    <Marker
                        key={stage.id}
                        position={[stage.location.lat, stage.location.lng]}
                        icon={createIcon(stage.isLive, stage.isFixed)}
                        eventHandlers={{
                            click: () => onSelectStage(stage.id === selectedStage ? null : stage.id),
                        }}
                    >
                        <Popup className="dark-popup">
                            <div className="font-semibold">{stage.name}</div>
                            <div className="text-sm text-gray-400">{stage.currentArtist}</div>
                            <div className="text-xs text-gray-500 mt-1">
                                {stage.isFixed ? '📍 Bloco fixo' : '🚶 Bloco móvel'}
                            </div>
                        </Popup>
                    </Marker>
                ))}

                <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                    <Popup>Você está aqui</Popup>
                </Marker>
            </MapContainer>
        )
    }
)

LeafletMap.displayName = "LeafletMap"