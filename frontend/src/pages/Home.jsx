import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, ArrowRight } from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="h-full bg-zinc-950 text-zinc-100 overflow-y-auto">
            {/* Navbar */}
            <nav className="relative z-50 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-mint-500 rounded-lg flex items-center justify-center">
                        <Box className="text-zinc-950 w-5 h-5" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-mint-400 to-mint-600 bg-clip-text text-transparent">
                        ModelMint
                    </span>
                </div>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
                    <a href="#" className="hover:text-white transition-colors">Features</a>
                    <a href="#" className="hover:text-white transition-colors">How it works</a>
                    <a href="#" className="hover:text-white transition-colors">FAQ</a>
                </div>

                <button
                    onClick={() => navigate('/workspace/new')}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-900/20"
                >
                    Launch App
                </button>
            </nav>

            {/* Hero Section */}
            <main className="max-w-7xl mx-auto px-8 py-12 md:py-24 flex flex-col md:flex-row items-center gap-12 md:gap-24">
                {/* Left Column: Content */}
                <div className="flex-1 space-y-8 text-center md:text-left">
                    <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight">
                        Turn Your Imagination into <br />
                        <span className="text-blue-500">3D Printable Models</span>
                    </h1>

                    <p className="text-xl text-zinc-400 leading-relaxed max-w-xl mx-auto md:mx-0">
                        Describe any object in natural language — our AI instantly converts your idea into a ready-to-print STL file.
                    </p>

                    <div className="flex items-center justify-center md:justify-start gap-4">
                        <button
                            onClick={() => navigate('/workspace/new')}
                            className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-lg transition-colors shadow-xl shadow-blue-900/20 flex items-center gap-2"
                        >
                            Get Started
                        </button>
                        <button className="px-8 py-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded-xl font-semibold text-lg transition-colors">
                            Learn More
                        </button>
                    </div>
                </div>

                {/* Right Column: Image */}
                <div className="flex-1 relative">
                    {/* Decorative blobs */}
                    <div className="absolute -top-20 -right-20 w-96 h-96 bg-mint-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

                    {/* Main Image Card */}
                    <div className="relative z-10 bg-gradient-to-br from-mint-400 to-mint-600 rounded-3xl p-1 shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                        <div className="bg-zinc-900 rounded-[22px] overflow-hidden aspect-[4/3] flex items-center justify-center relative">
                            {/* Mock UI content */}
                            <div className="absolute inset-0 flex items-center justify-center gap-8">
                                <div className="text-8xl font-mono text-white/20">A</div>
                                <div className="w-1 h-32 bg-white/10 rounded-full"></div>
                                <Box className="w-32 h-32 text-white/20" />
                            </div>

                            {/* Floating Elements */}
                            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-zinc-950/50 to-transparent"></div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Home;
