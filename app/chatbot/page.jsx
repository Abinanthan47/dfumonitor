// components/DFUChatbot.jsx
"use client";

import { useState, useRef, useEffect } from 'react';
import { SendIcon, Loader2, AlertTriangle, Info, ThumbsUp } from 'lucide-react';

const DFU_SYSTEM_PROMPT = `You are an AI-powered healthcare assistant specialized in monitoring and managing Diabetic Foot Ulcers (DFU). Your primary role is to assist diabetic patients by analyzing sensor readings (e.g., temperature, pressure, SpO2, and heart rate) from wearable devices and providing timely recommendations to prevent complications.

1. Monitoring & Analysis:
   * Continuously analyze sensor readings such as foot temperature, pressure distribution, oxygen saturation, and heart rate.
   * Detect early signs of ulcer formation, poor circulation, or excessive pressure that may lead to complications.
   * Compare real-time readings with baseline patient data and flag abnormalities.

2. Personalized Recommendations:
   * Provide preventive measures such as pressure relief techniques, proper footwear advice, hygiene tips, and wound care guidelines.
   * Offer exercise and mobility suggestions to improve blood circulation.
   * Recommend dietary changes to maintain stable blood glucose levels for better healing.

3. Risk Alerts & Warnings:
   * Alert the patient if a high-risk condition is detected (e.g., abnormal temperature variations, excessive pressure, or low SpO2 in the foot).
   * Suggest seeking medical attention if critical thresholds are exceeded.

4. Conversational & Supportive Tone:
   * Engage in a friendly, empathetic, and easy-to-understand conversation with the patient.
   * Offer step-by-step guidance on wound management, reducing infection risks, and improving self-care habits.
   * Encourage the patient to follow up with healthcare professionals for in-person consultations if needed.

5. Long-Term Health Management:
   * Track historical trends and notify patients about potential deterioration.
   * Provide reminders for routine checkups, medication intake, and lifestyle adjustments.
   * Educate the patient on diabetic neuropathy and ulcer prevention techniques.

Ensure that you remain engaging, informative, and proactive while prioritizing the patient's well-being. Always provide accurate, medically sound advice and encourage consulting a healthcare professional when necessary.`;

const mockSensorData = {
  temperature: { value: 32.8, unit: "°C", status: "elevated" },
  pressure: { value: 28, unit: "kPa", status: "high" },
  spO2: { value: 94, unit: "%", status: "normal" },
  heartRate: { value: 78, unit: "bpm", status: "normal" }
};

export default function DFUChatbot() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm your Diabetic Foot Ulcer (DFU) monitoring assistant. I can help analyze your foot health data and provide recommendations. How are you feeling today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);
    setError(null);

    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      // In a real app, we would include actual sensor data
      const sensorContext = `Current sensor readings:
      - Foot temperature: ${mockSensorData.temperature.value}${mockSensorData.temperature.unit} (${mockSensorData.temperature.status})
      - Pressure distribution: ${mockSensorData.pressure.value}${mockSensorData.pressure.unit} (${mockSensorData.pressure.status})
      - Blood oxygen (SpO2): ${mockSensorData.spO2.value}${mockSensorData.spO2.unit} (${mockSensorData.spO2.status})
      - Heart rate: ${mockSensorData.heartRate.value}${mockSensorData.heartRate.unit} (${mockSensorData.heartRate.status})`;
      
      const enhancedUserMessage = `${userMessage}\n\n${sensorContext}`;
      
      const response = await fetchGeminiResponse(enhancedUserMessage);
      
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (err) {
      console.error("Error fetching response:", err);
      setError("Sorry, I couldn't process your request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchGeminiResponse(userMessage) {
    // This would be an actual API call to Gemini in production
    // For demonstration, we'll simulate a response
    
    try {
      const response = await fetch('/api/chat', {  // Create this API route separately
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: DFU_SYSTEM_PROMPT },
            ...messages,
            { role: 'user', content: userMessage }
          ]
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response from API');
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw error;
    }
  }

  function getMessageStyle(role) {
    return role === 'user' 
      ? 'bg-blue-100 ml-auto' 
      : 'bg-gray-100 mr-auto';
  }

  function renderSensorAlert() {
    if (mockSensorData.temperature.status === "elevated" || mockSensorData.pressure.status === "high") {
      return (
        <div className="flex items-center p-3 mb-4 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertTriangle className="text-amber-500 mr-2" size={20} />
          <span className="text-sm">
            Some readings require attention. Check the chat for recommendations.
          </span>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="flex flex-col w-full max-w-md mx-auto h-[600px] border rounded-lg shadow-md bg-white">
      {/* Header */}
      <div className="p-4 border-b bg-white rounded-t-lg flex justify-between items-center">
        <h2 className="font-semibold text-lg">DFU Monitoring Assistant</h2>
        <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Online</div>
      </div>
      
      {/* Chat messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {renderSensorAlert()}
        
        {messages.map((message, index) => (
          <div 
            key={index}
            className={`max-w-[80%] p-3 rounded-lg mb-3 ${getMessageStyle(message.role)}`}
          >
            <div className="text-sm whitespace-pre-wrap">{message.content}</div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-center items-center mb-3">
            <Loader2 className="animate-spin text-blue-500" size={24} />
          </div>
        )}
        
        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-lg mb-3 text-center text-sm">
            {error}
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Info box */}
      <div className="px-4 py-2 bg-blue-50 border-t border-blue-100 flex items-start">
        <Info size={16} className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
        <p className="text-xs text-blue-700">
          This assistant provides monitoring and recommendations for diabetic foot health.
          Always consult with healthcare professionals for medical advice.
        </p>
      </div>
      
      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 border-t flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:border-blue-400"
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600 disabled:bg-blue-300"
          disabled={isLoading || !input.trim()}
        >
          <SendIcon size={20} />
        </button>
      </form>
    </div>
  );
}