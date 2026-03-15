'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { GuessRecord, PatternResult } from '@/types'
import { getPattern } from '@/lib/patternEngine'

export default function ResultPage() {
  const [guesses, setGuesses] = useState<GuessRecord[] | null>(null)
  const [pattern, setPattern] = useState<PatternResult | null>(null)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = sessionStorage.getItem('guesses')
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as GuessRecord[]
        setGuesses(parsed)
        setPattern(getPattern(parsed))
      } catch (e) {
        console.error("Failed to parse guesses", e)
      }
    }
    setLoading(false)
  }, [])

  const handleCopy = () => {
    if (!pattern) return
    const text = `${pattern.biasLine}\n${pattern.agreementLine}`
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  if (loading || !guesses || !pattern) return <div className="min-h-screen bg-black" />

  if (guesses.length === 0) {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
        <p className="text-xl mb-6">No session found</p>
        <Link href="/" className="border border-white text-white px-8 py-3 text-lg hover:bg-white hover:text-black transition-colors">
          Return Home
        </Link>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 text-center">
      {pattern && (
        <>
          <h2 className="text-white text-2xl max-w-lg mb-6 leading-relaxed">
            {pattern.biasLine}
          </h2>
          <p className="text-gray-400 text-xl max-w-lg mb-10 leading-relaxed">
            {pattern.agreementLine}
          </p>
          
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={handleCopy}
              className="border border-gray-600 text-gray-400 px-6 py-3 text-sm hover:border-white hover:text-white transition-colors min-h-[48px] min-w-[140px]"
            >
              {copied ? 'Copied' : 'Copy result'}
            </button>
            
            <Link href="/" className="text-gray-600 text-sm mt-4 hover:text-gray-400 transition-colors">
              Start over
            </Link>
          </div>
        </>
      )}
    </main>
  )
}
