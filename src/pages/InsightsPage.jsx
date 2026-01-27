import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Activity, Download, Filter, ArrowLeft, Loader, Users, Ticket, MapPin } from 'lucide-react';
import { db } from '../config/firebase';
import { APP_ID } from '../constants/firebase';
import { CustomTooltip, StatCard, PollCard } from '../components/InsightsCharts';
import { downloadCSV } from '../utils/export';
import { CHART_COLORS } from '../constants/assets';

export const InsightsDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [allData, setAllData] = useState([]);
  const [selectedCity, setSelectedCity] = useState("All");

  // Fetch data once
  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, 'artifacts', APP_ID, 'public', 'data', 'vibe_codes')
        );
        const rawDocs = [];
        
        querySnapshot.forEach((doc) => {
          rawDocs.push({ id: doc.id, ...doc.data() });
        });

        setAllData(rawDocs);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Calculate stats based on selected city
  const { stats, cities } = useMemo(() => {
    const filteredData = selectedCity === "All" 
      ? allData 
      : allData.filter(d => (d.userLocation?.city || "Unknown") === selectedCity);

    let total = 0;
    let redeemed = 0;
    let vibeCounts = {};
    let locationCounts = {};
    let qCounts = {
      q1: { A: 0, B: 0, C: 0, D: 0, E: 0 },
      q2: { A: 0, B: 0, C: 0, D: 0, E: 0 },
      q3: { A: 0, B: 0, C: 0, D: 0, E: 0 },
      q4: { A: 0, B: 0, C: 0, D: 0, E: 0 },
      q5: { A: 0, B: 0, C: 0, D: 0, E: 0 },
    };

    const uniqueCities = new Set();

    // Process filtered data for stats
    filteredData.forEach(data => {
      total++;
      if (data.redeemed) redeemed++;

      const v = data.result || "Unknown";
      vibeCounts[v] = (vibeCounts[v] || 0) + 1;

      if (data.answers) {
        Object.keys(data.answers).forEach(key => {
          const answerVal = data.answers[key];
          if (qCounts[key] && qCounts[key][answerVal] !== undefined) {
            qCounts[key][answerVal]++;
          }
        });
      }
    });

    // Get all cities for dropdown
    allData.forEach(data => {
      const c = data.userLocation?.city || "Unknown";
      uniqueCities.add(c);
      locationCounts[c] = (locationCounts[c] || 0) + 1;
    });

    const vibeData = Object.keys(vibeCounts).map(key => ({
      name: key,
      value: vibeCounts[key]
    }));

    const locationData = Object.keys(locationCounts)
      .map(key => ({ name: key, users: locationCounts[key] }))
      .sort((a, b) => b.users - a.users)
      .slice(0, 10);

    return {
      stats: { total, redeemed, vibes: vibeData, locations: locationData, questions: qCounts },
      cities: Array.from(uniqueCities).sort()
    };
  }, [allData, selectedCity]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1d248a] flex flex-col items-center justify-center">
        <Loader className="w-12 h-12 text-white animate-spin mb-4" />
        <p className="text-white font-black uppercase tracking-widest animate-pulse">Loading Data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-sans selection:bg-[#a3e635] selection:text-[#1d248a]">
      
      {/* Header */}
      <div className="bg-[#4338ca] pt-12 pb-24 px-6 relative overflow-hidden rounded-b-[4rem] shadow-xl border-b-8 border-[#a3e635]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#db2777] rounded-full blur-[100px] opacity-30 -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#a3e635] rounded-full blur-[80px] opacity-20 -ml-10 -mb-10"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
            <button 
              onClick={() => navigate('/')} 
              className="group bg-white/10 hover:bg-white text-white hover:text-[#4338ca] px-5 py-2 rounded-full font-bold uppercase tracking-widest text-xs flex items-center gap-2 transition-all border border-white/20"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
            </button>
            
            <div className="flex gap-3">
              <button 
                onClick={() => downloadCSV(allData)}
                className="bg-[#a3e635] hover:bg-[#8cc63f] text-[#1d248a] px-5 py-2 rounded-full font-bold uppercase tracking-widest text-xs flex items-center gap-2 transition-all shadow-lg hover:shadow-xl active:translate-y-1"
              >
                <Download className="w-4 h-4" /> Export CSV
              </button>
              <div className="px-4 py-2 bg-white/20 text-white text-[10px] font-black uppercase tracking-widest rounded-full backdrop-blur-md border border-white/30">
                {allData.length} Records
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter mb-4 drop-shadow-[4px_4px_0px_#1d248a]">
            Vibe Check <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a3e635] to-[#db2777]">Insights</span>
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20 space-y-12">
        
        {/* Filter Control */}
        <div className="bg-white p-4 rounded-2xl shadow-lg border-2 border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[#1d248a]">
            <Filter className="w-5 h-5" />
            <span className="font-black uppercase tracking-wide text-sm">Filter Dashboard:</span>
          </div>
          
          <select 
            value={selectedCity} 
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full md:w-64 bg-gray-50 border-2 border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-[#4338ca] focus:border-[#4338ca] block p-2.5 font-bold uppercase tracking-wide outline-none"
          >
            <option value="All">All Locations</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {/* Big Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            label={selectedCity === "All" ? "Total Vibes Checked" : `Vibes in ${selectedCity}`}
            value={stats.total}
            icon={<Users className="w-8 h-8 text-[#4338ca]" />}
            color="bg-white"
            accent="border-[#4338ca]"
          />
          <StatCard 
            label="Vouchers Redeemed"
            value={stats.redeemed}
            sub={`${stats.total > 0 ? ((stats.redeemed/stats.total)*100).toFixed(1) : 0}% Rate`}
            icon={<Ticket className="w-8 h-8 text-white" />}
            color="bg-[#db2777]"
            textColor="text-white"
            accent="border-[#be185d]"
          />
          <StatCard 
            label="Top City (Overall)"
            value={stats.locations[0]?.name || "N/A"}
            icon={<MapPin className="w-8 h-8 text-[#4338ca]" />}
            color="bg-[#a3e635]"
            accent="border-[#65a30d]"
          />
        </div>

        {/* Main Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Vibe Distribution */}
          <div className="bg-white p-6 md:p-8 rounded-[2rem] border-4 border-[#4338ca] shadow-[8px_8px_0px_#4338ca] relative group hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_#4338ca] transition-all">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-[#4338ca] p-2 rounded-lg text-white"><Activity className="w-5 h-5" /></div>
              <h3 className="text-xl font-black text-[#4338ca] uppercase italic tracking-tighter">Personality Breakdown</h3>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.vibes}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    tick={{fontSize: 10, fontWeight: 900, fill: '#4338ca'}} 
                    interval={0} 
                    axisLine={false} 
                    tickLine={false} 
                    dy={10}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(67, 56, 202, 0.05)'}} />
                  <Bar dataKey="value" radius={[8, 8, 8, 8]} barSize={40}>
                    {stats.vibes.map((entry, index) => (
                      <Bar key={`bar-${index}`} dataKey="value" fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Location Map */}
          <div className="bg-white p-6 md:p-8 rounded-[2rem] border-4 border-[#4338ca] shadow-[8px_8px_0px_#db2777] relative group hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_#db2777] transition-all">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-[#db2777] p-2 rounded-lg text-white"><MapPin className="w-5 h-5" /></div>
              <h3 className="text-xl font-black text-[#4338ca] uppercase italic tracking-tighter">Top Locations</h3>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={stats.locations}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={100} 
                    tick={{fontSize: 11, fontWeight: 800, fill: '#6b7280'}} 
                    axisLine={false} 
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} />
                  <Bar dataKey="users" fill="#db2777" radius={[0, 10, 10, 0]} barSize={24}>
                    {stats.locations.map((entry, index) => (
                      <Bar key={`bar-loc-${index}`} dataKey="users" fill={index === 0 ? '#4338ca' : '#db2777'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Question Deep Dive */}
        <div>
          <div className="flex items-center gap-4 mb-8">
            <div className="h-1 flex-1 bg-gray-200 rounded-full"></div>
            <h2 className="text-2xl font-black text-[#4338ca] uppercase italic tracking-tighter bg-gray-50 px-4">
              The Deep Dive {selectedCity !== "All" && <span className="text-[#db2777]">({selectedCity})</span>}
            </h2>
            <div className="h-1 flex-1 bg-gray-200 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.keys(stats.questions).map((qKey, idx) => (
              <PollCard 
                key={qKey} 
                qId={qKey} 
                index={idx}
                data={stats.questions[qKey]} 
              />
            ))}
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center pt-12 pb-8 opacity-50">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Adidas Vibes • Internal Data</p>
        </div>
      </div>
    </div>
  );
};
