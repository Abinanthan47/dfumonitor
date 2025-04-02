"use client"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    AirVentIcon,
    AlertTriangle,
    Bell,
    Calendar,
    Clock,
    DropletsIcon,
    FileText,
    Heart,
    Home,
    Menu,
    Thermometer,
    User,
    X
} from "lucide-react";
import Link from 'next/link';
import { useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const DiabeticFootMonitor = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("dashboard");
    const [timeFilter, setTimeFilter] = useState("24h");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`https://api.thingspeak.com/channels/2886060/feeds.json?results=2&api_key=I9JOAJSO97RV046Q`);
                const result = await response.json();
                const feeds = result.feeds;

                // Transform the fetched data into the format you need
                const formattedData = feeds.map(feed => ({
                    time: new Date(feed.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    temp1: parseFloat(feed.field1), // Assuming field1 is temperature 1
                    temp2: parseFloat(feed.field2), // Assuming field2 is temperature 2
                    pressure1: parseFloat(feed.field3), // Assuming field3 is pressure 1
                    pressure2: parseFloat(feed.field4), // Assuming field4 is pressure 2
                    heartRate: parseInt(feed.field5), // Assuming field5 is heart rate
                    spo2: parseInt(feed.field6), // Assuming field6 is SpO2
                }));

                setData(formattedData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data from ThingSpeak:", error);
                setLoading(false);
            }
        };

        fetchData();

        // Update data every 30 seconds
        const interval = setInterval(fetchData, 30000);

        return () => clearInterval(interval);
    }, []);

    const latest = data[data.length - 1] || {
        temp1: 30.5,
        temp2: 31.0,
        pressure1: 1500,
        pressure2: 1200,
        heartRate: 72,
        spo2: 98
    };

    const tempDiff = Math.abs(latest.temp1 - latest.temp2).toFixed(1);
    const alerts = [
        {
            type: "Temperature Difference",
            message: `Temp Diff > 2.0°C`,
            time: "10:23",
            critical: tempDiff > 2.0
        },
        {
            type: "Low Pressure",
            message: "Pressure < 1000 mmHg",
            time: "09:45",
            critical: latest.pressure2 < 1000
        }
    ].filter(alert => alert.critical);

    const getTemperatureStatus = (temp) => {
        if (temp < 29) return "text-blue-500";
        if (temp > 32) return "text-red-500";
        return "text-green-500";
    };

    const getPressureStatus = (pressure) => {
        if (pressure < 1000) return "text-red-500";
        if (pressure > 1800) return "text-red-500";
        return "text-green-500";
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-gray-600">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="text-blue-600" size={20} />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-gray-800">Dinesh S</h1>
                            <p className="text-xs text-gray-500">Patient ID: #23456</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button className="p-2 rounded-full hover:bg-gray-100">
                            <Bell size={20} className="text-gray-600" />
                        </button>
                        <button className="p-2 rounded-full hover:bg-gray-100">
                            <Menu size={20} className="text-gray-600" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-md mx-auto px-4 pb-6">
                <div className="flex items-center justify-between my-4">
                    <h2 className="text-xl font-bold text-gray-800">Diabetic Foot Monitor</h2>
                    <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                        Connected
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
                    <button
                        className={`flex-1 py-2 text-sm font-medium rounded-md ${activeTab === "dashboard" ? "bg-white shadow-sm" : "text-gray-500"}`}
                        onClick={() => setActiveTab("dashboard")}
                    >
                        Dashboard
                    </button>
                    <button
                        className={`flex-1 py-2 text-sm font-medium rounded-md ${activeTab === "history" ? "bg-white shadow-sm" : "text-gray-500"}`}
                        onClick={() => setActiveTab("history")}
                    >
                        History
                    </button>
                    <button
                        className={`flex-1 py-2 text-sm font-medium rounded-md ${activeTab === "settings" ? "bg-white shadow-sm" : "text-gray-500"}`}
                        onClick={() => setActiveTab("settings")}
                    >
                        Settings
                    </button>
                </div>

                {/* Real-Time Metrics */}
                <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-500 flex items-center">
                        <Clock size={16} className="mr-1" />
                        Real-Time Data
                    </h3>

                    <div className="grid grid-cols-2 gap-3">
                        <Card className="overflow-hidden">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                                    <Thermometer className="text-blue-500 mr-2" size={18} />
                                    Temperature
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs">Sensor 1</span>
                                        <span className={`text-base font-bold ${getTemperatureStatus(latest.temp1)}`}>
                                            {latest.temp1}°C
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs">Sensor 2</span>
                                        <span className={`text-base font-bold ${getTemperatureStatus(latest.temp2)}`}>
                                            {latest.temp2}°C
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center pt-1 border-t border-gray-100">
                                        <span className="text-xs">Difference</span>
                                        <span className={`text-base font-bold ${parseFloat(tempDiff) > 2.0 ? "text-red-500" : "text-green-500"}`}>
                                            {tempDiff}°C
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="overflow-hidden">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                                    <AirVentIcon className="text-green-500 mr-2" size={18} />
                                    Pressure
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs">Sensor 1</span>
                                        <span className={`text-base font-bold ${getPressureStatus(latest.pressure1)}`}>
                                            {latest.pressure1}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs">Sensor 2</span>
                                        <span className={`text-base font-bold ${getPressureStatus(latest.pressure2)}`}>
                                            {latest.pressure2}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center pt-1 border-t border-gray-100">
                                        <span className="text-xs">Unit</span>
                                        <span className="text-xs text-gray-500">mmHg</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="overflow-hidden">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                                    <Heart className="text-red-500 mr-2" size={18} />
                                    Heart Rate
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center">
                                    <span className="text-2xl font-bold">{latest.heartRate}</span>
                                    <span className="ml-1 text-sm text-gray-500">BPM</span>
                                </div>
                                <div className="mt-2">
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div
                                            className="bg-red-500 h-2 rounded-full"
                                            style={{ width: `${(latest.heartRate - 60) / 60 * 100}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                        <span>60</span>
                                        <span>120</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="overflow-hidden">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                                    <DropletsIcon className="text-purple-500 mr-2" size={18} />
                                    SpO2
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center">
                                    <span className="text-2xl font-bold">{latest.spo2}</span>
                                    <span className="ml-1 text-sm text-gray-500">%</span>
                                </div>
                                <div className="mt-2">
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div
                                            className="bg-purple-500 h-2 rounded-full"
                                            style={{ width: `${(latest.spo2 - 90) / 10 * 100}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                        <span>90</span>
                                        <span>100</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Historical Trends */}
                    <div className="mt-6">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-sm font-medium text-gray-500 flex items-center">
                                <Calendar size={16} className="mr-1" />
                                Historical Trends
                            </h3>
                            <div className="flex bg-gray-100 rounded-lg p-0.5 text-xs">
                                <button
                                    className={`px-2 py-1 rounded ${timeFilter === "1h" ? "bg-white shadow-sm" : "text-gray-600"}`}
                                    onClick={() => setTimeFilter("1h")}
                                >
                                    1H
                                </button>
                                <button
                                    className={`px-2 py-1 rounded ${timeFilter === "24h" ? "bg-white shadow-sm" : "text-gray-600"}`}
                                    onClick={() => setTimeFilter("24h")}
                                >
                                    24H
                                </button>
                                <button
                                    className={`px-2 py-1 rounded ${timeFilter === "7d" ? "bg-white shadow-sm" : "text-gray-600"}`}
                                    onClick={() => setTimeFilter("7d")}
                                >
                                    7D
                                </button>
                            </div>
                        </div>

                        <Card>
                            <CardContent className="p-4">
                                <div className="h-64 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={data}>
                                            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                                            <XAxis
                                                dataKey="time"
                                                className="text-xs"
                                                tick={{ fill: '#666' }}
                                            />
                                            <YAxis
                                                className="text-xs"
                                                tick={{ fill: '#666' }}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: '#fff',
                                                    border: '1px solid #e2e8f0',
                                                    borderRadius: '6px'
                                                }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="temp1"
                                                stroke="#3B82F6"
                                                strokeWidth={2}
                                                dot={false}
                                                name="Temp 1"
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="temp2"
                                                stroke="#60A5FA"
                                                strokeWidth={2}
                                                dot={false}
                                                name="Temp 2"
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Alerts */}
                    {alerts.length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-sm font-medium text-gray-500 flex items-center mb-2">
                                <AlertTriangle size={16} className="mr-1 text-amber-500" />
                                Active Alerts
                            </h3>

                            <Card className="border-amber-200 bg-amber-50">
                                <CardContent className="p-4">
                                    <div className="space-y-3">
                                        {alerts.map((alert, index) => (
                                            <div key={index} className="flex items-start justify-between">
                                                <div className="flex items-start">
                                                    <AlertTriangle className="text-amber-500 mr-2 mt-0.5" size={18} />
                                                    <div>
                                                        <p className="font-medium text-amber-800">{alert.type}</p>
                                                        <p className="text-sm text-amber-700">{alert.message}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="text-xs text-amber-700 mr-2">{alert.time}</span>
                                                    <button className="p-1 rounded-full hover:bg-amber-100">
                                                        <X size={16} className="text-amber-700" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {alerts.length > 1 && (
                                        <button className="w-full mt-3 py-2 text-sm font-medium text-amber-700 border border-amber-300 rounded-md hover:bg-amber-100">
                                            Dismiss All Alerts
                                        </button>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
                <div className="max-w-md mx-auto flex justify-around">
                    <Link href="/" className="p-3 flex flex-col items-center text-blue-600">
                        <Home size={20} />
                        <span className="text-xs mt-1">Home</span>
                    </Link>
                    <Link href="/chatbot" className="p-3 flex flex-col items-center text-gray-600">
                        <FileText size={20} />
                        <span className="text-xs mt-1">AI Chatbot</span>
                    </Link>
                    <Link href="/map" className="p-3 flex flex-col items-center text-gray-600">
                        <Thermometer size={20} />
                        <span className="text-xs mt-1">Sensors</span>
                    </Link>
                    <Link href="/profile" className="p-3 flex flex-col items-center text-gray-600">
                        <User size={20} />
                        <span className="text-xs mt-1">Profile</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default DiabeticFootMonitor;