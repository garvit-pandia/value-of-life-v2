'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { GuessRecord, PatternResult } from '@/types'
import { getPattern } from '@/lib/patternEngine'

export default function ResultPage() {
  const router = useRouter()
  const [guesses, setGuesses] = useState<GuessRecord[] | null>(null)
  const [pattern, setPattern] = useState<PatternResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [copying, setCopying] = useState(false)

  useEffect(() => {
    const stored = sessionStorage.getItem('guesses')
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as GuessRecord[]
        setGuesses(parsed)
        setPattern(getPattern(parsed))
      } catch (err) {
        console.error('Failed to parse guesses', err)
      }
    }
    setLoading(false)
  }, [])

  const handleCopy = () => {
    if (!pattern) return
    const text = `${pattern.biasLine}\n${pattern.agreementLine}`
    navigator.clipboard.writeText(text).then(() => {
      setCopying(true)
      setTimeout(() => setCopying(false), 2000)
    })
  }

  if (loading || !guesses || !pattern) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-[1px] bg-white/20 animate-pulse"></div>
      </main>
    )
  }

  if (guesses.length === 0) {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 text-center">
        <h2 className="text-xl font-serif italic mb-8">No session found</h2>
        <Link 
          href="/" 
          className="text-xs uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
        >
          Return Home
        </Link>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 md:px-12 relative overflow-hidden">
      {/* Background atmospheric glow */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-full max-w-2xl h-[40%] bg-white/[0.02] rounded-full blur-[120px]"></div>

      <div className="w-full max-w-2xl text-center space-y-12 relative z-10 animate-reveal">
        <div className="space-y-4">
          <p className="text-[10px] text-gray-500 uppercase tracking-[0.4em]">Structural Analysis Completed</p>
          <div className="w-12 h-px bg-white/20 mx-auto"></div>
        </div>

        <div className="space-y-8">
          <h1 className="text-4xl md:text-5xl font-serif italic leading-tight text-white tracking-tight">
            {pattern.biasLine}
          </h1>
          <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed max-w-xl mx-auto">
            {pattern.agreementLine}
          </p>
        </div>

        <div className="pt-12 flex flex-col items-center gap-6">
          <button
            onClick={handleCopy}
            className="group relative flex h-14 items-center justify-center border border-white/10 px-12 text-xs uppercase tracking-[0.3em] font-medium transition-all duration-300 hover:border-white hover:bg-white hover:text-black overflow-hidden"
          >
            <span className="relative z-10">{copying ? 'Results Copied' : 'Preserve Report'}</span>
            <div className="absolute inset-0 bg-white translate-y-[100%] transition-transform duration-300 group-hover:translate-y-0"></div>
          </button>

          <Link 
            href="/" 
            className="text-[10px] uppercase tracking-[0.2em] text-gray-600 hover:text-white transition-colors"
          >
            Reset Analysis
          </Link>
        </div>
      </div>

      <div className="absolute bottom-12 text-[9px] text-gray-700 tracking-[0.5em] uppercase">
        Judicial Bias Factor / Series 01
      </div>
    </main>
  )
}
