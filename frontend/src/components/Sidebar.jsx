import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Plus, Folder, ChevronLeft, ChevronRight, Home } from 'lucide-react';

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
    const navigate = useNavigate();
    const { projectId } = useParams();

    // Mock projects data
    const projects = [
        { id: 'box-design', name: 'Simple Box' },
        { id: 'gear-v1', name: 'Gear Prototype' },
        { id: 'phone-stand', name: 'Phone Stand' },
    ];

    return (
        <div className={`${isCollapsed ? 'w-16' : 'w-[280px]'} flex flex-col border-r border-zinc-800 bg-zinc-950 h-full transition-all duration-300 relative`}>
            {/* Toggle Button */}
            <button
                onClick={toggleSidebar}
                className="absolute -right-3 top-6 w-6 h-6 bg-zinc-800 border border-zinc-700 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors z-50"
            >
                {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
            </button>

            <div className={`p-4 border-b border-zinc-800 flex items-center ${isCollapsed ? 'justify-center' : 'gap-2'} cursor-pointer`} onClick={() => navigate('/')}>
                <div className="w-8 h-8 bg-mint-500 rounded-lg flex items-center justify-center shrink-0">
                    <Box className="text-zinc-950 w-5 h-5" />
                </div>
                {!isCollapsed && (
                    <h1 className="text-xl font-bold bg-gradient-to-r from-mint-400 to-mint-600 bg-clip-text text-transparent whitespace-nowrap overflow-hidden">
                        ModelMint
                    </h1>
                )}
            </div>

            <div className="p-4 space-y-2">
                <button
                    onClick={() => navigate('/')}
                    className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-2 px-4'} py-3 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors font-medium`}
                    title="Home"
                >
                    <Home className="w-5 h-5" />
                    {!isCollapsed && <span>Home</span>}
                </button>

                <button
                    onClick={() => navigate('/workspace/new')}
                    className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-2 px-4'} py-3 bg-mint-600 hover:bg-mint-500 text-white rounded-xl transition-colors font-medium shadow-lg shadow-mint-900/20`}
                    title="New Project"
                >
                    <Plus className="w-5 h-5" />
                    {!isCollapsed && <span>New Project</span>}
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
                {!isCollapsed && (
                    <div className="px-2 py-1 text-xs font-semibold text-zinc-500 uppercase tracking-wider whitespace-nowrap">
                        Recent Projects
                    </div>
                )}
                {projects.map((project) => (
                    <button
                        key={project.id}
                        onClick={() => navigate(`/workspace/${project.id}`)}
                        className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'} py-2 rounded-lg text-sm transition-colors ${projectId === project.id
                                ? 'bg-zinc-800 text-white'
                                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                            }`}
                        title={project.name}
                    >
                        <Folder className="w-4 h-4 shrink-0" />
                        {!isCollapsed && <span className="truncate">{project.name}</span>}
                    </button>
                ))}
            </div>

            <div className="p-4 border-t border-zinc-800">
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800`}>
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 shrink-0">
                        <span className="font-medium text-xs">US</span>
                    </div>
                    {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-zinc-200 truncate">User</p>
                            <p className="text-xs text-zinc-500 truncate">Free Plan</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
