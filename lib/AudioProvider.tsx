'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { audioEngine, AudioEngine } from './AudioEngine'

interface AudioContextType {
  engine: AudioEngine;
  isUnlocked: boolean;
  unlockAudio: () => void;
  playClick: () => void;
  playHover: () => void;
  playMechanicalClick: () => void;
  setTension: (level: number) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined)

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isUnlocked, setIsUnlocked] = useState(false)

  // Only unlock on explicit user intention, usually from a click
  const unlockAudio = () => {
    if (!isUnlocked) {
      audioEngine.resume();
      setIsUnlocked(true);
    }
  }

  const playClick = () => {
    if (isUnlocked) {
      audioEngine.playClick();
    }
  }

  const playHover = () => {
    if (isUnlocked) {
      audioEngine.playMechanicalHover();
    }
  }

  const playMechanicalClick = () => {
    if (isUnlocked) {
      audioEngine.playMechanicalClick();
    }
  }

  const setTension = (level: number) => {
    if (isUnlocked) {
      audioEngine.setTension(level);
    }
  }

  // Cleanup on unmount (though this lives at root level usually)
  useEffect(() => {
    return () => {
      // Clean up logic if needed, context suspension handled broadly
    }
  }, [])

  return (
    <AudioContext.Provider value={{ engine: audioEngine, isUnlocked, unlockAudio, playClick, playHover, playMechanicalClick, setTension }}>
      {children}
    </AudioContext.Provider>
  )
}

export function useAudio() {
  const context = useContext(AudioContext)
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider')
  }
  return context
}
