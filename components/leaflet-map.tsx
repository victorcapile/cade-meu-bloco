// components/leaflet-map.tsx
"use client"

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { useEffect, useImperativeHandle, forwardRef, useRef } from "react"

// Ícone para blocos - aumenta 20% quando selecionado
const createIcon = (isLive: boolean, isFixed: boolean, isSelected: boolean) => {
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

    // Tamanho base e aumentado
    const size = isSelected ? 12 : 10
    const outerSize = isSelected ? 14.4 : 12
    const iconSize = isSelected ? 24 : 20

    return L.divIcon({
        className: "custom-marker",
        html: `
      <div class="relative flex items-center justify-center transition-transform duration-200">
        ${isLive ? `<div class="absolute w-${outerSize} h-${outerSize} rounded-full ${pingColor} animate-ping" style="width: ${outerSize * 4}px; height: ${outerSize * 4}px;"></div>` : ''}
        ${isLive ? `<div class="absolute rounded-full ${pingColor}" style="width: ${outerSize * 4}px; height: ${outerSize * 4}px;"></div>` : ''}
        <div class="relative rounded-full ${bgColor} flex items-center justify-center shadow-lg border-2 border-zinc-900" style="width: ${size * 4}px; height: ${size * 4}px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 18V5l12-2v13"/>
            <circle cx="6" cy="18" r="3"/>
            <circle cx="18" cy="16" r="3"/>
          </svg>
        </div>
      </div>
    `,
        iconSize: [isSelected ? 58 : 48, isSelected ? 58 : 48],
        iconAnchor: [isSelected ? 29 : 24, isSelected ? 29 : 24],
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
                        icon={createIcon(stage.isLive, stage.isFixed, selectedStage === stage.id)}
                        eventHandlers={{
                            click: () => onSelectStage(stage.id === selectedStage ? null : stage.id),
                        }}
                    />
                ))}

                <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                    <Popup>Você está aqui</Popup>
                </Marker>
            </MapContainer>
        )
    }
)

LeafletMap.displayName = "LeafletMap"