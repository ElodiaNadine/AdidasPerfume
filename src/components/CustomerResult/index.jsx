import React from 'react';
import { Star, Sparkles, Activity, ShoppingBag } from 'lucide-react';

export const CustomerResult = ({ result, code }) => {
  return (
    <div className="max-w-sm md:max-w-md mx-auto px-4 py-8 animate-fade-in relative z-10">
      
      <div className="text-center mb-8 animate-float relative">
        <span className="inline-block bg-white text-[#1d248a] font-black uppercase tracking-widest text-[10px] px-4 py-1.5 rounded-full shadow-[4px_4px_0px_rgba(0,0,0,0.2)] mb-3 border-2 border-white transform -rotate-2">
          You Matched With
        </span>
        <h1 className="text-5xl md:text-6xl font-black text-white italic tracking-tighter uppercase drop-shadow-[4px_4px_0px_#1d248a] transform -rotate-3 leading-[0.85]">
          {result.title}
        </h1>
        <div className="absolute -top-6 -right-4 text-[#f4b337] animate-bounce">
          <Star className="w-8 h-8 fill-current stroke-white stroke-2" />
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-[0px_20px_50px_rgba(0,0,0,0.3)] overflow-hidden border-[6px] border-white relative">
        
        <div className={`relative pt-8 pb-4 px-8 flex justify-center bg-gradient-to-b from-gray-50 to-white`}>
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-gray-100/50 to-transparent"></div>
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 ${result.color} rounded-full filter blur-3xl opacity-30`}></div>
          
          <div className="relative w-36 h-36 bg-white rounded-[2rem] p-3 shadow-[8px_8px_0px_rgba(0,0,0,0.1)] border-2 border-gray-100 transform rotate-6 hover:rotate-0 transition-transform duration-500">
            <img 
              src={result.img} 
              alt={result.title} 
              className="w-full h-full object-contain drop-shadow-sm"
              onError={(e) => e.target.src = "https://placehold.co/400x600?text=Perfume"}
            />
          </div>
        </div>
        
        <div className="p-6 text-center relative z-10">
          <p className={`text-2xl font-black uppercase mb-4 ${result.text} tracking-tight leading-none drop-shadow-sm italic`}>{result.vibe}</p>
          
          <div className="bg-gray-50 rounded-2xl p-5 mb-5 text-left border-2 border-dashed border-[#1d248a]/30 relative overflow-hidden group hover:bg-white transition-colors">
            <p className="text-gray-800 font-bold text-sm mb-4 leading-relaxed">{result.desc}</p>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${result.color} text-white shadow-[2px_2px_0px_#000]`}>
                  <Sparkles className="w-3 h-3" />
                </div>
                <div>
                  <span className="text-[9px] font-black text-gray-400 uppercase block tracking-widest">Scent Notes</span>
                  <span className="font-bold text-gray-900 text-xs">{result.scent}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${result.color} text-white shadow-[2px_2px_0px_#000]`}>
                  <Activity className="w-3 h-3" />
                </div>
                <div>
                  <span className="text-[9px] font-black text-gray-400 uppercase block tracking-widest">Perfect For</span>
                  <span className="font-bold text-gray-900 text-xs">{result.bestFor}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#1d248a] rounded-xl p-1 text-white shadow-[6px_6px_0px_#f58362] transform hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#f58362] transition-all cursor-default">
            <div className="border-2 border-dashed border-white/30 rounded-lg p-4 bg-[#1d248a] relative overflow-hidden">
              <div className="absolute -right-4 -top-4 text-white/10 rotate-12">
                <ShoppingBag className="w-16 h-16" />
              </div>
              <p className="text-[9px] font-bold text-blue-200 uppercase tracking-widest mb-1 relative z-10">Show Code to Staff</p>
              <div className="text-3xl font-black font-mono tracking-widest text-white drop-shadow-[2px_2px_0px_#000] relative z-10">
                {code}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
