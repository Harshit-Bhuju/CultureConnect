import React from "react";
import Personal_Settings from "../Settings/Personal_Settings";

const DeliveryPersonalSettings = () => {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Personal Information</h1>
                <p className="text-slate-500 text-sm mt-1">Manage your delivery profile details</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <Personal_Settings />
            </div>
        </div>
    );
};

export default DeliveryPersonalSettings;
