"use client"
import { useEffect, useState } from 'react';

const FootSensorDiagram = () => {
    const [activeSensors, setActiveSensors] = useState({
        max30102: true,
        thermistor: false,
        metHead: true,
        midfoot: false,
        fsr1: true,
        heel: true
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveSensors(prev => ({
                max30102: Math.random() > 0.3,
                thermistor: Math.random() > 0.7,
                metHead: Math.random() > 0.4,
                midfoot: Math.random() > 0.6,
                fsr1: Math.random() > 0.2,
                heel: Math.random() > 0.3
            }));
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const SensorPoint = ({ cx, cy, color, active, label, labelX, labelY, labelPosition = "right" }) => {
        const textAnchor = labelPosition === "right" ? "start" : "end";
        const xOffset = labelPosition === "right" ? 10 : -10;

        return (
            <g>
                {/* Simple sensor point */}
                <circle
                    cx={cx}
                    cy={cy}
                    r={8}
                    fill={active ? color : "#E2E8F0"}
                    stroke={color}
                    strokeWidth="2"
                    className="transition-colors duration-300"
                />

                {/* Label line and text */}
                {label && (
                    <g>
                        <line
                            x1={cx}
                            y1={cy}
                            x2={labelX}
                            y2={labelY}
                            stroke="#CBD5E1"
                            strokeWidth="1"
                        />
                        <text
                            x={labelX + xOffset}
                            y={labelY}
                            fill="#475569"
                            fontSize="12"
                            textAnchor={textAnchor}
                            dominantBaseline="middle"
                            className="font-medium"
                        >
                            {label}
                        </text>
                    </g>
                )}
            </g>
        );
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
            <div className="bg-white rounded-xl shadow-md p-6 max-w-3xl w-full">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
                    Foot Sensor Monitor
                </h2>

                <div className="relative w-full max-w-2xl mx-auto">
                    <svg viewBox="0 0 400 600" className="w-full">
                        {/* Base foot SVG */}
                        <image href="/foot.svg" x="50" y="50" width="300" height="500" />

                        {/* Sensor points */}
                        <SensorPoint
                            cx={240}
                            cy={110}
                            color="#EF4444"
                            active={activeSensors.max30102}
                            label="SpO₂, HR"
                            labelX={300}
                            labelY={110}
                        />
                        <SensorPoint
                            cx={240}
                            cy={160}
                            color="#3B82F6"
                            active={activeSensors.thermistor}
                            label="Temperature"
                            labelX={300}
                            labelY={160}
                        />
                        <SensorPoint
                            cx={200}
                            cy={280}
                            color="#10B981"
                            active={activeSensors.metHead}
                            label="Metatarsal"
                            labelX={280}
                            labelY={290}
                        />
                        <SensorPoint
                            cx={200}
                            cy={350}
                            color="#F59E0B"
                            active={activeSensors.midfoot}
                            label="Midfoot"
                            labelX={100}
                            labelY={350}
                            labelPosition="left"
                        />
                        <SensorPoint
                            cx={160}
                            cy={420}
                            color="#8B5CF6"
                            active={activeSensors.fsr1}
                            label="FSR 1"
                            labelX={80}
                            labelY={420}
                            labelPosition="left"
                        />
                        <SensorPoint
                            cx={200}
                            cy={480}
                            color="#EC4899"
                            active={activeSensors.heel}
                            label="Heel"
                            labelX={280}
                            labelY={490}
                        />
                    </svg>
                </div>

                {/* Status indicators */}
                <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(activeSensors).map(([sensor, active]) => (
                        <div
                            key={sensor}
                            className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100"
                        >
                            <div
                                className={`w-3 h-3 rounded-full mr-3 transition-colors duration-300 ${active ? 'bg-green-500' : 'bg-gray-300'
                                    }`}
                            />
                            <span className="text-sm text-gray-600">
                                {sensor
                                    .replace(/([A-Z])/g, ' $1')
                                    .trim()
                                    .replace(/fsr/i, 'FSR')
                                    .replace(/max30102/i, 'SpO₂/HR')
                                    .replace(/met(\s*)head/i, 'Metatarsal')}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FootSensorDiagram;