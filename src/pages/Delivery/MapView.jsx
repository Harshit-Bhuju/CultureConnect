import React from "react";
import { MapPin, ExternalLink, Compass } from "lucide-react";

const MapView = () => {
  const destPos = "Kathmandu, Ward 4, Baluwatar";

  const openGoogleMaps = () => {
    const encodedAddress = encodeURIComponent(destPos);
    const url = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Navigation</h1>
          <p className="text-slate-500 text-sm mt-1">
            Get precise directions to the customer location
          </p>
        </div>
      </div>

      <div className="max-w-3xl">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden p-8 md:p-12 text-center space-y-8">
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-blue-600">
              <MapPin className="w-10 h-10 animate-bounce" />
            </div>
            <div className="absolute -top-2 -right-2 bg-red-500 w-4 h-4 rounded-full border-2 border-white animate-ping"></div>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-slate-900">
              External Navigation Required
            </h2>
            <p className="text-slate-500 max-w-sm mx-auto">
              For the most accurate real-time road directions and live traffic,
              please use Google Maps navigation.
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mt-4">
            <div className="flex items-center justify-center gap-3 text-slate-700">
              <Compass className="w-5 h-5 opacity-50" />
              <span className="font-bold text-lg">{destPos}</span>
            </div>
            <p className="text-xs text-slate-400 mt-2 uppercase tracking-widest font-bold">
              Standard Delivery Address
            </p>
          </div>

          <div className="pt-4">
            <button
              onClick={openGoogleMaps}
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-lg transition-all shadow-xl hover:shadow-blue-200 flex items-center justify-center gap-3 group active:scale-[0.98]">
              <ExternalLink className="w-6 h-6 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              Open in Google Maps
            </button>
            <p className="text-[10px] text-slate-400 mt-4 uppercase font-bold tracking-tighter italic">
              External navigation ensures the safest and fastest route logic
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
