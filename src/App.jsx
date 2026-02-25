/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { Search, Gamepad2, Maximize2, X, Filter, ChevronLeft, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import gamesData from './games.json';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeGame, setActiveGame] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const categories = useMemo(() => {
    const cats = new Set(gamesData.map(g => g.category));
    return ['All', ...Array.from(cats)];
  }, []);

  const filteredGames = useMemo(() => {
    return gamesData.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          game.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || game.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AnimatePresence>
        {!activeGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col min-h-screen"
          >
            {/* Header */}
            <header className="sticky top-0 z-40 glass border-b border-border px-6 py-4">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div 
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => setActiveGame(null)}
                >
                  <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/20">
                    <Gamepad2 className="text-black w-6 h-6" />
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight">NEXUS<span className="text-accent">GAMES</span></h1>
                </div>

                <div className="flex-1 max-w-xl relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search unblocked games..."
                    className="w-full bg-zinc-900/50 border border-border rounded-xl py-2.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                        selectedCategory === cat 
                          ? 'bg-accent text-black' 
                          : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </header>

            <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredGames.length > 0 ? (
                  filteredGames.map((game) => (
                    <motion.div
                      layoutId={game.id}
                      key={game.id}
                      onClick={() => setActiveGame(game)}
                      className="group bg-card rounded-2xl overflow-hidden border border-border cursor-pointer game-card-hover flex flex-col"
                    >
                      <div className="aspect-video relative overflow-hidden">
                        <img 
                          src={game.thumbnail} 
                          alt={game.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                          <span className="text-white font-medium flex items-center gap-2">
                            Play Now <ExternalLink className="w-4 h-4" />
                          </span>
                        </div>
                        <div className="absolute top-3 right-3">
                          <span className="bg-black/60 backdrop-blur-md text-accent text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider border border-accent/20">
                            {game.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-4 flex-1 flex flex-col">
                        <h3 className="text-lg font-bold mb-1 group-hover:text-accent transition-colors">{game.title}</h3>
                        <p className="text-zinc-400 text-sm line-clamp-2">{game.description}</p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-900 mb-4">
                      <Filter className="text-zinc-500 w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-medium text-zinc-300">No games found</h3>
                    <p className="text-zinc-500">Try adjusting your search or category filter</p>
                  </div>
                )}
              </motion.div>
            </main>

            <footer className="p-8 border-t border-border text-center text-zinc-500 text-sm">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <p>© 2024 Nexus Games. All rights reserved.</p>
                <div className="flex items-center gap-6">
                  <a href="#" className="hover:text-accent transition-colors">Terms</a>
                  <a href="#" className="hover:text-accent transition-colors">Privacy</a>
                  <a href="#" className="hover:text-accent transition-colors">Contact</a>
                </div>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeGame && (
          <motion.div
            key="fullscreen-player"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex flex-col"
          >
            {/* Top Bar (Auto-hiding or subtle) */}
            <div className="absolute top-4 left-4 z-50 flex items-center gap-4">
              <button 
                onClick={() => setActiveGame(null)}
                className="p-3 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-accent hover:text-black transition-all shadow-xl"
                title="Back to Library"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="px-4 py-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white text-sm font-bold hidden sm:block">
                {activeGame.title}
              </div>
            </div>

            <div className="absolute top-4 right-4 z-50">
              <button 
                onClick={toggleFullscreen}
                className="p-3 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 transition-all shadow-xl"
                title="Toggle Browser Fullscreen"
              >
                <Maximize2 className="w-6 h-6" />
              </button>
            </div>

            {/* Game Iframe */}
            <div className="flex-1 w-full h-full">
              <iframe
                src={activeGame.iframeUrl}
                className="w-full h-full border-none"
                allow="autoplay; fullscreen; keyboard; pointer-lock"
                title={activeGame.title}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
