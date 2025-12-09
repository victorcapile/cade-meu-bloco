// components/header.tsx
"use client"

import { useState } from "react"
import { Bell, Search, ChevronDown, MapPin, Navigation, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

type UserStatus = "no-carnaval" | "a-caminho" | "em-casa"

const statusConfig = {
    "no-carnaval": {
        label: "No Carnaval",
        icon: MapPin,
        bgColor: "bg-orange-500 hover:!bg-orange-400",
        textColor: "text-white",
        dotColor: "bg-orange-500",
    },
    "em-casa": {
        label: "Em casa",
        icon: Home,
        bgColor: "bg-zinc-700 hover:!bg-zinc-600",
        textColor: "text-zinc-300",
        dotColor: "bg-zinc-500",
    },
}

export function Header() {
    const [status, setStatus] = useState<UserStatus>("em-casa")

    const currentStatus = statusConfig[status]
    const StatusIcon = currentStatus.icon

    return (
        <header className="flex items-center justify-between px-4 py-3 bg-card border-b border-border relative z-[1001]">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-sm">🎭</span>
                </div>
                <div>
                    <h1 className="text-lg font-bold text-foreground">Cadê meu Bloco?</h1>
                    <p className="text-xs text-muted-foreground">by Victor Capilé</p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                {/* Status Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                                "gap-1.5 h-8 px-2.5 border-none",
                                currentStatus.bgColor,
                                currentStatus.textColor
                            )}
                        >
                            <StatusIcon className="w-3.5 h-3.5" />
                            <span className="text-xs font-medium hidden sm:inline">{currentStatus.label}</span>
                            <ChevronDown className="w-3 h-3" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                        {Object.entries(statusConfig).map(([key, config]) => {
                            const Icon = config.icon
                            const isSelected = status === key
                            return (
                                <DropdownMenuItem
                                    key={key}
                                    onClick={() => setStatus(key as UserStatus)}
                                    className={cn(
                                        "flex items-center gap-2 cursor-pointer",
                                        isSelected && "bg-zinc-800"
                                    )}
                                >
                                    <div className={cn("w-2 h-2 rounded-full", config.dotColor)} />
                                    <Icon className="w-4 h-4" />
                                    <span>{config.label}</span>
                                    {isSelected && <span className="ml-auto text-primary">✓</span>}
                                </DropdownMenuItem>
                            )
                        })}
                    </DropdownMenuContent>
                </DropdownMenu>

                <Button variant="ghost" size="icon" className="relative h-8 w-8 hover:!bg-zinc-800">
                    <Search className="w-4 h-4 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="icon" className="relative h-8 w-8 hover:!bg-zinc-800">
                    <Bell className="w-4 h-4 text-muted-foreground" />
                </Button>
            </div>
        </header>
    )
}