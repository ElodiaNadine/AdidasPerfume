import React, { useState, useEffect } from 'react';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { ArrowRight } from 'lucide-react';
import { HashRouter, Routes, Route } from 'react-router-dom';

// Firebase & Config
import { auth } from './config/firebase';
import { ADIDAS_LOGO } from './constants/assets';

// Components
import { LandingPage } from './components/LandingPage';
import { CustomerQuiz } from './components/CustomerQuiz';
import { CustomerResult } from './components/CustomerResult';
import { StaffDashboard } from './components/StaffDashboard';

// Pages
import { InsightsDashboard } from './pages/InsightsPage';

// --- ROUTER FLOW COMPONENTS ---

const ClientFlow = ({ user }) => {
  const [view, setView] = useState('home'); 
  const [currentResult, setCurrentResult] = useState(null);
  const [generatedCode, setGeneratedCode] = useState("");

  return (
    <>
      <nav className="fixed w-full z-50 top-0 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center cursor-pointer gap-3 group" onClick={() => setView('home')}>
                <div className="bg-white/10 backdrop-blur-sm p-1.5 rounded-lg border-2 border-white/20 group-hover:scale-105 transition-transform shadow-lg group-hover:rotate-3">
                  <img src={ADIDAS_LOGO} alt="Adidas" className="h-6 w-auto brightness-0 invert" />
                </div>
                <span className="font-black text-3xl italic tracking-tighter text-white drop-shadow-[2px_2px_0px_#1d248a] group-hover:scale-105 transition-transform">
                 <span className="text-[#f4b337]">ADIDAS VIBES</span>
               </span>
            </div>
            <div className="hidden md:flex space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-white border border-white/50 animate-bounce"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-white/50 border border-white/50 animate-bounce delay-100"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-white/30 border border-white/50 animate-bounce delay-200"></span>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-20 relative w-full">
        {view === 'home' && <LandingPage startQuiz={() => setView('quiz')} />}
        {view === 'quiz' && (
          <CustomerQuiz 
            user={user} 
            setView={setView} 
            setCurrentResult={setCurrentResult} 
            setGeneratedCode={setGeneratedCode} 
          />
        )}
        {view === 'result' && currentResult && (
          <CustomerResult result={currentResult} code={generatedCode} />
        )}
      </main>

      <footer className="fixed bottom-0 w-full py-4 text-center z-40 pointer-events-none">
        <div className="inline-block bg-black/30 backdrop-blur-md rounded-full px-6 py-2 pointer-events-auto border border-white/10 shadow-lg relative">
            <div className="flex justify-center items-center gap-4">
                <p className="text-[10px] font-bold text-white/80 uppercase tracking-widest">© 2026 Adidas</p>
            </div>
        </div>
      </footer>
    </>
  );
};

const StaffFlow = ({ user }) => {
    return (
        <main className="pt-24 pb-20 relative w-full">
            <StaffDashboard user={user} />
        </main>
    );
};

// --- MAIN APP COMPONENT ---
export default function AdidasVibesApp() {
  
  const [user, setUser] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
        await signInAnonymously(auth);
    };
    initAuth();
    
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) setUser(u);
    });
    return () => unsubscribe();
  }, []);

  return (
    <HashRouter>
      <div className="min-h-screen font-sans text-gray-900 overflow-x-hidden selection:bg-[#a3e635] selection:text-[#1d248a] relative bg-[#4338ca]">
        
        <div className="fixed inset-0 bg-gradient-to-br from-[#db2777] via-[#4338ca] to-[#a3e635] animate-gradient-xy"></div>
        <div className="fixed inset-0 pointer-events-none opacity-[0.1]"></div>

        <style>{`
          @keyframes float {
            0% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-12px) rotate(3deg); }
            100% { transform: translateY(0px) rotate(0deg); }
          }
          @keyframes gradient-xy {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
          }
          .animate-gradient-xy {
              background-size: 200% 200%;
              animation: gradient-xy 10s ease infinite;
          }
          .animate-fade-in {
            animation: fadeIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}</style>

        <Routes>
            <Route path="/" element={<ClientFlow user={user} />} />
            <Route path="/staff" element={<StaffFlow user={user} />} />
            <Route path="/insights" element={<InsightsDashboard />} />
        </Routes>

      </div>
    </HashRouter>
  );
}
