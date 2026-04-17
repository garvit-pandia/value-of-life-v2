'use client'

import { useEffect, useRef } from 'react'
import { Case, GuessRecord } from '@/types'
import { formatINR } from '@/lib/currencyUtils'

export function RevealPhase({ 
  currentCase, 
  latestGuess, 
  onNext, 
  isLast 
}: { 
  currentCase: Case, 
  latestGuess: GuessRecord, 
  onNext: () => void,
  isLast: boolean
}) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Only scroll smoothly into view if on mobile/tablet (vertically stacked layout)
    if (window.innerWidth < 1024 && containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  return (
    <div ref={containerRef} className="space-y-10 animate-reveal border-2 border-parchment p-6 bg-[#050505]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 sm:gap-0 border-b-2 border-dashed border-parchment/60 pb-8">
        <div className="text-left">
          <p className="font-mono text-[10px] text-parchment/50 uppercase tracking-widest mb-2">Submitted Appraisal</p>
          <p className="text-2xl md:text-3xl font-mono text-parchment/70 tracking-tight line-through decoration-stamp-red decoration-2">
            {formatINR(latestGuess.guessedAmount)}
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-[10px] text-stamp-red uppercase tracking-widest mb-2 font-bold">Official Tribunal Output</p>
          <p className="text-3xl md:text-4xl font-mono font-bold tracking-tight text-parchment bg-parchment/10 inline-block px-2">
            <span className="animate-unredact">
            {currentCase.actualPayoutINR === 0 
              ? "₹0 (REJECTED)" 
              : formatINR(currentCase.actualPayoutINR)}
            </span>
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-parchment/5 border-l-4 border-parchment p-4">
          <p className="font-mono text-xs text-parchment/80 uppercase tracking-wide mb-2 opacity-50">DOCUMENTED METHODOLOGY:</p>
          <p className="text-sm md:text-base text-parchment italic leading-relaxed font-serif uppercase tracking-tight">
            &quot;{currentCase.methodologyNote}&quot;
          </p>
        </div>
        {currentCase.sourceURL && (
          <div className="text-right mt-2">
            <a 
              href={currentCase.sourceURL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-mono text-[10px] text-parchment uppercase tracking-widest border border-parchment/30 px-3 py-1 hover:bg-parchment hover:text-[#050505] transition-colors"
            >
              Access Public Record &rarr;
            </a>
          </div>
        )}
      </div>

      <button
        onClick={onNext}
        className="w-full py-4 border-2 border-parchment text-parchment font-mono font-bold text-sm uppercase tracking-[0.4em] transition-all duration-300 hover:bg-parchment hover:text-[#050505]"
      >
        {!isLast ? 'Proceed to Next File' : 'Initialize Final Report'}
      </button>
    </div>
  )
}
