import React, { useState, useEffect } from 'react';
import { Star, Zap, ArrowRight, Sparkles, Loader } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { APP_ID } from '../../constants/firebase';
import { IMAGES } from '../../constants/assets';

export const LandingPage = ({ startQuiz, eventId }) => {
    const [eventData, setEventData] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [fadeIn, setFadeIn] = useState(true);
    const productImages = Object.values(IMAGES); // Get all 5 product images

    useEffect(() => {
        if (eventId) {
            const fetchEvent = async () => {
                try {
                    const eventDoc = await getDoc(
                        doc(db, 'artifacts', APP_ID, 'public', 'data', 'events', eventId)
                    );
                    if (eventDoc.exists()) {
                        setEventData({ id: eventDoc.id, ...eventDoc.data() });
                    }
                } catch (error) {
                    console.error("Error fetching event:", error);
                }
            };
            fetchEvent();
        }
    }, [eventId]);

    // Shuffle product images with fade effect
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [productImages.length]);
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center relative z-10">



            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border-[3px] border-white/20 rounded-full animate-ping [animation-duration:3s]"></div>

            <div className="mb-8 relative group">
                <div className="absolute inset-0 bg-white rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-pulse"></div>

                <div className="relative w-60 h-60 md:w-48 md:h-48 bg-white rounded-full p-4 shadow-[0px_10px_0px_rgba(0,0,0,0.1)] border-[4px] border-white flex items-center justify-center overflow-hidden animate-float transform rotate-3 hover:rotate-0 transition-all duration-500">
                    <img
                        src={productImages[currentImageIndex]}
                        alt="Adidas Vibes"
                        className="max-w-[90%] max-h-[90%] object-contain origin-center animate-float-fade transform transition-all duration-300 group-hover:scale-110"
                        key={currentImageIndex}
                    />
                </div>

                <div className="absolute -top-2 -right-4 bg-[#f58362] text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-full rotate-12 shadow-[2px_2px_0px_#000] animate-bounce border-2 border-white">
                    New
                </div>
                <div className="absolute -bottom-2 -left-4 bg-[#f4b337] text-[#1d248a] text-[10px] font-black uppercase px-3 py-1.5 rounded-full -rotate-12 shadow-[2px_2px_0px_#000] border-2 border-white">
                    Vibes
                </div>
            </div>

            {eventId ?
                eventData ? (
                    <div className="mb-8 text-center">
                        <p className="text-xs font-bold text-[#f4b337] uppercase tracking-[0.4em] mb-2 drop-shadow-md">
                            ✨ EVENT SPECIAL ✨
                        </p>
                        <h2 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tight drop-shadow-[3px_3px_0px_#1d248a] mb-2">
                            {eventData.name}
                        </h2>
                        <p className="text-sm text-white/90 flex items-center justify-center gap-2">
                            📍 {eventData.location}
                        </p>
                    </div>
                ) :
                    <div className="flex flex-col items-center justify-center p-8">
                        <Loader className="w-12 h-12 text-white animate-spin mb-4" />
                    </div>
                : null}

            <div className="mb-8 flex justify-center">
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#f4b337]/30 to-[#f58362]/30 blur-xl rounded-full"></div>
                    <p className="relative text-xs font-black text-white uppercase tracking-[0.3em] px-6 py-2 border-b-2 border-t-2 border-[#f4b337] drop-shadow-md">
                        cerita minggu ini
                    </p>
                </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-white mb-2 tracking-tighter uppercase italic leading-tight drop-shadow-[4px_4px_0px_#1d248a]">
                Check <br />
                <span className="text-[#f4b337]">Your Vibes</span>
            </h1>

            <p className="text-white/90 text-sm md:text-base font-bold max-w-xl mx-auto mb-3 leading-relaxed drop-shadow-md">
                ☀️ Teman-teman mengajak kamu jalan hari ini...
            </p>

            <p className="text-white/70 text-xs md:text-sm max-w-lg mx-auto mb-10 leading-relaxed">
                Tapi kemana sih? Olahraga? Eksplorasi? Santai aja di rumah? Mari ikuti petualangan Sabtu spesialmu dan temukan personality vibe sejatimu! 🎯
            </p>

            <button
                onClick={startQuiz}
                className="group relative inline-flex items-center justify-center px-10 py-4 text-lg font-black text-[#1d248a] transition-all duration-200 bg-white rounded-full focus:outline-none hover:scale-105 shadow-[6px_6px_0px_#1d248a] hover:shadow-[8px_8px_0px_#f58362] hover:-translate-y-1 uppercase tracking-widest italic border-4 border-transparent active:shadow-none active:translate-y-1"
            >
                Mulai Petualangan
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform text-[#f58362]" />
            </button>

            <p className="text-[9px] text-white/50 mt-6 uppercase tracking-[0.2em] drop-shadow-sm">
                6 Pertanyaan • ~2 Menit ✨
            </p>
        </div>
    );
};
