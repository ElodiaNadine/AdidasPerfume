import React from 'react';
import { Star, Zap, ArrowRight } from 'lucide-react';

export const LandingPage = ({ startQuiz }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center relative z-10">
      
      <div className="absolute top-1/4 left-6 md:left-20 animate-bounce delay-100">
        <Star className="w-10 h-10 text-[#f4b337] fill-[#f4b337] drop-shadow-md transform -rotate-12" />
      </div>
      <div className="absolute bottom-1/3 right-6 md:right-20 animate-pulse">
        <Zap className="w-12 h-12 text-[#f58362] fill-[#f58362] drop-shadow-md transform rotate-12" />
      </div>
      <div className="absolute top-1/3 right-10 w-0 h-0 border-l-[10px] border-l-transparent border-t-[20px] border-t-white border-r-[10px] border-r-transparent rotate-45 opacity-60"></div>
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border-[3px] border-white/20 rounded-full animate-ping [animation-duration:3s]"></div>

      <div className="mb-8 relative group">
        <div className="absolute inset-0 bg-white rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-pulse"></div>

        <div className="relative w-60 h-60 md:w-48 md:h-48 bg-white rounded-full p-4 shadow-[0px_10px_0px_rgba(0,0,0,0.1)] border-[4px] border-white flex items-center justify-center overflow-hidden animate-float transform rotate-3 hover:rotate-0 transition-all duration-500">
          <img 
            src="https://static-id.zacdn.com/p/adidas-body-care-6389-0245684-1.jpg" 
            alt="Adidas Vibes" 
            className="max-w-[90%] max-h-[90%] object-contain origin-center transform transition-transform duration-500 group-hover:scale-110" 
            style={{ animation: 'float 5s ease-in-out infinite' }} 
          />
        </div>
        
        <div className="absolute -top-2 -right-4 bg-[#f58362] text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-full rotate-12 shadow-[2px_2px_0px_#000] animate-bounce border-2 border-white">
          New Drop
        </div>
        <div className="absolute -bottom-2 -left-4 bg-[#f4b337] text-[#1d248a] text-[10px] font-black uppercase px-3 py-1.5 rounded-full -rotate-12 shadow-[2px_2px_0px_#000] border-2 border-white">
          Trending
        </div>
      </div>
      
      <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter uppercase italic leading-[0.85] drop-shadow-[4px_4px_0px_#1d248a] transform -skew-x-3">
        Check <br/>
        <span className="text-[#f4b337] inline-block relative">
          Your Vibe
          <svg className="absolute w-full h-4 -bottom-2 left-0 text-white" viewBox="0 0 100 10" preserveAspectRatio="none">
            <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
          </svg>
        </span>
      </h1>
      
      <p className="text-base md:text-lg font-bold text-white max-w-sm mb-12 leading-relaxed uppercase tracking-tight drop-shadow-md">
        Discover which scent from the new Adidas Vibes collection matches your personality.
      </p>
      
      <button 
        onClick={startQuiz}
        className="group relative inline-flex items-center justify-center px-12 py-5 text-xl font-black text-[#1d248a] transition-all duration-200 bg-white rounded-full focus:outline-none hover:scale-105 shadow-[6px_6px_0px_#1d248a] hover:shadow-[8px_8px_0px_#f58362] hover:-translate-y-1 uppercase tracking-widest italic border-4 border-transparent active:shadow-none active:translate-y-1"
      >
        Start Quiz
        <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform text-[#f58362]" />
      </button>
    </div>
  );
};
