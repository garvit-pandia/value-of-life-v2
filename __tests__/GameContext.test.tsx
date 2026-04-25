import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { GameProvider, useGame } from '@/lib/GameContext'
import React from 'react'

function TestComponent() {
  const { guesses, addGuess, resetGame, isInitialized } = useGame()
  return (
    <div>
      <div data-testid="initialized">{isInitialized ? 'true' : 'false'}</div>
      <div data-testid="guess-count">{guesses.length}</div>
      <button
        data-testid="add-guess"
        onClick={() =>
          addGuess({
            caseId: 'test-1',
            guessedAmount: 1000000,
            actualAmount: 2000000,
            ratio: 0.5,
            country: 'India',
            occupation: 'Worker',
            age: 30,
            gender: 'Male',
          })
        }
      >
        Add Guess
      </button>
      <button data-testid="reset" onClick={resetGame}>
        Reset
      </button>
      <div data-testid="guesses">{JSON.stringify(guesses)}</div>
    </div>
  )
}

describe('GameProvider', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
  })

  it('should initialize with empty guesses', () => {
    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    )

    expect(screen.getByTestId('initialized')).toHaveTextContent('true')
    expect(screen.getByTestId('guess-count')).toHaveTextContent('0')
  })

  it('should add a guess', () => {
    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    )

    act(() => {
      screen.getByTestId('add-guess').click()
    })

    expect(screen.getByTestId('guess-count')).toHaveTextContent('1')
  })

  it('should persist guesses to sessionStorage', () => {
    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    )

    act(() => {
      screen.getByTestId('add-guess').click()
    })

    expect(window.sessionStorage.setItem).toHaveBeenCalledWith(
      'game_guesses',
      expect.stringContaining('test-1')
    )
  })

  it('should load guesses from sessionStorage on mount', () => {
    const storedGuesses = [
      {
        caseId: 'stored-1',
        guessedAmount: 500000,
        actualAmount: 1000000,
        ratio: 0.5,
        country: 'USA',
        occupation: 'Driver',
        age: 25,
        gender: 'Female',
      },
    ]
    ;(window.sessionStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValueOnce(
      JSON.stringify(storedGuesses)
    )

    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    )

    expect(screen.getByTestId('guess-count')).toHaveTextContent('1')
    expect(screen.getByTestId('guesses')).toHaveTextContent('stored-1')
  })

  it('should handle corrupted sessionStorage gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    ;(window.sessionStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValueOnce(
      'not-valid-json'
    )

    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    )

    expect(screen.getByTestId('guess-count')).toHaveTextContent('0')
    expect(consoleSpy).toHaveBeenCalledWith('Failed to parse stored guesses')

    consoleSpy.mockRestore()
  })

  it('should reset game and clear sessionStorage', () => {
    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    )

    act(() => {
      screen.getByTestId('add-guess').click()
    })

    expect(screen.getByTestId('guess-count')).toHaveTextContent('1')

    act(() => {
      screen.getByTestId('reset').click()
    })

    expect(screen.getByTestId('guess-count')).toHaveTextContent('0')
    expect(window.sessionStorage.removeItem).toHaveBeenCalledWith('game_guesses')
  })

  it('should accumulate multiple guesses', () => {
    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    )

    act(() => {
      screen.getByTestId('add-guess').click()
    })
    act(() => {
      screen.getByTestId('add-guess').click()
    })
    act(() => {
      screen.getByTestId('add-guess').click()
    })

    expect(screen.getByTestId('guess-count')).toHaveTextContent('3')
  })
})

describe('useGame hook', () => {
  it('should throw when used outside GameProvider', () => {
    function BadComponent() {
      useGame()
      return <div>Bad</div>
    }

    // Suppress console.error for this expected error
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      render(<BadComponent />)
    }).toThrow('useGame must be used within a GameProvider')

    consoleSpy.mockRestore()
  })
})
