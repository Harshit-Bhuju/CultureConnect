import React from "react";
import Password_Settings from "../Settings/Password_Settings";

const DeliveryPasswordSettings = () => {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Security Settings</h1>
                <p className="text-slate-500 text-sm mt-1">Manage your password and account security</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <Password_Settings />
            </div>
        </div>
    );
};

export default DeliveryPasswordSettings;
