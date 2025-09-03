"use client"

import { cn } from "@/lib/utils"
import { Loader2, Heart, Star, Target, Sparkles } from "lucide-react"

export interface LoaderWaitProps {
  /**
   * The variant of the loader to display
   */
  variant?: "spinner" | "dots" | "pulse" | "heart" | "star" | "target" | "sparkles"
  /**
   * The size of the loader
   */
  size?: "sm" | "md" | "lg" | "xl"
  /**
   * The color theme of the loader
   */
  color?: "primary" | "secondary" | "accent" | "muted" | "white"
  /**
   * Custom text to display below the loader
   */
  text?: string
  /**
   * Whether to show the loader in a centered container
   */
  centered?: boolean
  /**
   * Whether to show the loader in a full screen overlay
   */
  fullScreen?: boolean
  /**
   * Custom className for additional styling
   */
  className?: string
  /**
   * Whether to show a backdrop blur effect
   */
  backdrop?: boolean
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6", 
  lg: "h-8 w-8",
  xl: "h-12 w-12"
}

const textSizeClasses = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg", 
  xl: "text-xl"
}

const colorClasses = {
  primary: "text-primary",
  secondary: "text-secondary",
  accent: "text-accent",
  muted: "text-muted-foreground",
  white: "text-white"
}

export function LoaderWait({
  variant = "spinner",
  size = "md",
  color = "primary",
  text,
  centered = true,
  fullScreen = false,
  className,
  backdrop = false
}: LoaderWaitProps) {
  const iconSize = sizeClasses[size]
  const textSize = textSizeClasses[size]
  const iconColor = colorClasses[color]

  const renderLoader = () => {
    switch (variant) {
      case "spinner":
        return <Loader2 className={cn(iconSize, iconColor, "animate-spin")} />
      
      case "dots":
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  "rounded-full animate-pulse",
                  size === "sm" ? "h-2 w-2" : size === "md" ? "h-3 w-3" : size === "lg" ? "h-4 w-4" : "h-5 w-5",
                  color === "primary" ? "bg-primary" : 
                  color === "secondary" ? "bg-secondary" :
                  color === "accent" ? "bg-accent" :
                  color === "muted" ? "bg-muted-foreground" : "bg-white"
                )}
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: "1s"
                }}
              />
            ))}
          </div>
        )
      
      case "pulse":
        return (
          <div
            className={cn(
              "rounded-full animate-pulse",
              size === "sm" ? "h-4 w-4" : size === "md" ? "h-6 w-6" : size === "lg" ? "h-8 w-8" : "h-12 w-12",
              color === "primary" ? "bg-primary" : 
              color === "secondary" ? "bg-secondary" :
              color === "accent" ? "bg-accent" :
              color === "muted" ? "bg-muted-foreground" : "bg-white"
            )}
          />
        )
      
      case "heart":
        return <Heart className={cn(iconSize, iconColor, "animate-pulse")} />
      
      case "star":
        return <Star className={cn(iconSize, iconColor, "animate-spin")} />
      
      case "target":
        return <Target className={cn(iconSize, iconColor, "animate-pulse")} />
      
      case "sparkles":
        return <Sparkles className={cn(iconSize, iconColor, "animate-pulse")} />
      
      default:
        return <Loader2 className={cn(iconSize, iconColor, "animate-spin")} />
    }
  }

  const loaderContent = (
    <div className={cn("flex flex-col items-center space-y-2", className)}>
      {renderLoader()}
      {text && (
        <p className={cn(textSize, iconColor, "font-medium")}>
          {text}
        </p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className={cn(
        "fixed inset-0 z-50 flex items-center justify-center",
        backdrop ? "backdrop-blur-sm bg-background/80" : "bg-background"
      )}>
        {loaderContent}
      </div>
    )
  }

  if (centered) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        {loaderContent}
      </div>
    )
  }

  return loaderContent
}

// Predefined loader variants for common use cases
export const LoaderVariants = {
  // Authentication related
  Auth: () => (
    <LoaderWait 
      variant="spinner" 
      size="lg" 
      color="primary" 
      text="Authenticating..." 
    />
  ),
  
  // Data loading
  Data: () => (
    <LoaderWait 
      variant="dots" 
      size="md" 
      color="muted" 
      text="Loading data..." 
    />
  ),
  
  // Profile related
  Profile: () => (
    <LoaderWait 
      variant="heart" 
      size="lg" 
      color="primary" 
      text="Loading profile..." 
    />
  ),
  
  // Matches related
  Matches: () => (
    <LoaderWait 
      variant="target" 
      size="lg" 
      color="primary" 
      text="Finding matches..." 
    />
  ),
  
  // General loading
  General: () => (
    <LoaderWait 
      variant="spinner" 
      size="md" 
      color="muted" 
      text="Loading..." 
    />
  ),
  
  // Full screen loader
  FullScreen: (text?: string) => (
    <LoaderWait 
      variant="spinner" 
      size="xl" 
      color="primary" 
      text={text || "Loading..."}
      fullScreen 
      backdrop 
    />
  ),
  
  // Inline loader
  Inline: () => (
    <LoaderWait 
      variant="spinner" 
      size="sm" 
      color="muted" 
      centered={false} 
    />
  )
}

export default LoaderWait
