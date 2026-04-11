import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { MemoryCard as CardType } from "@/lib/MemoryGameLogic"
import "./MemoryStyles.css"

interface MemoryCardProps {
  card: CardType
  onClick: () => void
  disabled?: boolean
  index: number
}

export function MemoryCard({ card, onClick, disabled, index }: MemoryCardProps) {
  // Intentional Asymmetry: slight rotation for that "editorial" look
  const rotation = React.useMemo(() => {
    const rotations = [0, 1, -1, 2, -2];
    return rotations[index % rotations.length];
  }, [index]);

  return (
    <div
      onClick={!disabled ? onClick : undefined}
      className={cn(
        "aspect-4/5 relative memory-grid-container group",
        !card.isMatched && !disabled ? "cursor-pointer" : "cursor-default"
      )}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <div
        className={cn(
          "card-inner w-full h-full relative rounded-xl shadow-lg transition-all duration-600",
          card.isFlipped ? "card-flipped shadow-primary/20" : "shadow-surface-container-lowest/50"
        )}
      >
        {/* Card Back (Visible initially) */}
        <div 
          className={cn(
            "card-face glass-panel rounded-xl flex flex-col items-center justify-center border border-outline-variant-prism/10 transition-all duration-300",
            !card.isFlipped && !card.isMatched && "group-hover:scale-105 group-hover:bg-surface-bright"
          )}
        >
          <span className="text-4xl font-headline font-black text-primary-prism/60">
            {index + 1}
          </span>
        </div>

        {/* Card Front (The Question or Answer) */}
        <div
          className={cn(
            "card-face card-front rounded-xl flex items-center justify-center p-4 border-2 shadow-primary/20",
            card.type === 'question' 
              ? "bg-surface-container-highest text-on-surface-prism border-primary-prism/30" 
              : "bg-primary-prism text-on-primary border-primary-prism"
          )}
        >
          <p className={cn(
            "text-center font-bold leading-relaxed",
            card.content.length > 50 ? "text-sm" : card.content.length > 20 ? "text-base" : "text-xl",
            card.type === 'answer' ? "text-on-primary font-black pt-1" : "text-on-surface-prism"
          )}>
            {card.content}
          </p>
        </div>
      </div>

      {/* Matched Overlay or Effect could go here */}
      {card.isMatched && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 bg-primary-prism/10 rounded-xl pointer-events-none flex items-center justify-center"
        >
          <div className="w-12 h-12 rounded-full bg-primary-prism text-on-primary flex items-center justify-center shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
        </motion.div>
      )}
    </div>
  )
}
