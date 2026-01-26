import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { Activity, BatteryCharging, Zap, Coffee, Moon, ArrowRight, CheckCircle, XCircle, Search, ShoppingBag, Sparkles, RefreshCw, Star, Heart, Lock, AlertTriangle } from 'lucide-react';
import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom';
/* --- FIREBASE CONFIGURATION --- */
const firebaseConfig = {
  apiKey: "AIzaSyABxeQn_OO9mzYS-yykdZ0lDUyy4Glotws",
  authDomain: "addsparfume.firebaseapp.com",
  projectId: "addsparfume",
  storageBucket: "addsparfume.firebasestorage.app",
  messagingSenderId: "577922238942",
  appId: "1:577922238942:web:d7b3e5b60ac018e9ccb54f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = 'adidas-vibes-test';


// --- DATA & ASSETS ---
const ADIDAS_LOGO = "https://static.vecteezy.com/system/resources/thumbnails/019/766/237/small/adidas-logo-adidas-icon-transparent-free-png.png";

const IMAGES = {
  ED: "https://static-id.zacdn.com/p/adidas-body-care-6389-0245684-1.jpg", // Energy Drive
  SU: "https://static-id.zacdn.com/p/adidas-body-care-0177-1245684-1.jpg", // Spark Up
  FR: "https://static-id.zacdn.com/p/adidas-body-care-6359-3245684-1.jpg", // Full Recharge
  CZ: "https://static-id.zacdn.com/p/adidas-body-care-6375-9145684-1.jpg", // Chill Zone
  GC: "https://static-id.zacdn.com/p/adidas-body-care-0782-7042874-1.jpg"  // Get Comfy
};

const QUESTIONS = [
  {
    id: 1,
    text: "WHICH ONE DESCRIBES YOUR PERSONALITY THE MOST?",
    options: [
      { label: "A. Always full of energy", value: "A" },
      { label: "B. Confident and ambitious", value: "B" },
      { label: "C. Adventurous and loves trying something new", value: "C" },
      { label: "D. Calm and stress-free", value: "D" },
      { label: "E. Warm and friendly", value: "E" }
    ]
  },
  {
    id: 2,
    text: "PICK YOUR PERFECT WEEKEND ACTIVITY",
    options: [
      { label: "A. Night out with friends, working out", value: "A" },
      { label: "B. Finishing a project, hitting the gym, cleaning", value: "B" },
      { label: "C. Exploring nature, exercising", value: "C" },
      { label: "D. Gaming, self-care at home", value: "D" },
      { label: "E. Movie night, dinner, listening to music", value: "E" }
    ]
  },
  {
    id: 3,
    text: "WHICH SCENT DO YOU PREFER THE MOST?",
    // This question will have HIGHER WEIGHT (Bobot)
    options: [
      { label: "A. Vibrant spice with fresh scent", value: "A" },
      { label: "B. Fresh citrusy scent", value: "B" },
      { label: "C. Earthy, green, nature scent", value: "C" },
      { label: "D. Aromatic lavender & notes of vanilla scent", value: "D" },
      { label: "E. Comforting vanilla & juicy mandarin scent", value: "E" }
    ]
  },
  {
    id: 4,
    text: "IN A FRIEND GROUP, YOU ARE...",
    options: [
      { label: "A. The energetic & group mood-maker", value: "A" },
      { label: "B. The confident & reliable one", value: "B" },
      { label: "C. The one that always invites to explore new places", value: "C" },
      { label: "D. The chill & introverted", value: "D" },
      { label: "E. The most friendly & group mediator", value: "E" }
    ]
  },
  {
    id: 5,
    text: "WHAT’S YOUR GO-TO OUTFIT STYLE?",
    options: [
      { label: "A. Bright colors, fun patterns, playful style", value: "A" },
      { label: "B. Monochrome, cool style", value: "B" },
      { label: "C. Casual outfit with lots of unique accessories", value: "C" },
      { label: "D. Relaxed t-shirt and jeans", value: "D" },
      { label: "E. Cozy hoodies", value: "E" }
    ]
  }
];

const RESULTS = {
  "Energy Drive": {
    code: "ED",
    title: "ENERGY DRIVE",
    vibe: "UNSTOPPABLE ENERGY ⚡",
    desc: "You are dynamic and always on the move. You need a scent that keeps up with your high-intensity lifestyle.",
    scent: "Cardamom & Pink Pepper",
    bestFor: "Night outs, dancing, or HIIT workouts.",
    color: "bg-blue-600",
    shadow: "shadow-blue-500/50",
    text: "text-blue-600",
    gradient: "from-blue-500 via-indigo-500 to-purple-500",
    img: IMAGES.ED
  },
  "Spark Up": {
    code: "SU",
    title: "SPARK UP",
    vibe: "CONFIDENT & KICK-ASS 🔥",
    desc: "You are focused on getting things done. You need a fragrance that boosts your confidence and helps you finish projects in style.",
    scent: "Sweet Orange & Black Pepper",
    bestFor: "Dressing up, hitting the gym, or crossing off your to-do list.",
    color: "bg-orange-500",
    shadow: "shadow-orange-500/50",
    text: "text-orange-600",
    gradient: "from-orange-400 via-red-500 to-pink-500",
    img: IMAGES.SU
  },
  "Full Recharge": {
    code: "FR",
    title: "FULL RECHARGE",
    vibe: "THE ESCAPIST 🌿",
    desc: "You crave fresh air and new experiences. You need a scent that grounds you and connects you to nature.",
    scent: "Cedar Leaf & Clary Sage",
    bestFor: "Hiking, camping, or walking in nature.",
    color: "bg-teal-600",
    shadow: "shadow-teal-500/50",
    text: "text-teal-700",
    gradient: "from-teal-400 via-green-500 to-emerald-600",
    img: IMAGES.FR
  },
  "Chill Zone": {
    code: "CZ",
    title: "CHILL ZONE",
    vibe: "PEACEFUL & RELAXED 🧘",
    desc: "You value your peace of mind above all else. You need a scent that helps you effortlessly ignore external pressures.",
    scent: "Lavender & Vanilla",
    bestFor: "Self-care rituals, gaming, or crafting.",
    color: "bg-purple-500",
    shadow: "shadow-purple-500/50",
    text: "text-purple-600",
    gradient: "from-purple-400 via-indigo-400 to-blue-400",
    img: IMAGES.CZ
  },
  "Get Comfy": {
    code: "GC",
    title: "GET COMFY",
    vibe: "WARM & COZY 🧸",
    desc: "You love that warm, 'at-home' feeling. You need a scent that wraps you in comfort.",
    scent: "Vanilla & Mandarin",
    bestFor: "Movie nights, spa days, or cozy dinner parties.",
    color: "bg-yellow-500",
    shadow: "shadow-yellow-500/50",
    text: "text-yellow-600",
    gradient: "from-yellow-400 via-orange-300 to-amber-400",
    img: IMAGES.GC
  }
};

// --- COMPONENT: CUSTOMER QUIZ ---
const CustomerQuiz = ({ user, setView, setCurrentResult, setGeneratedCode }) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleAnswer = (value) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = async (finalAnswers) => {
    setIsCalculating(true);
    let scores = { ED: 0, SU: 0, FR: 0, CZ: 0, GC: 0 };

    finalAnswers.forEach((ans, index) => {
    const points = (index === 2) ? 2 : 1; 

    if (ans === "A") scores.ED += points;
    else if (ans === "B") scores.SU += points;
    else if (ans === "C") scores.FR += points;
    else if (ans === "D") scores.CZ += points;
    else if (ans === "E") scores.GC += points;
    });

    let maxScore = Math.max(scores.ED, scores.SU, scores.FR, scores.CZ, scores.GC);
    let resultKey = "";

    if (scores.ED === maxScore) resultKey = "Energy Drive";
    else if (scores.SU === maxScore) resultKey = "Spark Up";
    else if (scores.FR === maxScore) resultKey = "Full Recharge";
    else if (scores.CZ === maxScore) resultKey = "Chill Zone";
    else if (scores.GC === maxScore) resultKey = "Get Comfy";

    const isTie = Object.values(scores).filter(s => s === maxScore).length > 1;
    if (isTie) {
      const q1 = finalAnswers[0];
      if (q1 === "A") resultKey = "Energy Drive";
      else if (q1 === "B") resultKey = "Spark Up";
      else if (q1 === "C") resultKey = "Full Recharge";
      else if (q1 === "D") resultKey = "Chill Zone";
      else if (q1 === "E") resultKey = "Get Comfy";
    }

    const resultData = RESULTS[resultKey];
    setCurrentResult(resultData);

    const uniqueCode = `VIBE-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    setGeneratedCode(uniqueCode);

    if (user) {
      try {
        await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'vibe_codes', uniqueCode), {
          code: uniqueCode,
          result: resultKey,
          redeemed: false,
          createdAt: serverTimestamp(),
          uid: user.uid
        });
      } catch (e) {
        console.error("Error saving code:", e);
      }
    }

    // Artificial delay for effect
    setTimeout(() => {
        setIsCalculating(false);
        setView('result');
    }, 2000);
  };

  if (isCalculating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 relative z-10">
        <div className="relative mb-8">
            <div className="absolute inset-0 bg-white rounded-full blur-xl opacity-50 animate-pulse"></div>
            <Activity className="relative w-24 h-24 text-white animate-spin drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)]" />
        </div>
        <h2 className="text-4xl md:text-5xl font-black italic text-white tracking-tighter uppercase animate-bounce drop-shadow-[4px_4px_0px_#f58362]">
          Analyzing Vibe...
        </h2>
      </div>
    );
  }

  const progress = ((currentQ + 1) / QUESTIONS.length) * 100;

  return (
    <div className="max-w-lg mx-auto px-4 py-8 relative z-10">
      {/* Pop Art Progress Bar */}
      <div className="w-full bg-black/20 backdrop-blur-md rounded-full h-4 mb-8 border-2 border-white overflow-hidden shadow-[4px_4px_0px_rgba(0,0,0,0.2)]">
        <div 
            className="bg-[#f4b337] h-full transition-all duration-500" 
            style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-[10px_10px_0px_rgba(0,0,0,0.2)] border-4 border-white p-6 transform transition-all animate-fade-in relative overflow-hidden">
        {/* Decorative Pop Elements */}
        <div className="absolute -top-5 -right-5 w-20 h-20 bg-[#f58362] rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-10 -left-5 w-10 h-10 bg-[#1d248a] rotate-45 opacity-10"></div>

        <div className="flex justify-between items-center mb-6 relative z-10">
            <span className="bg-[#1d248a] text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-full tracking-widest shadow-[3px_3px_0px_#f58362] border border-white/20">
                Step {currentQ + 1} / 5
            </span>
            <div className="bg-[#f4b337] p-1.5 rounded-full shadow-[2px_2px_0px_#000000]">
                <Sparkles className="text-white w-5 h-5 animate-pulse" />
            </div>
        </div>
        
        <h2 className="text-2xl md:text-3xl font-black text-[#1d248a] mb-8 leading-none uppercase italic tracking-tight relative z-10 drop-shadow-sm">
          {QUESTIONS[currentQ].text}
        </h2>

        <div className="space-y-4 relative z-10">
          {QUESTIONS[currentQ].options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(option.value)}
              className="w-full text-left p-4 rounded-xl border-2 border-transparent bg-white shadow-[4px_4px_0px_rgba(0,0,0,0.1)] hover:shadow-[6px_6px_0px_#f58362] hover:border-[#f58362] hover:-translate-y-1 transition-all duration-200 group flex items-center active:scale-95 active:shadow-none active:translate-y-0"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#1d248a] text-white font-black text-sm flex items-center justify-center mr-4 group-hover:bg-[#f58362] transition-colors duration-200 shadow-inner border-2 border-white">
                {option.value}
              </div>
              <span className="text-gray-800 font-bold text-sm md:text-base leading-tight uppercase tracking-tight">{option.label.substring(3)}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- COMPONENT: CUSTOMER RESULT ---
const CustomerResult = ({ result, code }) => {
  return (
    <div className="max-w-sm md:max-w-md mx-auto px-4 py-8 animate-fade-in relative z-10">
      
      {/* Floating Header Text */}
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
        
        {/* Product Image Section - Smaller & Compact */}
        <div className={`relative pt-8 pb-4 px-8 flex justify-center bg-gradient-to-b from-gray-50 to-white`}>
           <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-gray-100/50 to-transparent"></div>
           
           {/* Blob behind image */}
           <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 ${result.color} rounded-full filter blur-3xl opacity-30`}></div>
           
           {/* The Image Container */}
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

// --- COMPONENT: STAFF DASHBOARD ---
const StaffDashboard = ({ user, setView }) => {
  const [inputCode, setInputCode] = useState("");
  const [lookupResult, setLookupResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const checkCode = async () => {
    if (!inputCode) return;
    setLoading(true);
    setError("");
    setLookupResult(null);

    try {
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'vibe_codes', inputCode.trim().toUpperCase());
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const resultDetails = RESULTS[data.result];
        
        // --- VOUCHER LOGIC UPGRADE ---
        if (data.redeemed) {
           setError("⚠️ THIS CODE HAS ALREADY BEEN REDEEMED!"); 
        }

        setLookupResult({ ...data, details: resultDetails });
      } else {
        setError("Invalid Code. Please check spelling.");
      }
    } catch (err) {
      console.error(err);
      setError("System error.");
    } finally {
      setLoading(false);
    }
  };

  const redeemCode = async () => {
    if (!lookupResult) return;
    setLoading(true);
    try {
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'vibe_codes', lookupResult.code);
      await updateDoc(docRef, {
        redeemed: true,
        redeemedAt: serverTimestamp(),
        redeemedBy: user.uid
      });
      setLookupResult(prev => ({ ...prev, redeemed: true }));
    } catch (err) {
      setError("Failed to redeem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 relative z-10">
      <button 
        onClick={() => setView('home')} 
        className="text-xs font-black uppercase tracking-widest text-white mb-8 hover:text-white/80 transition-colors flex items-center gap-2 bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm w-fit border border-white/20"
      >
        <ArrowRight className="w-4 h-4 rotate-180" /> Back to Home
      </button>
      
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-[10px_10px_0px_rgba(0,0,0,0.2)] overflow-hidden border-4 border-white">
        <div className="bg-[#1d248a] p-8 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-[#f58362] rounded-full blur-3xl opacity-50 -mr-10 -mt-10 animate-pulse"></div>
           <div className="relative z-10">
                <h2 className="text-white text-3xl font-black italic tracking-tighter uppercase mb-1 drop-shadow-md">
                    Staff Portal
                </h2>
                <p className="text-blue-200 text-xs font-mono uppercase tracking-widest">Vibe Check System v2.0</p>
           </div>
        </div>

        <div className="p-6">
          <div className="mb-8">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 pl-1">Input Code</label>
            {/* --- FIXED MOBILE LAYOUT --- */}
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="text" 
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                placeholder="VIBE-XXXX"
                className="w-full h-14 px-4 border-2 border-gray-200 rounded-xl font-mono text-xl uppercase font-bold text-[#1d248a] focus:border-[#1d248a] focus:shadow-[4px_4px_0px_#1d248a] focus:outline-none transition-all placeholder-gray-300"
              />
              <button 
                onClick={checkCode}
                disabled={loading}
                className="h-14 bg-[#1d248a] text-white rounded-xl hover:bg-blue-800 transition-colors disabled:opacity-50 shadow-[4px_4px_0px_#000] active:translate-y-1 active:shadow-none border-2 border-transparent flex justify-center items-center gap-2 sm:w-auto sm:px-6"
              >
                {loading ? <Activity className="w-6 h-6 animate-spin" /> : <Search className="w-6 h-6" />}
                {/* Visible Label for Mobile Styling */}
                <span className="font-black uppercase tracking-widest text-sm">Search</span>
              </button>
            </div>
            
            {/* POP UP ERROR AREA */}
            {error && (
                <div className={`mt-4 p-4 rounded-lg flex items-center gap-3 border-2 shadow-md ${error.includes("ALREADY") ? "bg-red-500 text-white border-red-700 animate-pulse" : "bg-red-50 text-red-500 border-red-100"}`}>
                    <AlertTriangle className="w-6 h-6" /> 
                    <span className="font-bold text-xs uppercase tracking-wide">{error}</span>
                </div>
            )}
          </div>

          {lookupResult && (
            <div className={`bg-gray-50 rounded-2xl p-5 border-2 ${lookupResult.redeemed ? "border-red-200 opacity-75" : "border-green-200"} animate-fade-in`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-black text-xl italic text-gray-900 uppercase tracking-tight">{lookupResult.details.title}</h3>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wide mt-1">Status</p>
                </div>
                {lookupResult.redeemed ? (
                  <span className="bg-red-100 text-red-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-sm border-2 border-red-200">
                    REDEEMED
                  </span>
                ) : (
                  <span className="bg-green-100 text-green-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm border-2 border-green-200">
                    VALID
                  </span>
                )}
              </div>

              <div className="flex gap-4 mb-6 bg-white p-4 rounded-xl border-2 border-gray-100 shadow-[4px_4px_0px_rgba(0,0,0,0.05)] items-center">
                <div className="w-16 h-16 rounded-lg bg-gray-50 flex-shrink-0 p-1 border border-gray-100">
                     <img src={lookupResult.details.img} className="w-full h-full object-contain mix-blend-multiply" alt="product" />
                </div>
                <div className="text-sm">
                  <p className="font-bold text-[#1d248a] leading-tight text-lg">{lookupResult.details.scent}</p>
                  <p className="text-gray-400 text-xs mt-1 font-mono">ID: {lookupResult.code}</p>
                </div>
              </div>

              {!lookupResult.redeemed ? (
                <button 
                  onClick={redeemCode}
                  disabled={loading}
                  className="w-full bg-[#f58362] text-white font-black uppercase tracking-widest py-4 rounded-xl hover:bg-[#e06d4d] transition-all shadow-[4px_4px_0px_#000] active:shadow-none active:translate-y-[4px] border-2 border-transparent"
                >
                  Confirm & Give Item
                </button>
              ) : (
                 <div className="w-full bg-gray-200 text-gray-400 font-bold uppercase tracking-widest py-4 rounded-xl text-center cursor-not-allowed text-xs flex items-center justify-center gap-2 border-2 border-gray-300">
                   <CheckCircle className="w-4 h-4" /> Code Used
                 </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- COMPONENT: LANDING PAGE ---
const LandingPage = ({ startQuiz }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center relative z-10">
      
      {/* Aesthetic Pop Decorative Elements */}
      <div className="absolute top-1/4 left-6 md:left-20 animate-bounce delay-100">
          <Star className="w-10 h-10 text-[#f4b337] fill-[#f4b337] drop-shadow-md transform -rotate-12" />
      </div>
      <div className="absolute bottom-1/3 right-6 md:right-20 animate-pulse">
          <Zap className="w-12 h-12 text-[#f58362] fill-[#f58362] drop-shadow-md transform rotate-12" />
      </div>
      <div className="absolute top-1/3 right-10 w-0 h-0 border-l-[10px] border-l-transparent border-t-[20px] border-t-white border-r-[10px] border-r-transparent rotate-45 opacity-60"></div>
      
      {/* Circle Outline Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border-[3px] border-white/20 rounded-full animate-ping [animation-duration:3s]"></div>


      <div className="mb-8 relative group">
  <div className="absolute inset-0 bg-white rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-pulse"></div>

  {/* circle */}
  <div className="relative w-40 h-40 md:w-48 md:h-48 bg-white rounded-full 
                  p-4 shadow-[0px_10px_0px_rgba(0,0,0,0.1)] 
                  border-[4px] border-white 
                  flex items-center justify-center 
                  overflow-hidden
                  animate-float transform rotate-3 hover:rotate-0 transition-all duration-500">

    <img
      src="https://static-id.zacdn.com/p/adidas-body-care-6389-0245684-1.jpg"
      alt="Adidas Vibes"
      className="max-w-[75%] max-h-[75%] object-contain 
                 origin-center transform 
                 transition-transform duration-500 
                 group-hover:scale-110"
      style={{ animation: 'float 5s ease-in-out infinite' }}
    />
  </div>
        
        {/* Floating Badges - Pop Style */}
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
            {/* Underline Squiggle */}
            <svg className="absolute w-full h-4 -bottom-2 left-0 text-white" viewBox="0 0 100 10" preserveAspectRatio="none">
                 <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
            </svg>
        </span>
      </h1>
      
      <p className="text-base md:text-lg font-bold text-white max-w-sm mb-12 leading-relaxed uppercase tracking-tight drop-shadow-md">
        Discover which scent from the new Adidas Vibes collection matches your energy.
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

// --- ROUTER FLOW COMPONENTS (PASTE THIS ABOVE THE MAIN APP) ---

const ClientFlow = ({ user }) => {
  const [view, setView] = useState('home'); 
  const [currentResult, setCurrentResult] = useState(null);
  const [generatedCode, setGeneratedCode] = useState("");
  const navigate = useNavigate();

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
                 <span className="text-[#f4b337]">VIBES</span>
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
    const navigate = useNavigate();
    return (
        <main className="pt-24 pb-20 relative w-full">
            <StaffDashboard user={user} setView={(dest) => dest === 'home' && navigate('/')} />
        </main>
    );
};

// --- MAIN APP COMPONENT ---//
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
      <div className="min-h-screen font-sans text-gray-900 overflow-x-hidden selection:bg-[#f58362] selection:text-white relative bg-[#4834d4]">
        
        <div className="fixed inset-0 bg-gradient-to-br from-[#1d248a] via-[#4834d4] to-[#f58362] animate-gradient-xy"></div>
        <div className="fixed inset-0 pointer-events-none opacity-[0.1]" style={{ 
            backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
        }}></div>

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
        </Routes>

      </div>
    </HashRouter>
  );
}