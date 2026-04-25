import { describe, it, expect } from 'vitest'
import { formatINR, parseLakhCrore } from '@/lib/currencyUtils'

describe('formatINR', () => {
  it('should format crore amounts', () => {
    expect(formatINR(10000000)).toBe('₹1.0 crore')
    expect(formatINR(25000000)).toBe('₹2.5 crore')
    expect(formatINR(100000000)).toBe('₹10.0 crore')
  })

  it('should format lakh amounts', () => {
    expect(formatINR(100000)).toBe('₹1.0 lakh')
    expect(formatINR(500000)).toBe('₹5.0 lakh')
    expect(formatINR(9999999)).toBe('₹100.0 lakh')
  })

  it('should format zero', () => {
    expect(formatINR(0)).toBe('₹0')
  })

  it('should format small amounts with Indian locale', () => {
    expect(formatINR(50000)).toBe('₹50,000')
    expect(formatINR(1000)).toBe('₹1,000')
    expect(formatINR(1)).toBe('₹1')
  })

  it('should format medium amounts below 1 lakh', () => {
    expect(formatINR(99999)).toBe('₹99,999')
    expect(formatINR(50000)).toBe('₹50,000')
  })

  it('should handle boundary at exactly 1 crore', () => {
    expect(formatINR(10000000)).toBe('₹1.0 crore')
  })

  it('should handle boundary just below 1 crore', () => {
    expect(formatINR(9999999)).toBe('₹100.0 lakh')
  })

  it('should handle very large crore amounts', () => {
    expect(formatINR(1000000000)).toBe('₹100.0 crore')
    expect(formatINR(500000000)).toBe('₹50.0 crore')
  })

  it('should format with one decimal place for crore/lakh', () => {
    expect(formatINR(15000000)).toBe('₹1.5 crore')
    expect(formatINR(150000)).toBe('₹1.5 lakh')
  })

  it('should handle fractional crore values', () => {
    expect(formatINR(12500000)).toBe('₹1.3 crore')
  })
})

describe('parseLakhCrore', () => {
  it('should parse lakh values', () => {
    expect(parseLakhCrore('1', 'lakh')).toBe(100000)
    expect(parseLakhCrore('5', 'lakh')).toBe(500000)
    expect(parseLakhCrore('10', 'lakh')).toBe(1000000)
  })

  it('should parse crore values', () => {
    expect(parseLakhCrore('1', 'crore')).toBe(10000000)
    expect(parseLakhCrore('5', 'crore')).toBe(50000000)
    expect(parseLakhCrore('0.5', 'crore')).toBe(5000000)
  })

  it('should parse decimal values', () => {
    expect(parseLakhCrore('1.5', 'lakh')).toBe(150000)
    expect(parseLakhCrore('2.25', 'crore')).toBe(22500000)
  })

  it('should return 0 for invalid input', () => {
    expect(parseLakhCrore('', 'lakh')).toBe(0)
    expect(parseLakhCrore('abc', 'lakh')).toBe(0)
    expect(parseLakhCrore('not-a-number', 'crore')).toBe(0)
  })

  it('should return 0 for NaN', () => {
    expect(parseLakhCrore('NaN', 'lakh')).toBe(0)
  })

  it('should handle Infinity input', () => {
    // parseFloat('Infinity') returns Infinity, not NaN
    expect(parseLakhCrore('Infinity', 'lakh')).toBe(Infinity)
    expect(parseLakhCrore('Infinity', 'crore')).toBe(Infinity)
  })

  it('should handle whitespace', () => {
    expect(parseLakhCrore(' 5 ', 'lakh')).toBe(500000)
    expect(parseLakhCrore(' 2.5 ', 'crore')).toBe(25000000)
  })

  it('should handle zero', () => {
    expect(parseLakhCrore('0', 'lakh')).toBe(0)
    expect(parseLakhCrore('0', 'crore')).toBe(0)
  })

  it('should handle very large numbers', () => {
    expect(parseLakhCrore('100', 'crore')).toBe(1000000000)
    expect(parseLakhCrore('1000', 'lakh')).toBe(100000000)
  })

  it('should handle negative numbers (parses but returns negative INR)', () => {
    expect(parseLakhCrore('-5', 'lakh')).toBe(-500000)
    expect(parseLakhCrore('-1', 'crore')).toBe(-10000000)
  })
})
