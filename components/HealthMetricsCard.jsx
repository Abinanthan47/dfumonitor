// components/ui/health-metrics-card.jsx
"use client";

import { Activity, Droplets, HeartPulse, Thermometer } from "lucide-react";
import { useEffect, useState } from "react";

const API_URL = "https://api.thingspeak.com/channels/2886060/feeds.json";

const ICONS = {
    heartRate: <HeartPulse className="w-6 h-6 text-red-500" />,
    spo2: <Droplets className="w-6 h-6 text-blue-500" />,
    temperature: <Thermometer className="w-6 h-6 text-orange-500" />,
    activity: <Activity className="w-6 h-6 text-green-500" />,
};

export default function HealthMetricsCard() {
    const [metrics, setMetrics] = useState({
        heartRate: "Loading...",
        spo2: "Loading...",
        temperature: "Loading...",
        activity: "Loading...",
    });

    const fetchMetrics = async () => {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            if (data.feeds.length > 0) {
                const latest = data.feeds[0];
                setMetrics({
                    heartRate: latest.field1,
                    spo2: latest.field2,
                    temperature: latest.field3,
                    activity: latest.field4,
                });
            }
        } catch (error) {
            console.error("Error fetching health metrics:", error);
        }
    };

    useEffect(() => {
        fetchMetrics();
        const interval = setInterval(fetchMetrics, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg border dark:bg-gray-900">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Real-Time Health Metrics</h2>
            <div className="grid grid-cols-2 gap-4">
                {Object.entries(metrics).map(([key, value]) => (
                    <div key={key} className="flex items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        {ICONS[key]}
                        <div className="ml-4">
                            <p className="text-sm text-gray-600 dark:text-gray-300">{key.replace(/([A-Z])/g, " $1")}</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">{value}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
