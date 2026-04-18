import { Case } from '@/types'

export function CaseCard({ currentCase }: { currentCase: Case }) {
  const availableSections = [
    { label: 'Occupation', value: currentCase.occupation },
    { label: 'Age', value: currentCase.age },
    { label: 'Gender', value: currentCase.gender },
    { label: 'Family Status', value: currentCase.familySituation },
  ].filter(section => {
    if (section.value === null || section.value === undefined || section.value === '') return false;
    const s = section.value.toString().trim().toLowerCase();
    
    // Exact matches to drop completely meaningless data
    const uselessPhrases = [
      'unknown', 'not recorded', 'not recorded.', 'not recorded in filing.', 
      'not recorded in public filings.', 'not recorded in judgment.', 'not applicable.', 'not applicable', 'n/a'
    ];
    
    return !uselessPhrases.includes(s);
  })

  return (
    <div className="dossier-card p-5 md:p-6 relative">
      <div className="space-y-6 relative z-10">
        <div className="border-b-2 border-parchment/60 pb-4 border-dashed">
          <p className="font-mono text-xs md:text-sm font-bold text-parchment/90 uppercase tracking-widest mb-1 bg-[#050505] inline-block px-2 py-1 -ml-1 border-l-4 border-stamp-red">
            JURISDICTION: {currentCase.country}{currentCase.year ? ` / YEAR: ${currentCase.year}` : ''}
          </p>
          <h2 className="text-xl md:text-2xl text-parchment font-serif italic leading-snug font-bold mt-1 uppercase">
            {currentCase.causeOfDeath}
          </h2>
          {currentCase.caseName && (
            <p className="font-mono text-xs text-parchment/50 mt-2 uppercase max-w-sm">
              REF: {currentCase.caseName}
            </p>
          )}
        </div>

        {availableSections.length > 0 && (
          <div className={`grid ${availableSections.length > 1 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'} gap-6`}>
            {availableSections.map((section) => (
              <div key={section.label} className="space-y-1">
                <p className="font-mono text-[10px] text-parchment/50 uppercase tracking-widest">{section.label}</p>
                <p className="font-mono text-sm text-parchment uppercase">{section.value}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Decorative dossier corners */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-stamp-red -mt-[2px] -ml-[2px]"></div>
      <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-stamp-red -mt-[2px] -mr-[2px]"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-parchment -mb-[2px] -ml-[2px] opacity-30"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-parchment -mb-[2px] -mr-[2px] opacity-30"></div>
    </div>
  )
}
