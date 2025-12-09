// components/leaflet-map.tsx
"use client"

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { useEffect } from "react"

// Fix para ícones do Leaflet no Next.js
const createIcon = (isLive: boolean) => {
    return L.divIcon({
        className: "custom-marker",
        html: `
      <div class="relative flex items-center justify-center">
        ${isLive ? '<div class="absolute w-12 h-12 rounded-full bg-orange-500/30 animate-ping"></div>' : ''}
        <div class="relative w-10 h-10 rounded-full ${isLive ? 'bg-orange-500' : 'bg-zinc-600'} flex items-center justify-center shadow-lg border-2 border-zinc-900">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${isLive ? '#1a1a1a' : '#a1a1aa'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
}

interface LeafletMapProps {
    stages: Stage[]
    userLocation: { lat: number; lng: number }
    selectedStage: string | null
    onSelectStage: (id: string | null) => void
}

function MapController({ selectedStage, stages }: { selectedStage: string | null, stages: Stage[] }) {
    const map = useMap()

    useEffect(() => {
        if (selectedStage) {
            const stage = stages.find(s => s.id === selectedStage)
            if (stage) {
                map.flyTo([stage.location.lat, stage.location.lng], 16, { duration: 0.5 })
            }
        }
    }, [selectedStage, stages, map])

    return null
}

export function LeafletMap({ stages, userLocation, selectedStage, onSelectStage }: LeafletMapProps) {
    return (
        <MapContainer
            center={[userLocation.lat, userLocation.lng]}
            zoom={15}
            className="w-full h-full"
            zoomControl={false}
        >
            <TileLayer
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            <MapController selectedStage={selectedStage} stages={stages} />

            {/* Markers dos blocos */}
            {stages.map((stage) => (
                <Marker
                    key={stage.id}
                    position={[stage.location.lat, stage.location.lng]}
                    icon={createIcon(stage.isLive)}
                    eventHandlers={{
                        click: () => onSelectStage(stage.id === selectedStage ? null : stage.id),
                    }}
                >
                    <Popup className="dark-popup">
                        <div className="font-semibold">{stage.name}</div>
                        <div className="text-sm text-gray-400">{stage.currentArtist}</div>
                    </Popup>
                </Marker>
            ))}

            {/* Marker do usuário */}
            <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                <Popup>Você está aqui</Popup>
            </Marker>
        </MapContainer>
    )
}