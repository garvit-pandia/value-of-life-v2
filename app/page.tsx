import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-black px-4 text-center select-none overflow-hidden relative">
      {/* Background atmospheric glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/5 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/5 rounded-full blur-[120px]"></div>

      <div className="flex flex-col items-center gap-10 relative z-10">
        <p className="text-[10px] text-gray-500 tracking-[0.3em] uppercase opacity-0 animate-reveal" style={{ animationDelay: '0.1s' }}>
          A real case. A real payout. Your instinct.
        </p>
        
        <h1 className="text-5xl md:text-7xl text-white font-serif italic tracking-tight opacity-0 animate-reveal" style={{ animationDelay: '0.3s' }}>
          A life, reduced to a number.
        </h1>
        
        <p className="text-gray-400 max-w-sm text-sm md:text-base leading-relaxed font-light opacity-0 animate-reveal" style={{ animationDelay: '0.5s' }}>
          Estimate the legal settlement of actual court cases. 
          Discover the systemic biases in how we value human existence.
        </p>
        
        <div className="mt-8 opacity-0 animate-reveal" style={{ animationDelay: '0.8s' }}>
          <Link 
            href="/play" 
            className="group relative inline-flex h-12 items-center justify-center overflow-hidden border border-white/20 px-10 font-medium text-white transition-all duration-300 hover:border-white hover:pl-12"
          >
            <span className="absolute left-4 opacity-0 transition-all duration-300 group-hover:left-6 group-hover:opacity-100 italic font-serif">→</span>
            <span>Begin Analysis</span>
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 left-0 right-0 text-[10px] text-gray-600 tracking-widest uppercase opacity-0 animate-reveal" style={{ animationDelay: '1.2s' }}>
        A Research Experiment
      </div>
    </main>
  );
}
