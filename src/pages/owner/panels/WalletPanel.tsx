import React from "react";
import { TrendingUp, Wallet, CheckCircle2 } from "lucide-react";
import { Badge } from "../components/OwnerUI";

interface WalletPanelProps {
    wallet: any;
}

const WalletPanel = ({
    wallet
}: WalletPanelProps) => {
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 rounded-[32px] shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-[80px] -mr-40 -mt-40 group-hover:scale-110 transition-transform duration-1000" />
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <p className="text-white/60 font-black text-[11px] uppercase tracking-[0.4em] mb-2">Wallet Balance</p>
                                <h2 className="text-4xl font-black text-white tracking-tighter tabular-nums mb-5 flex items-baseline gap-2">
                                    <span className="text-2xl opacity-60">৳</span>{wallet?.totalBalance.toLocaleString()}
                                </h2>
                            </div>
                            <div className="flex gap-3">
                                <button className="bg-white text-indigo-600 px-6 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition shadow-xl active:scale-95 disabled:opacity-50" disabled>Initiate Payout</button>
                                <button className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-6 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/20 transition active:scale-95">Refresh</button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900/40 backdrop-blur-md p-6 rounded-[32px] border border-slate-800 shadow-2xl">
                        <h3 className="text-lg font-black text-white uppercase tracking-tight mb-6">Transaction History</h3>
                        <div className="space-y-1">
                            {wallet?.transactions.map((tx: any) => (
                                <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-white/[0.02] rounded-2xl transition-all group border border-transparent hover:border-slate-800">
                                    <div className="flex items-center gap-6">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tx.type === "CREDIT" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
                                            {tx.type === "CREDIT" ? <TrendingUp className="w-5 h-5" /> : <Wallet className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <p className="text-white font-black text-sm uppercase tracking-tight">{tx.description}</p>
                                            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest mt-1.5">{new Date(tx.createdAt).toLocaleDateString()} · Hash {tx.id.slice(0, 8)}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-black text-sm tabular-nums ${tx.type === "CREDIT" ? "text-emerald-400" : "text-rose-400"}`}>
                                            {tx.type === "CREDIT" ? "+" : "-"} ৳{tx.amount.toLocaleString()}
                                        </p>
                                        <Badge color={tx.type === "CREDIT" ? "green" : "rose"}>{tx.type}</Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-slate-900/40 backdrop-blur-md p-6 rounded-[32px] border border-slate-800 shadow-2xl">
                        <h3 className="text-base font-black text-white uppercase tracking-tight mb-6">Subscription</h3>
                        <div className="space-y-5">
                            <div className="p-6 bg-slate-950/50 rounded-2xl border border-slate-800 border-l-4 border-l-indigo-600">
                                <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Current Tier</p>
                                <p className="text-white font-black text-xl uppercase tracking-tighter leading-tight">Reservation bd Prime</p>
                                <div className="flex justify-between items-end mt-8">
                                    <div>
                                        <p className="text-[11px] text-slate-500 font-black uppercase tracking-widest">Expires In</p>
                                        <p className="text-indigo-400 font-black text-base uppercase">21 Days</p>
                                    </div>
                                    <button className="text-xs bg-indigo-600 text-white font-black uppercase tracking-widest px-5 py-2.5 rounded-xl transition-all">Extend</button>
                                </div>
                            </div>

                            <div className="space-y-3.5">
                                <p className="text-[11px] font-black text-slate-600 uppercase tracking-[0.2em]">Plan Features</p>
                                {[
                                    "Unlimited Rooms",
                                    "Advanced Analytics",
                                    "Direct Payout",
                                    "24/7 Priority Support"
                                ].map((p, i) => (
                                    <div key={i} className="flex items-center gap-2.5 text-slate-400 text-[10px] font-medium">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {p}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WalletPanel;
