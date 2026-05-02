import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Trophy, Timer, Zap, ArrowLeft, Coins } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { Game } from '../constants';
import { cn } from '../lib/utils';

interface GameArenaProps {
  game: Game;
  onClose: (profit?: number) => void;
  walletMode: 'real' | 'demo';
  balance: number;
}

export default function GameArena({ game, onClose, walletMode, balance }: GameArenaProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [gameState, setGameState] = useState<'lobby' | 'playing' | 'ended'>('lobby');
  const [players, setPlayers] = useState<number>(1);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [gameScore, setGameScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  
  const entryFee = walletMode === 'real' ? 5 : 500;
  const winMultiplier = 2.4;
  const winPotential = entryFee * winMultiplier;

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);
    newSocket.emit('join_lobby', game.id);
    
    // Simulate matchmaking for demo/fallback
    const t = setTimeout(() => {
        setPlayers(2);
        setCountdown(5);
    }, 1500);

    return () => {
      newSocket.emit('leave_lobby', game.id);
      newSocket.disconnect();
      clearTimeout(t);
    };
  }, [game.id]);

  useEffect(() => {
    let timer: any;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      setGameState('ended');
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  useEffect(() => {
    if (countdown && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setGameState('playing');
    }
  }, [countdown]);

  const handleAction = () => {
    setGameScore(prev => prev + Math.floor(Math.random() * 10) + 5);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-bg-dark flex flex-col selection:bg-primary selection:text-black">
       <header className="p-4 flex items-center justify-between border-b border-white/5 glass">
          <div className="flex items-center gap-4">
             <button onClick={() => onClose()} className="p-3 hover:bg-white/10 rounded-2xl transition-all">
                <ArrowLeft size={24} />
             </button>
             <div>
                <h2 className="font-display font-black text-xl leading-none italic">{game.title}</h2>
                <div className="flex items-center gap-2 mt-1">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                   <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">{walletMode === 'real' ? 'Real Stakes Arena' : 'Practice Circuit'}</span>
                </div>
             </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
                <p className="text-[9px] font-black text-white/20 uppercase tracking-widest leading-none">Session ID</p>
                <p className="text-xs font-mono font-bold text-white/60 tracking-wider">#XP-901-TR</p>
             </div>
             <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-black text-xl italic shadow-[0_0_15px_rgba(255,193,7,0.1)]">
                {game.title[0]}
             </div>
          </div>
       </header>

       <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
          {/* Background FX */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
          
          <AnimatePresence mode="wait">
             {gameState === 'lobby' && (
                <motion.div key="lobby" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, y: -40 }} className="max-w-md w-full glass rounded-[3rem] p-10 border-white/10 text-center shadow-2xl relative z-10">
                   <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center text-primary mx-auto mb-8 animate-bounce">
                      <Users size={40} />
                   </div>
                   <h3 className="text-3xl font-display font-black tracking-tighter mb-2 italic">WARMING UP...</h3>
                   <p className="text-white/30 text-sm font-medium mb-8">Connecting players to high-speed game clusters</p>
                   
                   <div className="flex justify-center gap-4 mb-4">
                      {[1, 2].map((i) => (
                         <div key={i} className={cn("w-16 h-16 rounded-[1.5rem] border-2 flex items-center justify-center transition-all duration-500", i <= players ? "bg-primary border-primary text-black shadow-[0_0_20px_rgba(255,193,7,0.3)]" : "bg-black/40 border-white/5 text-white/10")}>
                            <Users size={28} />
                         </div>
                      ))}
                   </div>
                   
                   <div className="mb-10">
                      <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-3">Live Spectator Bets (4/4)</p>
                      <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4].map(b => (
                          <div key={b} className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.3)]"></div>
                        ))}
                      </div>
                   </div>

                   {countdown !== null ? (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-primary font-display font-black text-8xl italic drop-shadow-[0_0_30px_rgba(255,193,7,0.5)]">
                        {countdown}
                      </motion.div>
                   ) : (
                      <div className="grid grid-cols-2 gap-4">
                         <div className="p-5 rounded-2xl bg-black/60 border border-white/5 text-left">
                            <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Entry Fee</span>
                            <p className="text-xl font-mono font-black text-white">${entryFee.toFixed(2)}</p>
                         </div>
                         <div className="p-5 rounded-2xl bg-black/60 border border-white/5 text-left">
                            <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Win Prize</span>
                            <p className="text-xl font-mono font-black text-green-400">${winPotential.toFixed(2)}</p>
                         </div>
                      </div>
                   )}
                </motion.div>
             )}

             {gameState === 'playing' && (
                <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-4xl flex flex-col items-center relative z-10">
                   <div className="w-full flex justify-between items-end mb-12">
                      <div className="glass px-6 py-4 rounded-2xl border-white/10">
                         <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Scoreboard</p>
                         <p className="text-4xl font-mono font-black text-primary tracking-tighter">{gameScore.toLocaleString()}</p>
                      </div>
                      <div className="flex flex-col items-center">
                         <div className="w-20 h-20 rounded-full border-4 border-primary/20 flex items-center justify-center relative">
                            <svg className="absolute inset-0 w-full h-full -rotate-90">
                               <circle 
                                  cx="40" cy="40" r="36" 
                                  className="stroke-primary fill-none transition-all duration-1000" 
                                  strokeWidth="4"
                                  strokeDasharray={`${(timeLeft / 10) * 226} 226`}
                               />
                            </svg>
                            <span className="text-2xl font-mono font-black text-white">{timeLeft}</span>
                         </div>
                         <span className="text-[9px] font-black text-white/40 uppercase tracking-widest mt-2">Time Unit</span>
                      </div>
                   </div>

                   <div 
                      onClick={handleAction}
                      className="w-80 h-80 sm:w-[450px] sm:h-[450px] rounded-[4rem] group glass border-white/10 relative overflow-hidden flex items-center justify-center shadow-2xl cursor-pointer active:scale-95 transition-all"
                   >
                      <img src={game.image} className="absolute inset-0 w-full h-full object-cover opacity-10 group-hover:opacity-20 transition-all blur-md" />
                      <div className="relative z-10 flex flex-col items-center gap-8">
                         <div className="p-8 rounded-[2.5rem] bg-primary/10 text-primary shadow-inner">
                            <Zap size={64} className="animate-pulse" />
                         </div>
                         <div className="text-center">
                             <h2 className="text-4xl font-display font-black italic tracking-tighter text-white mb-2 underline decoration-primary decoration-4 underline-offset-8">TAP TO STRIKE</h2>
                             <p className="text-white/20 font-black text-xs uppercase tracking-widest">Wagering Session Active</p>
                         </div>
                      </div>
                      
                      <div className="absolute inset-0 pointer-events-none group-active:bg-primary/5 transition-all"></div>
                   </div>

                   <div className="mt-12 flex gap-12">
                      <div className="flex items-center gap-4 opacity-40">
                         <div className="w-10 h-10 rounded-xl bg-white/10"></div>
                         <div className="text-left">
                            <p className="text-[9px] font-black uppercase">Opponent</p>
                            <p className="text-xs font-bold">Player_821</p>
                         </div>
                      </div>
                      <div className="w-px h-10 bg-white/10"></div>
                       <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-xl bg-primary text-black flex items-center justify-center font-bold">YOU</div>
                         <div className="text-left">
                            <p className="text-[9px] font-black uppercase text-primary">Your Turn</p>
                            <p className="text-xs font-bold">Status: Active</p>
                         </div>
                      </div>
                   </div>
                </motion.div>
             )}

             {gameState === 'ended' && (
                <motion.div key="ended" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full glass rounded-[3.5rem] p-12 border-green-500/20 text-center shadow-[0_0_100px_rgba(34,197,94,0.15)] relative z-10">
                   <div className="w-24 h-24 bg-green-500/10 rounded-[2.5rem] flex items-center justify-center text-green-400 mx-auto mb-8 shadow-inner">
                      <Trophy size={56} className="drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
                   </div>
                   <h3 className="text-5xl font-display font-black text-green-400 mb-2 italic tracking-tighter">VICTORY</h3>
                   <p className="text-white/30 text-sm font-medium mb-10">Verification complete. Balance updated.</p>
                   
                   <div className="p-8 rounded-[2rem] bg-black/60 border border-white/5 flex items-center justify-between mb-10 shadow-inner">
                      <div className="text-left">
                         <span className="text-[10px] text-white/20 font-black uppercase tracking-widest">Nett Payout</span>
                         <p className="text-4xl font-mono font-black text-green-400 tracking-tighter">+${winPotential.toFixed(2)}</p>
                      </div>
                      <div className="p-3 bg-green-500/20 rounded-xl text-green-400">
                         <Zap size={28} />
                      </div>
                   </div>
                   <button 
                    onClick={() => onClose(winPotential - entryFee)} 
                    className="w-full bg-white text-black font-black py-6 rounded-[1.5rem] shadow-xl hover:scale-[0.98] transition-all tracking-widest"
                   >
                    COLLECT & EXIT
                   </button>
                </motion.div>
             )}
          </AnimatePresence>
       </div>
    </div>
  );
}
