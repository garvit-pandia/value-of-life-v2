'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Case, GuessRecord } from '@/types'
import casesData from '@/data/cases.json'
import { formatINR, parseLakhCrore } from '@/lib/currencyUtils'

export default function PlayPage() {
  const router = useRouter()
  
  // State
  const [currentIndex, setCurrentIndex] = useState(0)
  const [gamePhase, setGamePhase] = useState<'guessing' | 'revealed'>('guessing')
  const [inputValue, setInputValue] = useState('')
  const [inputUnit, setInputUnit] = useState<'lakh' | 'crore'>('lakh')
  const [guesses, setGuesses] = useState<GuessRecord[]>([])
  const [initialized, setInitialized] = useState(false)
  
  // Refs
  const shuffledCasesRef = useRef<Case[]>([])

  // Selection logic for Shuffle on mount
  useEffect(() => {
    const shuffle = (array: Case[]) => {
      const shuffled = [...array]
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }
      return shuffled
    }

    shuffledCasesRef.current = shuffle(casesData as Case[])
    setInitialized(true)
  }, [])

  if (!initialized || !shuffledCasesRef.current.length) {
    return <div className="min-h-screen bg-black" />
  }

  const currentCase = shuffledCasesRef.current[currentIndex]
  const totalCases = shuffledCasesRef.current.length

  if (!currentCase) {
    return <div className="min-h-screen bg-black" />
  }

  const handleLockIn = () => {
    if (!inputValue || inputValue === '0' || inputValue === '00') return

    const guessedAmount = parseLakhCrore(inputValue, inputUnit)
    const ratio = currentCase.actualPayoutINR === 0 
      ? null 
      : guessedAmount / currentCase.actualPayoutINR

    const newGuess: GuessRecord = {
      caseId: currentCase.id,
      guessedAmount,
      actualAmount: currentCase.actualPayoutINR,
      ratio,
      country: currentCase.country,
      occupation: currentCase.occupation,
      age: currentCase.age,
      gender: currentCase.gender
    }

    setGuesses(prev => [...prev, newGuess])
    setGamePhase('revealed')
  }

  const handleNext = () => {
    if (currentIndex < totalCases - 1) {
      setCurrentIndex(prev => prev + 1)
      setInputValue('')
      setGamePhase('guessing')
    } else {
      const finalGuesses = [...guesses]
      sessionStorage.setItem('guesses', JSON.stringify(finalGuesses))
      router.push('/result')
    }
  }

  const latestGuess = guesses[guesses.length - 1]

  const getGuessColor = () => {
    if (currentCase.actualPayoutINR === 0) return 'text-white'
    if (latestGuess.guessedAmount < latestGuess.actualAmount) return 'text-blue-400'
    if (latestGuess.guessedAmount > latestGuess.actualAmount) return 'text-red-400'
    return 'text-white'
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-8 max-w-md mx-auto flex flex-col">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs text-gray-500 uppercase tracking-widest">
          Case {currentIndex + 1} of {totalCases}
        </p>
      </div>

      {/* Case Card */}
      <div className="flex-1">
        <p className="text-xs text-gray-500">
          {currentCase.country}, {currentCase.year}
        </p>
        <h2 className="text-xl text-white font-semibold mt-4 leading-tight">
          {currentCase.causeOfDeath}
        </h2>

        <div className="mt-6 space-y-2">
          <p className="text-sm text-gray-400">
            <span className="text-gray-500 uppercase text-[10px] tracking-wider mr-2">Occupation:</span>
            {currentCase.occupation}
          </p>
          <p className="text-sm text-gray-400">
            <span className="text-gray-500 uppercase text-[10px] tracking-wider mr-2">Age:</span>
            {currentCase.age !== null ? currentCase.age : 'Not recorded'}
          </p>
          <p className="text-sm text-gray-400">
            <span className="text-gray-500 uppercase text-[10px] tracking-wider mr-2">Gender:</span>
            {currentCase.gender}
          </p>
          <p className="text-sm text-gray-400">
            <span className="text-gray-500 uppercase text-[10px] tracking-wider mr-2">Family:</span>
            {currentCase.familySituation}
          </p>
        </div>
      </div>

      {/* Action Zone */}
      <div className="mt-12">
        {gamePhase === 'guessing' ? (
          <div className="space-y-6">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">
                What was the legal payout?
              </p>
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setInputUnit('lakh')}
                  className={`min-h-[48px] flex-1 text-sm font-medium border transition-colors ${
                    inputUnit === 'lakh' ? 'bg-white text-black border-white' : 'bg-transparent border-gray-600 text-white hover:border-gray-400'
                  }`}
                >
                  IN LAKHS
                </button>
                <button
                  onClick={() => setInputUnit('crore')}
                  className={`min-h-[48px] flex-1 text-sm font-medium border transition-colors ${
                    inputUnit === 'crore' ? 'bg-white text-black border-white' : 'bg-transparent border-gray-600 text-white hover:border-gray-400'
                  }`}
                >
                  IN CRORES
                </button>
              </div>
              <input
                type="number"
                min="0"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter amount"
                className="bg-gray-900 text-white text-xl text-center w-full p-4 rounded-none border border-gray-700 outline-none focus:border-gray-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            <button
              onClick={handleLockIn}
              disabled={!inputValue || inputValue === '0' || inputValue === '00'}
              className={`full-width min-h-[56px] w-full bg-white text-black font-bold text-lg transition-opacity ${
                (!inputValue || inputValue === '0' || inputValue === '00') ? 'opacity-30 cursor-not-allowed' : 'opacity-100 hover:bg-gray-200'
              }`}
            >
              Lock In
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Your Guess</p>
                <p className={getGuessColor() + " text-2xl font-bold"}>
                  {formatINR(latestGuess.guessedAmount)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Actual Settlement</p>
                <p className="text-2xl font-bold text-white">
                  {currentCase.actualPayoutINR === 0 
                    ? "₹0 — The court awarded nothing." 
                    : formatINR(currentCase.actualPayoutINR)}
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-800">
              <p className="text-sm text-gray-400 italic leading-relaxed">
                &quot;{currentCase.methodologyNote}&quot;
              </p>
              <a 
                href={currentCase.sourceURL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-xs text-gray-600 underline mt-4 hover:text-gray-400 transition-colors"
              >
                Source
              </a>
            </div>

            <button
              onClick={handleNext}
              className="min-h-[56px] w-full bg-white text-black font-bold text-lg mt-8 hover:bg-gray-200 transition-colors"
            >
              {currentIndex < totalCases - 1 ? 'Next Case' : 'See Your Pattern'}
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
