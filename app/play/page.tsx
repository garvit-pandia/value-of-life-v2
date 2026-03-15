'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Case, GuessRecord } from '@/types'
import casesData from '@/data/cases.json'
import { formatINR, parseLakhCrore } from '@/lib/currencyUtils'

export default function PlayPage() {
  const router = useRouter()
  
  const [currentIndex, setCurrentIndex] = useState(0)
  const [gamePhase, setGamePhase] = useState<'guessing' | 'revealed'>('guessing')
  const [inputValue, setInputValue] = useState('')
  const [inputUnit, setInputUnit] = useState<'lakh' | 'crore'>('lakh')
  const [guesses, setGuesses] = useState<GuessRecord[]>([])
  const [initialized, setInitialized] = useState(false)
  
  const shuffledCasesRef = useRef<Case[]>([])

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
    <main className="min-h-screen bg-black text-white px-6 py-12 flex flex-col items-center">
      <div className="w-full max-w-lg animate-reveal">
        {/* Progress Header */}
        <div className="flex justify-between items-center mb-12 border-b border-white/10 pb-4">
          <div className="text-[10px] text-gray-400 tracking-[0.2em] uppercase font-light">
            Evidence File / 0{currentIndex + 1}
          </div>
          <div className="text-[10px] text-gray-500 uppercase tracking-widest font-light">
            0{currentIndex + 1} — 0{totalCases}
          </div>
        </div>

        {/* Case Info Card */}
        <div className="glass-card rounded-xl p-8 md:p-10 relative overflow-hidden group hover:border-white/20 transition-all duration-700">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-[40px] rounded-full group-hover:bg-white/10 transition-colors duration-700"></div>
          
          <div className="space-y-10 relative z-10">
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mb-4">
                {currentCase.country} / {currentCase.year}
              </p>
              <h2 className="text-2xl md:text-3xl text-white font-serif italic leading-snug">
                {currentCase.causeOfDeath}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-y-6 gap-x-4 border-t border-white/5 pt-8">
              <div className="space-y-1">
                <p className="text-[9px] text-gray-500 uppercase tracking-widest">Occupation</p>
                <p className="text-sm text-gray-300 font-light">{currentCase.occupation}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] text-gray-500 uppercase tracking-widest">Age</p>
                <p className="text-sm text-gray-300 font-light">{currentCase.age !== null ? currentCase.age : 'Not recorded'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] text-gray-500 uppercase tracking-widest">Gender</p>
                <p className="text-sm text-gray-300 font-light">{currentCase.gender}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] text-gray-500 uppercase tracking-widest">Family Status</p>
                <p className="text-sm text-gray-300 font-light">{currentCase.familySituation}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Zone */}
        <div className="mt-12 space-y-8">
          {gamePhase === 'guessing' ? (
            <div className="space-y-8 animate-reveal" style={{ animationDelay: '0.2s' }}>
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] text-center mb-6">
                  Estimate the value
                </p>
                
                <div className="flex p-1 bg-white/5 border border-white/10 rounded-lg mb-6 max-w-xs mx-auto">
                  <button
                    onClick={() => setInputUnit('lakh')}
                    className={`h-10 flex-1 text-[10px] tracking-widest transition-all rounded-md ${
                      inputUnit === 'lakh' ? 'bg-white text-black font-semibold' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    LAKHS
                  </button>
                  <button
                    onClick={() => setInputUnit('crore')}
                    className={`h-10 flex-1 text-[10px] tracking-widest transition-all rounded-md ${
                      inputUnit === 'crore' ? 'bg-white text-black font-semibold' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    CRORES
                  </button>
                </div>

                <div className="relative group">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl text-gray-600 font-light">₹</span>
                  <input
                    type="number"
                    min="0"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="0.00"
                    className="bg-transparent text-white text-5xl md:text-6xl text-center w-full py-8 border-b-2 border-white/10 outline-none focus:border-white transition-all font-light tracking-tight placeholder:text-white/5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>

              <button
                onClick={handleLockIn}
                disabled={!inputValue || inputValue === '0' || inputValue === '00'}
                className={`w-full py-6 bg-white text-black text-sm uppercase tracking-[0.4em] font-semibold transition-all duration-500 ${
                  (!inputValue || inputValue === '0' || inputValue === '00') 
                    ? 'opacity-20 cursor-not-allowed' 
                    : 'opacity-100 hover:bg-gray-200 hover:tracking-[0.5em]'
                }`}
              >
                Declare Verdict
              </button>
            </div>
          ) : (
            <div className="space-y-10 animate-reveal">
              <div className="flex justify-around items-center border-b border-white/10 pb-10">
                <div className="text-center">
                  <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-2">Estimation</p>
                  <p className={getGuessColor() + " text-3xl md:text-4xl font-light tracking-tight"}>
                    {formatINR(latestGuess.guessedAmount)}
                  </p>
                </div>
                <div className="w-px h-12 bg-white/10"></div>
                <div className="text-center">
                  <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-2">Verdict</p>
                  <p className="text-3xl md:text-4xl font-light tracking-tight text-white">
                    {currentCase.actualPayoutINR === 0 
                      ? "₹0" 
                      : formatINR(currentCase.actualPayoutINR)}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="relative">
                  <div className="absolute left-0 top-0 w-1 h-full bg-white/20"></div>
                  <p className="pl-6 text-sm text-gray-400 italic leading-relaxed font-serif uppercase tracking-tight">
                    &quot;{currentCase.methodologyNote}&quot;
                  </p>
                </div>
                <a 
                  href={currentCase.sourceURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-[10px] text-gray-600 uppercase tracking-widest hover:text-white transition-colors"
                >
                  View Judicial Record →
                </a>
              </div>

              <button
                onClick={handleNext}
                className="w-full py-6 border border-white/20 text-white text-sm uppercase tracking-[0.4em] transition-all duration-500 hover:bg-white hover:text-black hover:tracking-[0.5em]"
              >
                {currentIndex < totalCases - 1 ? 'Next Analysis' : 'Final Evaluation'}
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
