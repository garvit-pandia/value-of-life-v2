export interface Case {
  id: string
  country: string
  countryCode: string
  year: number | null
  caseName?: string
  causeOfDeath: string
  occupation: string
  age: number | null
  gender: "Male" | "Female" | "Not recorded" | string
  familySituation: string
  actualPayoutINR: number
  actualPayoutUSD?: number
  actualPayoutAUD?: number
  actualPayoutCAD?: number
  actualPayoutGBP?: number
  methodologyNote: string
  sourceURL: string | null
}

export interface GuessRecord {
  caseId: string
  guessedAmount: number
  actualAmount: number
  ratio: number | null
  country: string
  occupation: string
  age: number | null
  gender: string
}

export interface PatternResult {
  biasLine: string
  agreementLine: string
}
