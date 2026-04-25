import { describe, it, expect } from 'vitest'
import { getPattern } from '@/lib/patternEngine'
import { GuessRecord } from '@/types'

function makeGuess(overrides: Partial<GuessRecord> = {}): GuessRecord {
  return {
    caseId: 'test-case-1',
    guessedAmount: 1000000,
    actualAmount: 1000000,
    ratio: 1,
    country: 'India',
    occupation: 'Factory Worker',
    age: 35,
    gender: 'Male',
    ...overrides,
  }
}

describe('getPattern', () => {
  describe('bias line calculations', () => {
    it('should report overestimation when mean ratio > 1.5', () => {
      const guesses: GuessRecord[] = [
        makeGuess({ ratio: 2, guessedAmount: 2000000, actualAmount: 1000000 }),
        makeGuess({ ratio: 3, guessedAmount: 3000000, actualAmount: 1000000 }),
      ]
      const result = getPattern(guesses)
      expect(result.biasLine).toContain('overestimated')
      expect(result.biasLine).toContain('2.5x')
    })

    it('should report underestimation when mean ratio < 0.5', () => {
      const guesses: GuessRecord[] = [
        makeGuess({ ratio: 0.25, guessedAmount: 250000, actualAmount: 1000000 }),
        makeGuess({ ratio: 0.5, guessedAmount: 500000, actualAmount: 1000000 }),
      ]
      const result = getPattern(guesses)
      expect(result.biasLine).toContain('underestimated')
      expect(result.biasLine).toContain('2.7x') // 1 / 0.375 ≈ 2.67
    })

    it('should report rough match when mean ratio is between 0.5 and 1.5', () => {
      const guesses: GuessRecord[] = [
        makeGuess({ ratio: 0.8, guessedAmount: 800000, actualAmount: 1000000 }),
        makeGuess({ ratio: 1.2, guessedAmount: 1200000, actualAmount: 1000000 }),
      ]
      const result = getPattern(guesses)
      expect(result.biasLine).toContain('roughly matched')
    })

    it('should default mean to 1 when no valid guesses', () => {
      const result = getPattern([])
      expect(result.biasLine).toContain('roughly matched')
    })

    it('should default mean to 1 when all ratios are null', () => {
      const guesses: GuessRecord[] = [
        makeGuess({ ratio: null }),
        makeGuess({ ratio: null }),
      ]
      const result = getPattern(guesses)
      expect(result.biasLine).toContain('roughly matched')
    })

    it('should filter out infinite ratios', () => {
      const guesses: GuessRecord[] = [
        makeGuess({ ratio: Infinity }),
        makeGuess({ ratio: 2, guessedAmount: 2000000, actualAmount: 1000000 }),
      ]
      const result = getPattern(guesses)
      expect(result.biasLine).toContain('overestimated')
      expect(result.biasLine).toContain('2.0x')
    })

    it('should include the total number of guesses in bias line', () => {
      const guesses: GuessRecord[] = [
        makeGuess(),
        makeGuess(),
        makeGuess(),
      ]
      const result = getPattern(guesses)
      expect(result.biasLine).toContain('3 cases')
    })
  })

  describe('agreement line calculations', () => {
    it('should identify the closest demographic match', () => {
      const guesses: GuessRecord[] = [
        makeGuess({
          ratio: 2,
          age: 25,
          gender: 'Female',
          occupation: 'Nurse',
          country: 'USA',
        }),
        makeGuess({
          ratio: 1.1,
          age: 40,
          gender: 'Male',
          occupation: 'Driver',
          country: 'India',
        }),
        makeGuess({
          ratio: 3,
          age: 55,
          gender: 'Male',
          occupation: 'Engineer',
          country: 'UK',
        }),
      ]
      const result = getPattern(guesses)
      expect(result.agreementLine).toContain('40-year-old male driver in India')
    })

    it('should filter out cases with unknown demographics', () => {
      const guesses: GuessRecord[] = [
        makeGuess({ ratio: 1.1, age: null }),
        makeGuess({ ratio: 2, age: 30, gender: 'Female', occupation: 'Teacher' }),
      ]
      const result = getPattern(guesses)
      expect(result.agreementLine).toContain('30-year-old female teacher')
    })

    it('should filter out cases with Not recorded gender', () => {
      const guesses: GuessRecord[] = [
        makeGuess({ ratio: 1.1, gender: 'Not recorded' }),
        makeGuess({ ratio: 2, age: 30, gender: 'Female', occupation: 'Teacher' }),
      ]
      const result = getPattern(guesses)
      expect(result.agreementLine).toContain('30-year-old female teacher')
    })

    it('should filter out cases with Unknown occupation', () => {
      const guesses: GuessRecord[] = [
        makeGuess({ ratio: 1.1, occupation: 'Unknown' }),
        makeGuess({ ratio: 2, age: 30, gender: 'Female', occupation: 'Teacher' }),
      ]
      const result = getPattern(guesses)
      expect(result.agreementLine).toContain('30-year-old female teacher')
    })

    it('should filter out cases with Not a specific individual occupation', () => {
      const guesses: GuessRecord[] = [
        makeGuess({ ratio: 1.1, occupation: 'Not a specific individual' }),
        makeGuess({ ratio: 2, age: 30, gender: 'Female', occupation: 'Teacher' }),
      ]
      const result = getPattern(guesses)
      expect(result.agreementLine).toContain('30-year-old female teacher')
    })

    it('should report insufficient data when no demographic guesses available', () => {
      const guesses: GuessRecord[] = [
        makeGuess({ age: null }),
        makeGuess({ gender: 'Not recorded' }),
        makeGuess({ occupation: 'Unknown' }),
      ]
      const result = getPattern(guesses)
      expect(result.agreementLine).toBe('Not enough demographic data to determine agreement pattern.')
    })

    it('should handle empty guesses array for agreement line', () => {
      const result = getPattern([])
      expect(result.agreementLine).toBe('Not enough demographic data to determine agreement pattern.')
    })

    it('should lowercase gender and occupation in agreement line', () => {
      const guesses: GuessRecord[] = [
        makeGuess({ ratio: 1.1, age: 25, gender: 'Female', occupation: 'Software Engineer' }),
      ]
      const result = getPattern(guesses)
      expect(result.agreementLine).toContain('female')
      expect(result.agreementLine).toContain('software engineer')
      expect(result.agreementLine).not.toContain('Female')
      expect(result.agreementLine).not.toContain('Software Engineer')
    })
  })

  describe('edge cases', () => {
    it('should handle ratio exactly at boundary 1.5', () => {
      const guesses: GuessRecord[] = [
        makeGuess({ ratio: 1.5 }),
      ]
      const result = getPattern(guesses)
      // At exactly 1.5, condition mean > 1.5 is false, so "roughly matched"
      expect(result.biasLine).toContain('roughly matched')
    })

    it('should handle ratio exactly at boundary 0.5', () => {
      const guesses: GuessRecord[] = [
        makeGuess({ ratio: 0.5 }),
      ]
      const result = getPattern(guesses)
      // At exactly 0.5, it falls into the "roughly matched" branch
      expect(result.biasLine).toContain('roughly matched')
    })

    it('should handle single valid guess', () => {
      const guesses: GuessRecord[] = [
        makeGuess({ ratio: 0.9, age: 28, gender: 'Male', occupation: 'Miner' }),
      ]
      const result = getPattern(guesses)
      expect(result.biasLine).toContain('roughly matched')
      expect(result.agreementLine).toContain('28-year-old male miner')
    })

    it('should handle very large ratios gracefully', () => {
      const guesses: GuessRecord[] = [
        makeGuess({ ratio: 100, guessedAmount: 100000000, actualAmount: 1000000 }),
      ]
      const result = getPattern(guesses)
      expect(result.biasLine).toContain('overestimated')
      expect(result.biasLine).toContain('100.0x')
    })

    it('should handle very small ratios gracefully', () => {
      const guesses: GuessRecord[] = [
        makeGuess({ ratio: 0.01, guessedAmount: 10000, actualAmount: 1000000 }),
      ]
      const result = getPattern(guesses)
      expect(result.biasLine).toContain('underestimated')
      expect(result.biasLine).toContain('100.0x') // 1 / 0.01 = 100
    })
  })
})
