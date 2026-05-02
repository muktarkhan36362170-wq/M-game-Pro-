/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  Trophy, 
  Wallet, 
  Gamepad2, 
  HelpCircle, 
  ChevronRight, 
  Copy, 
  MessageCircle, 
  ArrowUpRight, 
  ArrowDownRight,
  ShieldCheck,
  Zap,
  Globe,
  Info,
  Menu,
  X,
  ExternalLink,
  Target,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GAMES, BINANCE_PAY_ID, TELEGRAM_CHANNEL, TELEGRAM_GROUP, Game } from './constants';
import GameArena from './components/GameArena';
import { cn } from './lib/utils';

type WalletMode = 'real' | 'demo';

export default function App() {
  const [walletMode, setWalletMode] = useState<WalletMode>('demo');
  const [balances, setBalances] = useState({ real: 0, demo: 10000, withdrawable: 0 });
  const [activeTab, setActiveTab] = useState<'home' | 'games' | 'wallet' | 'support' | 'profile'>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  const handleGameEnd = (profit: number) => {
    if (walletMode === 'real') {
      setBalances(prev => ({
        ...prev,
        real: prev.real + profit,
        withdrawable: prev.withdrawable + profit
      }));
    } else {
      setBalances(prev => ({
        ...prev,
        demo: prev.demo + profit
      }));
    }
    setSelectedGame(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-bg-dark text-slate-900 selection:bg-primary selection:text-black">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-slate-200 px-4 md:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setActiveTab('home')}>
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center font-display font-black text-black text-xl shadow-lg group-hover:scale-105 transition-all">M</div>
          <span className="font-display font-black text-xl tracking-tighter hidden sm:block italic text-slate-900">
            M-game <span className="text-primary-dark not-italic">Pro</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex bg-slate-100 rounded-2xl p-1 border border-slate-200">
            <button onClick={() => setWalletMode('demo')} className={cn("px-5 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all", walletMode === 'demo' ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600")}>DEMO</button>
            <button onClick={() => setWalletMode('real')} className={cn("px-5 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all", walletMode === 'real' ? "bg-primary text-black shadow-sm" : "text-slate-400 hover:text-slate-600")}>PRO</button>
          </div>

          <button onClick={() => setActiveTab('profile')} className="flex items-center gap-3 glass px-4 py-2 rounded-2xl border-slate-200 hover:border-primary/50 transition-all active:scale-95 group">
            <div className="flex flex-col items-end">
              <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest group-hover:text-primary-dark transition-colors">{walletMode === 'real' ? 'Real User' : 'Guest'}</span>
              <span className={cn("text-sm font-mono font-black", walletMode === 'real' ? "text-green-600" : "text-amber-600")}>
                {walletMode === 'real' ? `$${balances.real.toFixed(2)}` : 'Practice'}
              </span>
            </div>
            <div className={cn("p-2 rounded-xl transition-all", walletMode === 'real' ? "bg-green-50 text-green-600" : "bg-primary/10 text-primary-dark")}>
              <Users size={16} />
            </div>
          </button>

          <button className="lg:hidden text-slate-900 hover:text-primary-dark transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '100%' }} className="fixed inset-0 z-40 glass pt-24 px-6 lg:hidden flex flex-col gap-8">
            <div className="bg-black/40 rounded-3xl p-6 border border-white/10">
              <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-4">Select Circuit</p>
              <div className="grid grid-cols-1 gap-3">
                <button onClick={() => { setWalletMode('demo'); setIsMenuOpen(false); }} className={cn("p-4 rounded-2xl text-left flex items-center justify-between border-2 transition-all", walletMode === 'demo' ? "border-primary bg-primary/5 text-primary" : "border-white/5 hover:border-white/20")}>
                   <span className="font-bold">Practice (Demo)</span>
                   {walletMode === 'demo' && <Zap size={16} />}
                </button>
                <button onClick={() => { setWalletMode('real'); setIsMenuOpen(false); }} className={cn("p-4 rounded-2xl text-left flex items-center justify-between border-2 transition-all", walletMode === 'real' ? "border-primary bg-primary text-black" : "border-white/5 hover:border-white/20")}>
                   <span className="font-bold">Wagering (Real)</span>
                   {walletMode === 'real' && <ShieldCheck size={16} />}
                </button>
              </div>
            </div>
            <nav className="flex flex-col gap-2">
              {[
                { id: 'home', label: 'Overview', icon: Trophy },
                { id: 'games', label: 'Betting Floor', icon: Gamepad2 },
                { id: 'wallet', label: 'Treasury', icon: Wallet },
                { id: 'profile', label: 'Profile Hub', icon: Users },
                { id: 'support', label: 'Elite Support', icon: HelpCircle },
              ].map((item) => (
                <button key={item.id} onClick={() => { setActiveTab(item.id as any); setIsMenuOpen(false); }} className={cn("flex items-center gap-4 p-5 rounded-2xl transition-all font-bold", activeTab === item.id ? "bg-primary/10 text-primary border border-primary/20" : "text-white/40 hover:text-white/60")}>
                  <item.icon size={22} /> {item.label}
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 pt-24 pb-32 lg:pb-12 px-4 lg:px-8 max-w-7xl mx-auto w-full">
        {activeTab === 'home' && (
          <div className="space-y-12">
            <section className="relative rounded-[3rem] overflow-hidden p-8 lg:p-16 glass border-white/5 flex flex-col lg:flex-row items-center gap-12">
               <div className="absolute top-0 right-0 w-full lg:w-1/2 h-full opacity-10 pointer-events-none">
                  <img src={GAMES[0].image} className="w-full h-full object-cover grayscale mix-blend-overlay" />
               </div>
               <div className="flex-1 text-center lg:text-left z-10">
                  <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-6xl lg:text-8xl font-display font-black tracking-tighter leading-none mb-6">
                     PLAY TO <br/><span className="text-primary italic">CONQUER.</span>
                  </motion.h1>
                  <p className="text-white/40 text-lg lg:text-xl max-w-lg mb-10 leading-relaxed font-medium">M-game Pro: The Next Generation iGaming ecosystem. Professional grade wagering with enterprise-level security.</p>
                  <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                     <button onClick={() => setActiveTab('games')} className="bg-primary text-black px-10 py-5 rounded-[1.5rem] font-black text-lg shadow-[0_10px_30px_rgba(255,193,7,0.3)] hover:scale-105 transition-all flex items-center gap-3">
                        START BETTING <ArrowUpRight size={22} />
                     </button>
                     <button onClick={() => window.open(TELEGRAM_CHANNEL)} className="glass border-white/10 px-10 py-5 rounded-[1.5rem] font-black text-lg hover:bg-white/5 transition-all text-white/80">
                        COMMUNITY
                     </button>
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-4 w-full lg:w-auto shrink-0 z-10">
                  {[
                    { l: 'Daily Active', v: '500k+', i: Users },
                    { l: 'House Cut', v: '2.5%', i: Target },
                    { l: 'Security', v: 'AI-LED', i: ShieldCheck },
                    { l: 'Payouts', v: 'INSTANT', i: Zap },
                  ].map((s) => (
                    <div key={s.l} className="bg-black/60 border border-white/5 backdrop-blur-3xl p-6 rounded-[2rem] text-center min-w-[140px]">
                       <s.i size={20} className="text-primary mx-auto mb-2 opacity-50" />
                       <p className="text-2xl font-display font-black text-white">{s.v}</p>
                       <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mt-1">{s.l}</p>
                    </div>
                  ))}
               </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-8">
                 <h2 className="text-2xl font-display font-black tracking-tighter italic"><span className="text-primary not-italic">#01</span> PREMIUM ARENAS</h2>
                 <button onClick={() => setActiveTab('games')} className="text-[10px] font-black text-primary hover:text-white transition-colors tracking-widest flex items-center gap-2">ALL GAMES <ChevronRight size={14} /></button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {GAMES.filter(g => g.tier === 1).map(g => <GameCard key={g.id} game={g} mode={walletMode} onClick={() => setSelectedGame(g)} />)}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'games' && (
          <div className="space-y-16">
            <div>
               <h2 className="text-4xl font-display font-black mb-10 italic">WAGERING <span className="text-primary">FLOOR</span></h2>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {GAMES.map(g => <GameCard key={g.id} game={g} mode={walletMode} onClick={() => setSelectedGame(g)} />)}
               </div>
            </div>
          </div>
        )}

        {activeTab === 'wallet' && <WalletSection balance={balances} mode={walletMode} onCopy={copyToClipboard} />}
        
        {activeTab === 'profile' && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-4xl mx-auto space-y-8">
             <div className="glass rounded-[3rem] p-10 border-slate-200 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden bg-white shadow-xl">
                <div className="w-32 h-32 rounded-[2.5rem] bg-linear-to-br from-primary to-primary-dark p-1 shadow-lg">
                   <div className="w-full h-full bg-white rounded-[2.2rem] flex items-center justify-center">
                      <Users size={48} className="text-primary-dark" />
                   </div>
                </div>
                <div className="text-center md:text-left flex-1">
                   <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                      <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight">PRO_GAMER_99</h2>
                      <span className="bg-primary/20 text-primary-dark border border-primary/20 px-3 py-1 rounded-full text-[10px] font-black uppercase">Level 12</span>
                   </div>
                   <p className="text-slate-500 font-medium mb-6 italic text-sm">Status: {walletMode === 'real' ? 'Verified Pro' : 'Observation Mode'}</p>
                   <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                      <button onClick={() => setActiveTab('wallet')} className="bg-slate-100 border border-slate-200 px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-slate-200 transition-all font-bold text-xs text-slate-700">
                         <Wallet size={16} className="text-primary-dark" /> DEPOSIT & WITHDRAW
                      </button>
                      <button onClick={() => setActiveTab('games')} className="bg-slate-100 border border-slate-200 px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-slate-200 transition-all font-bold text-xs text-slate-700">
                         <Gamepad2 size={16} className="text-primary-dark" /> GAME HISTORY
                      </button>
                   </div>
                </div>
                <div className="bg-primary px-10 py-5 rounded-[2rem] text-black font-black text-center min-w-[160px] shadow-sm">
                   <p className="text-[9px] uppercase tracking-widest opacity-60 leading-none mb-1">Current Tier</p>
                   <p className="text-3xl leading-none italic">ELITE</p>
                </div>
             </div>

             <div className="grid md:grid-cols-3 gap-6">
                {[
                  { l: 'Lifetime Arenas', v: '248', i: Trophy },
                  { l: 'Net Payouts', v: '+$1,240', i: Zap, c: 'text-green-600' },
                  { l: 'Avg Winrate', v: '68%', i: Target },
                ].map((stat, idx) => (
                  <div key={idx} className="glass rounded-[2rem] p-8 border-slate-200 text-center group hover:bg-white transition-all bg-white shadow-sm">
                    <stat.i size={24} className="text-primary/60 mx-auto mb-3" />
                    <p className={cn("text-3xl font-display font-black tracking-tighter", stat.c || "text-slate-900")}>{stat.v}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">{stat.l}</p>
                  </div>
                ))}
             </div>

             <div className="p-10 glass rounded-[2.5rem] border-slate-200 bg-white shadow-lg">
                <h3 className="text-xl font-display font-black mb-8 italic uppercase tracking-tight text-slate-900 border-b border-slate-100 pb-4">Financial Controls</h3>
                <WalletSection balance={balances} mode={walletMode} onCopy={copyToClipboard} />
             </div>
          </motion.div>
        )}
        
        {activeTab === 'support' && (
           <div className="max-w-4xl mx-auto space-y-12 py-12">
              <div className="text-center space-y-4">
                 <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center text-primary mx-auto mb-4">
                    <HelpCircle size={48} />
                 </div>
                 <h2 className="text-5xl font-display font-black tracking-tighter">ELITE SUPPORT</h2>
                 <p className="text-white/40 font-medium text-lg">Direct access to the M-GAME development team and community.</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-8">
                 <ContactCard title="OFFICIAL CHANNEL" desc="Latest news, tournament announcements & server status." url={TELEGRAM_CHANNEL} icon={Globe} />
                 <ContactCard title="COMMUNITY CHAT" desc="Engage with pro players, share tactics & reporting." url={TELEGRAM_GROUP} icon={MessageCircle} color="primary" />
              </div>
           </div>
        )}
      </main>

      {/* Shared Modals/Overlay */}
      <AnimatePresence>
        {selectedGame && (
          <GameArena 
            game={selectedGame} 
            onClose={(profit) => profit ? handleGameEnd(profit) : setSelectedGame(null)} 
            walletMode={walletMode}
            balance={walletMode === 'real' ? balances.real : balances.demo}
          />
        )}
      </AnimatePresence>

      <footer className="fixed bottom-0 left-0 right-0 z-40 lg:hidden glass h-20 px-6 flex items-center justify-around border-t border-white/10">
        {[
          { id: 'home', i: Trophy, l: 'Home' },
          { id: 'games', i: Gamepad2, l: 'Play' },
          { id: 'wallet', i: Wallet, l: 'Vault' },
          { id: 'profile', i: Users, l: 'Profile' },
          { id: 'support', i: HelpCircle, l: 'Help' },
        ].map(n => (
          <button key={n.id} onClick={() => setActiveTab(n.id as any)} className={cn("flex flex-col items-center gap-1 transition-all", activeTab === n.id ? "text-primary scale-110" : "text-white/20")}>
             <n.i size={22} />
             <span className="text-[8px] font-black uppercase tracking-widest">{n.l}</span>
          </button>
        ))}
      </footer>
    </div>
  );
}

interface GameCardProps {
  key?: string | number;
  game: Game;
  mode: WalletMode;
  onClick: () => void;
}

function GameCard({ game, mode, onClick }: GameCardProps) {
  return (
    <motion.div whileHover={{ y: -8 }} onClick={onClick} className="group relative h-[400px] rounded-[2.5rem] overflow-hidden glass border border-white/5 cursor-pointer flex flex-col justify-end p-8 shadow-2xl">
       <div className="absolute inset-0">
          <img src={game.image} className="w-full h-full object-cover brightness-[0.4] transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute inset-0 bg-linear-to-t from-bg-dark via-bg-dark/20 to-transparent"></div>
       </div>
       <div className="relative z-10 space-y-4">
          <div>
             <span className="text-[9px] font-black text-primary uppercase tracking-[0.3em] mb-1 block">{game.category} Arena</span>
             <h3 className="text-2xl font-display font-black leading-tight tracking-tight group-hover:text-primary transition-colors">{game.title}</h3>
          </div>
          <div className="flex items-center gap-3">
             <button className={cn("flex-1 py-4 rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest transition-all", mode === 'real' ? "bg-primary text-black shadow-[0_5px_20px_rgba(255,193,7,0.3)]" : "bg-white/10 text-white")}>
                {mode === 'real' ? 'Real Stakes' : 'Practice Run'}
             </button>
          </div>
       </div>
       <div className="absolute top-6 right-6 z-10 glass border-white/10 rounded-full px-4 py-1.5 flex items-center gap-2 backdrop-blur-3xl shadow-2xl">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-[8px] font-black text-white/60 tracking-widest">ACTIVE</span>
       </div>
    </motion.div>
  );
}

function WalletSection({ balance, mode, onCopy }: { balance: any, mode: WalletMode, onCopy: (s: string) => void }) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [transactionId, setTransactionId] = useState('');

  const handleDepositClick = () => {
    if (!transactionId || !depositAmount) return;
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      alert("SUCCESS: TxID " + transactionId + " submitted for verification. Balance will update shortly.");
      setDepositAmount('');
      setTransactionId('');
    }, 2500);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto space-y-8">
       <div className="glass rounded-[3rem] p-12 border-slate-200 relative overflow-hidden text-center bg-white shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full -mr-32 -mt-32 blur-3xl opacity-30"></div>
          <div className="relative z-10">
              <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center text-primary-dark mx-auto mb-6 shadow-sm">
                 <Wallet size={40} />
              </div>
              <h2 className="text-5xl font-display font-black tracking-tighter mb-4 italic uppercase text-slate-900">Total Treasury</h2>
              <div className="grid sm:grid-cols-2 gap-6 mt-12">
                 <div className="bg-slate-50 border border-slate-200 rounded-[2.5rem] p-8 text-center group hover:border-primary/40 transition-all shadow-inner">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 group-hover:text-primary-dark transition-colors font-sans">Verified Real Balance</p>
                    <p className="text-5xl font-mono font-black text-green-600 tracking-tighter">${balance.real.toFixed(2)}</p>
                 </div>
                 <div className="bg-slate-50 border border-slate-200 rounded-[2.5rem] p-8 text-center group hover:border-primary/40 transition-all shadow-inner">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 group-hover:text-primary-dark transition-colors font-sans">Practice Ledger</p>
                    <p className="text-5xl font-mono font-black text-amber-600 tracking-tighter">{balance.demo.toLocaleString()}</p>
                 </div>
              </div>
          </div>
       </div>

       <div className="grid lg:grid-cols-2 gap-8">
          {/* DEPOSIT SECTION */}
          <div className="glass rounded-[2.5rem] p-10 border-slate-200 space-y-8 bg-white shadow-lg">
             <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-green-100 text-green-600 shadow-sm"><ArrowDownRight size={28} /></div>
                <h3 className="text-2xl font-display font-black tracking-tighter text-slate-900 uppercase italic">DEPOSIT FUNDS</h3>
             </div>
             
             <div className="space-y-6">
                <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Binance Pay ID (Receiver)</p>
                   <div className="flex items-center justify-between bg-white rounded-2xl px-6 py-5 border border-slate-200 hover:border-primary/50 transition-all shadow-sm">
                      <span className="font-mono font-black text-2xl tracking-tighter text-slate-900">{BINANCE_PAY_ID}</span>
                      <button onClick={() => onCopy(BINANCE_PAY_ID)} className="p-3 hover:bg-slate-100 rounded-xl transition-all text-slate-400 hover:text-slate-900"><Copy size={24} /></button>
                   </div>
                   <div className="grid grid-cols-2 gap-3 pt-4">
                      {['USDT Assets', 'Instant Hub', 'Global Network', 'Min $1.00'].map(t => (
                         <div key={t} className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest"><ShieldCheck size={12} className="text-primary-dark" /> {t}</div>
                      ))}
                   </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Amount Sent (USDT)</label>
                    <input 
                      type="number" 
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      placeholder="0.00" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-6 font-mono text-xl text-slate-900 focus:outline-none focus:border-primary/50 transition-all shadow-inner" 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Transaction ID (Required)</label>
                    <input 
                      type="text" 
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder="Paste ID here" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-6 font-mono text-xl text-slate-900 focus:outline-none focus:border-primary/50 transition-all shadow-inner" 
                    />
                  </div>
                </div>

                <button 
                  onClick={handleDepositClick}
                  disabled={isVerifying || !depositAmount || !transactionId}
                  className={cn(
                    "w-full font-black py-6 rounded-[1.5rem] shadow-xl transition-all flex items-center justify-center gap-3",
                    isVerifying || !depositAmount || !transactionId
                      ? "bg-slate-100 text-slate-300 cursor-not-allowed" 
                      : "bg-primary text-black hover:scale-[0.98] shadow-amber-200"
                  )}
                >
                   {isVerifying ? (
                     <>
                        <div className="w-5 h-5 border-4 border-black/20 border-t-black rounded-full animate-spin"></div>
                        SECURE VERIFICATION...
                     </>
                   ) : 'COMPLETED DEPOSIT'}
                </button>
             </div>
          </div>

          {/* WITHDRAW SECTION */}
          <div className="glass rounded-[2.5rem] p-10 border-slate-200 space-y-8 bg-white shadow-lg text-slate-900">
             <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-orange-100 text-orange-600 shadow-sm"><ArrowUpRight size={28} /></div>
                <h3 className="text-2xl font-display font-black tracking-tighter uppercase italic">WITHDRAW FUNDS</h3>
             </div>
             <div className="space-y-6 text-left">
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Withdrawal Amount</label>
                   <input type="number" placeholder="Min 10.00" className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-6 font-mono text-2xl text-slate-900 focus:outline-none focus:border-orange-500/50 transition-all shadow-inner" />
                   <p className="text-[10px] font-black text-slate-400 italic ml-2">Available for payout: ${balance.withdrawable.toFixed(2)}</p>
                </div>
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Destination Pay ID</label>
                   <input type="text" placeholder="Your Pay ID" className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-6 font-mono text-lg text-slate-900 focus:outline-none focus:border-orange-500/50 transition-all shadow-inner" />
                </div>
                
                {mode === 'demo' ? (
                  <div className="p-5 rounded-3xl bg-red-50 border border-red-100 flex gap-4 items-center">
                    <div className="p-2 rounded-xl bg-red-100 text-red-600"><ShieldCheck size={20} /></div>
                    <div>
                        <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1">UNAUTHORIZED</p>
                        <p className="text-[9px] font-bold text-red-600/60 leading-tight">Practice coins have no liquidation value. Switch to REAL mode to earn USDT.</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 rounded-3xl bg-green-50 border border-green-100 flex gap-4 items-center">
                    <div className="p-2 rounded-xl bg-green-100 text-green-600"><ShieldCheck size={20} /></div>
                    <div>
                        <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-1">LIQUIDATION PROTOCOL</p>
                        <p className="text-[9px] font-bold text-green-600/60 leading-tight italic">MIN $10.00 • Binance Pay Only • Verification: 1-12 Hours.</p>
                    </div>
                  </div>
                )}

                <button 
                  disabled={mode === 'demo' || balance.withdrawable < 10}
                  className={cn(
                    "w-full font-black py-6 rounded-[1.5rem] transition-all shadow-xl",
                    mode === 'demo' || balance.withdrawable < 10 
                      ? "bg-slate-100 text-slate-300 cursor-not-allowed border-slate-200" 
                      : "bg-slate-900 text-white hover:bg-black hover:scale-[0.98] shadow-slate-200"
                  )}
                >
                   {mode === 'demo' ? 'DEMO LOCKED' : balance.withdrawable < 10 ? 'MIN $10.00 REQUIRED' : 'INITIATE WITHDRAWAL'}
                </button>
             </div>
          </div>
       </div>
    </motion.div>
  );
}

function ContactCard({ title, desc, url, icon: Icon, color = 'white' }: any) {
  return (
    <button onClick={() => window.open(url)} className="group relative overflow-hidden glass rounded-[2.5rem] p-10 border-white/5 text-center transition-all hover:bg-white/5 hover:border-white/20">
       <div className={cn("inline-flex p-5 rounded-3xl mb-6", color === 'primary' ? "bg-primary/10 text-primary" : "bg-white/5 text-white/60")}>
          <Icon size={40} />
       </div>
       <h3 className="text-2xl font-display font-black tracking-tighter mb-3">{title}</h3>
       <p className="text-white/40 font-medium leading-relaxed mb-8">{desc}</p>
       <div className="inline-flex items-center gap-2 font-black text-xs text-primary group-hover:gap-4 transition-all uppercase tracking-widest">
          Join Experience <ChevronRight size={16} />
       </div>
    </button>
  );
}

