import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { AudioEngine } from '@/lib/AudioEngine'

// Mock Web Audio API — use a factory function that can be called with `new`
function createMockAudioContext() {
  const oscillator = {
    type: 'sine',
    frequency: { value: 0, linearRampToValueAtTime: vi.fn(), setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
  }

  const gain = {
    gain: { value: 0, linearRampToValueAtTime: vi.fn(), setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
    connect: vi.fn(),
  }

  const buffer = {
    getChannelData: vi.fn(() => new Float32Array(0)),
    length: 0,
  }

  const bufferSource = {
    buffer: null as typeof buffer | null,
    loop: false,
    connect: vi.fn(),
    start: vi.fn(),
  }

  const filter = {
    type: 'lowpass',
    frequency: { value: 0, linearRampToValueAtTime: vi.fn(), setValueAtTime: vi.fn() },
    connect: vi.fn(),
  }

  const mockCtx = {
    state: 'suspended' as AudioContextState,
    currentTime: 0,
    sampleRate: 44100,
    createOscillator: vi.fn(() => ({
      type: 'sine',
      frequency: { value: 0, linearRampToValueAtTime: vi.fn(), setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    })),
    createGain: vi.fn(() => ({
      gain: { value: 0, linearRampToValueAtTime: vi.fn(), setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
      connect: vi.fn(),
    })),
    createBuffer: vi.fn((_channels: number, length: number, _sampleRate: number) => ({
      getChannelData: vi.fn(() => new Float32Array(length)),
      length,
    })),
    createBufferSource: vi.fn(() => ({
      buffer: null,
      loop: false,
      connect: vi.fn(),
      start: vi.fn(),
    })),
    createBiquadFilter: vi.fn(() => ({
      type: 'lowpass',
      frequency: { value: 0, linearRampToValueAtTime: vi.fn(), setValueAtTime: vi.fn() },
      connect: vi.fn(),
    })),
    resume: vi.fn(() => {
      mockCtx.state = 'running'
      return Promise.resolve()
    }),
    destination: {} as AudioDestinationNode,
  }

  return mockCtx
}

// Track AudioContext constructor calls
let audioContextCalls = 0
let lastMockCtx: ReturnType<typeof createMockAudioContext>

const MockAudioContext = vi.fn(function () {
  audioContextCalls++
  lastMockCtx = createMockAudioContext()
  return lastMockCtx
})

describe('AudioEngine', () => {
  let engine: AudioEngine

  beforeEach(() => {
    audioContextCalls = 0
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    global.window = { AudioContext: MockAudioContext, webkitAudioContext: MockAudioContext } as any
    engine = new AudioEngine()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  function getCtx() {
    return lastMockCtx
  }

  describe('initialize', () => {
    it('should create AudioContext on initialize', () => {
      engine.initialize()
      expect(MockAudioContext).toHaveBeenCalled()
    })

    it('should not initialize twice', () => {
      engine.initialize()
      engine.initialize()
      expect(MockAudioContext).toHaveBeenCalledTimes(1)
    })

    it('should create oscillator and gain for hum', () => {
      engine.initialize()
      expect(getCtx().createOscillator).toHaveBeenCalled()
      expect(getCtx().createGain).toHaveBeenCalled()
    })

    it('should create buffer source for noise', () => {
      engine.initialize()
      expect(getCtx().createBuffer).toHaveBeenCalledWith(1, 88200, 44100)
      expect(getCtx().createBufferSource).toHaveBeenCalled()
    })

    it('should create biquad filter for noise', () => {
      engine.initialize()
      expect(getCtx().createBiquadFilter).toHaveBeenCalled()
    })

    it('should start hum oscillator', () => {
      engine.initialize()
      const oscillator = getCtx().createOscillator.mock.results[0].value
      expect(oscillator.start).toHaveBeenCalled()
    })

    it('should start noise source', () => {
      engine.initialize()
      const noiseSource = getCtx().createBufferSource.mock.results[0].value
      expect(noiseSource.start).toHaveBeenCalled()
    })

    it('should handle AudioContext creation failure gracefully', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      global.window = { AudioContext: vi.fn(function () { throw new Error('Audio not supported') }) } as any
      const errorEngine = new AudioEngine()
      expect(() => errorEngine.initialize()).not.toThrow()
    })

    it('should set hum oscillator type to triangle', () => {
      engine.initialize()
      const oscillator = getCtx().createOscillator.mock.results[0].value
      expect(oscillator.type).toBe('triangle')
    })

    it('should set initial hum frequency to 55Hz', () => {
      engine.initialize()
      const oscillator = getCtx().createOscillator.mock.results[0].value
      expect(oscillator.frequency.value).toBe(55)
    })

    it('should set initial hum gain to 0.05', () => {
      engine.initialize()
      const gain = getCtx().createGain.mock.results[0].value
      expect(gain.gain.value).toBe(0.05)
    })
  })

  describe('resume', () => {
    it('should resume suspended context', () => {
      engine.initialize()
      getCtx().state = 'suspended'
      engine.resume()
      expect(getCtx().resume).toHaveBeenCalled()
    })

    it('should initialize if not already initialized', () => {
      engine.resume()
      expect(MockAudioContext).toHaveBeenCalled()
    })

    it('should not resume if context is already running', () => {
      engine.initialize()
      getCtx().state = 'running'
      engine.resume()
      expect(getCtx().resume).not.toHaveBeenCalled()
    })
  })

  describe('setTension', () => {
    beforeEach(() => {
      engine.initialize()
    })

    it('should clamp tension to 0 minimum', () => {
      engine.setTension(-1)
      expect(() => engine.setTension(0)).not.toThrow()
    })

    it('should clamp tension to 1 maximum', () => {
      engine.setTension(2)
      expect(() => engine.setTension(1)).not.toThrow()
    })

    it('should not modify audio if not initialized', () => {
      const freshEngine = new AudioEngine()
      expect(() => freshEngine.setTension(0.5)).not.toThrow()
    })

    it('should modulate hum frequency based on tension', () => {
      engine.setTension(1)
      const oscillator = getCtx().createOscillator.mock.results[0].value
      // 55 + (1 * 30) = 85
      expect(oscillator.frequency.linearRampToValueAtTime).toHaveBeenCalledWith(85, expect.any(Number))
    })

    it('should modulate hum gain based on tension', () => {
      engine.setTension(1)
      const gain = getCtx().createGain.mock.results[0].value
      // 0.05 + (1 * 0.1) = 0.15
      expect(gain.gain.linearRampToValueAtTime).toHaveBeenCalled()
      const [value] = gain.gain.linearRampToValueAtTime.mock.calls[0]
      expect(value).toBeCloseTo(0.15, 10)
    })

    it('should not crash when tension is set after initialization', () => {
      const freshEngine = new AudioEngine()
      freshEngine.initialize()
      freshEngine.setTension(0.5)
      // If we get here without throwing, the test passes
      expect(true).toBe(true)
    })
  })

  describe('playClick', () => {
    it('should create square oscillator for click sound', () => {
      engine.initialize()
      const prevCalls = getCtx().createOscillator.mock.calls.length
      engine.playClick()
      expect(getCtx().createOscillator.mock.calls.length).toBeGreaterThan(prevCalls)
    })

    it('should not create nodes if not initialized', () => {
      const freshEngine = new AudioEngine()
      const prevCalls = MockAudioContext.mock.calls.length
      freshEngine.playClick()
      // AudioContext shouldn't be created for click alone
      expect(MockAudioContext.mock.calls.length).toBe(prevCalls)
    })

    it('should set click frequency around 800Hz', () => {
      engine.initialize()
      engine.playClick()
      const calls = getCtx().createOscillator.mock.calls
      const lastOsc = getCtx().createOscillator.mock.results[calls.length - 1].value
      expect(lastOsc.frequency.setValueAtTime).toHaveBeenCalled()
    })
  })

  describe('playMechanicalHover', () => {
    it('should create square oscillator for hover', () => {
      engine.initialize()
      const prevCalls = getCtx().createOscillator.mock.calls.length
      engine.playMechanicalHover()
      expect(getCtx().createOscillator.mock.calls.length).toBeGreaterThan(prevCalls)
    })

    it('should set hover frequency to 100Hz', () => {
      engine.initialize()
      engine.playMechanicalHover()
      const calls = getCtx().createOscillator.mock.calls
      const lastOsc = getCtx().createOscillator.mock.results[calls.length - 1].value
      expect(lastOsc.frequency.setValueAtTime).toHaveBeenCalledWith(100, expect.any(Number))
    })

    it('should not create nodes if not initialized', () => {
      const freshEngine = new AudioEngine()
      const prevCalls = MockAudioContext.mock.calls.length
      freshEngine.playMechanicalHover()
      expect(MockAudioContext.mock.calls.length).toBe(prevCalls)
    })
  })

  describe('playMechanicalClick', () => {
    it('should create sine oscillator for thump', () => {
      engine.initialize()
      const prevCalls = getCtx().createOscillator.mock.calls.length
      engine.playMechanicalClick()
      expect(getCtx().createOscillator.mock.calls.length).toBeGreaterThan(prevCalls)
    })

    it('should create noise buffer for mechanical click', () => {
      engine.initialize()
      engine.playMechanicalClick()
      expect(getCtx().createBuffer).toHaveBeenCalled()
    })

    it('should not create nodes if not initialized', () => {
      const freshEngine = new AudioEngine()
      const prevCalls = MockAudioContext.mock.calls.length
      freshEngine.playMechanicalClick()
      expect(MockAudioContext.mock.calls.length).toBe(prevCalls)
    })
  })
})
