import { UtensilsCrossed } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full min-h-screen bg-background">
      <div className="relative flex flex-col items-center">
        
        {/* Glow Effect Background */}
        <div className="absolute -top-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse" />

        <div className="relative flex items-center justify-center w-28 h-28">
          {/* Outer Ring - Multi-colored gradient style */}
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary border-r-primary/20 animate-spin [animation-duration:1.2s]" />
          
          {/* Middle Ring - Dotted or dashed for texture */}
          <div className="absolute inset-2 rounded-full border-2 border-dashed border-primary/30 animate-spin [animation-direction:reverse] [animation-duration:4s]" />
          
          {/* Inner Ring - Solid soft pulse */}
          <div className="absolute inset-4 rounded-full border border-primary/10 animate-pulse" />
          
          {/* Center Icon Container */}
          <div className="relative flex items-center justify-center w-14 h-14 bg-gradient-to-br from-background to-accent/30 rounded-2xl rotate-45 border border-border/50 shadow-xl backdrop-blur-md overflow-hidden">
             {/* The Icon - Rotated back to be upright */}
            <div className="-rotate-45">
               <UtensilsCrossed className="w-6 h-6 text-primary animate-bounce" />
            </div>
          </div>
        </div>
        
        {/* Text Section */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <div className="flex items-baseline gap-1">
            <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Loading
            </h2>
            <div className="flex gap-1 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
            </div>
          </div>
          
          <p className="text-sm font-medium text-muted-foreground/80 italic">
            Preparing your meal with love...
          </p>
        </div>

        {/* Progress bar style decoration */}
        <div className="mt-6 w-48 h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary/60 w-1/3 rounded-full animate-[loading_2s_infinite_ease-in-out]" />
        </div>
      </div>
    </div>
  );
}