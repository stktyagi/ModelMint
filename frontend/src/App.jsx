import React, { useState, useEffect, useRef } from 'react';
import { Send, Download, Box, Image as ImageIcon, Settings, RefreshCw } from 'lucide-react';

// Mock API service for now
const mockSendMessage = async (message) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        text: `I've updated the model based on: "${message}"`,
        imageUrl: 'https://placehold.co/600x400/1e293b/3bc2a8?text=Model+Preview', // Placeholder
        scadCode: '// SCAD code would go here\ncube([10, 10, 10]);',
        status: 'success'
      });
    }, 1000);
  });
};

function App() {
  const [messages, setMessages] = useState([
    { role: 'system', content: 'Welcome to ModelMint! Describe what you want to create.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('https://placehold.co/600x400/1e293b/3bc2a8?text=No+Model+Yet');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await mockSendMessage(input);
      setMessages(prev => [...prev, { role: 'assistant', content: response.text }]);
      if (response.imageUrl) {
        setPreviewUrl(response.imageUrl);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [...prev, { role: 'system', content: 'Error processing request.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-zinc-900 text-zinc-100 font-sans overflow-hidden">
      {/* Sidebar / Chat Area */}
      <div className="w-1/3 min-w-[350px] flex flex-col border-r border-zinc-800 bg-zinc-950">
        <div className="p-4 border-b border-zinc-800 flex items-center gap-2">
          <div className="w-8 h-8 bg-mint-500 rounded-lg flex items-center justify-center">
            <Box className="text-zinc-950 w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-mint-400 to-mint-600 bg-clip-text text-transparent">
            ModelMint
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${msg.role === 'user'
                  ? 'bg-mint-600 text-white'
                  : msg.role === 'system'
                    ? 'bg-zinc-800/50 text-zinc-400 text-sm border border-zinc-800'
                    : 'bg-zinc-800 text-zinc-200'
                }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-zinc-800 rounded-2xl px-4 py-3 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-mint-500" />
                <span className="text-zinc-400 text-sm">Generating...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-zinc-800 bg-zinc-950">
          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your model..."
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:border-mint-500 focus:ring-1 focus:ring-mint-500 transition-all placeholder-zinc-500"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-mint-500 hover:bg-mint-400 text-zinc-950 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Main Content / Preview Area */}
      <div className="flex-1 flex flex-col bg-zinc-900">
        <div className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 bg-zinc-900/50 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <h2 className="text-zinc-400 font-medium flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Preview
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm font-medium transition-colors border border-zinc-700">
              <Download className="w-4 h-4" />
              Export STL
            </button>
            <button className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 p-8 flex items-center justify-center relative overflow-hidden">
          {/* Grid Background */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }}
          />

          <div className="relative z-10 w-full max-w-4xl aspect-video bg-zinc-950 rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden flex items-center justify-center group">
            <img
              src={previewUrl}
              alt="Model Preview"
              className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
            />

            <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full text-xs text-zinc-400 border border-white/10">
              Preview Mode
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
