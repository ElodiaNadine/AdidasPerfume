import { IMAGES } from './assets';

export const RESULTS = {
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

// Map result keys for quick lookup
export const RESULT_KEYS = {
  ED: "Energy Drive",
  SU: "Spark Up",
  FR: "Full Recharge",
  CZ: "Chill Zone",
  GC: "Get Comfy"
};
