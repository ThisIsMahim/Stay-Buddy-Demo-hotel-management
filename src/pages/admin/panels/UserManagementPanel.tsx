import React, { useState } from "react";
import { Users, Building2, Ban, Shield, Plus, CheckCircle, RefreshCw, AlertTriangle, BarChart3 } from "lucide-react";
import { api, UserProfile, HotelOwner, Hotel, Booking } from "../../../services/api";
import { Badge, ActionBtn } from "../components/AdminUIElements";
import { AddOwnerModal, OwnerInsightModal } from "../components/AdminModals";

interface UserManagementPanelProps {
    users: (UserProfile | HotelOwner)[];
    hotels: Hotel[];
    bookings: Booking[];
    reload: () => void;
    showAddOwner: boolean;
    setShowAddOwner: (v: boolean) => void;
}

export default function UserManagementPanel({
    users,
    hotels,
    bookings,
    reload,
    showAddOwner,
    setShowAddOwner
}: UserManagementPanelProps) {
    const [roleFilter, setRoleFilter] = useState<"ALL" | "USER" | "OWNER" | "ADMIN">("ALL");
    const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "BLOCKED" | "SUSPENDED">("ALL");
    const [search, setSearch] = useState("");
    const [confirmAction, setConfirmAction] = useState<{ label: string; onConfirm: () => void } | null>(null);
    const [viewingOwner, setViewingOwner] = useState<HotelOwner | null>(null);

    const allUsers = users;

    const filtered = allUsers.filter(u => {
        if (roleFilter !== "ALL" && u.role !== roleFilter) return false;
        if (statusFilter !== "ALL" && u.status !== statusFilter) return false;
        if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    const totalUsers = allUsers.filter(u => u.role === "USER").length;
    const totalOwners = allUsers.filter(u => u.role === "OWNER").length;
    const totalAdmins = allUsers.filter(u => u.role === "ADMIN").length;
    const blocked = allUsers.filter(u => u.status === "BLOCKED").length;
    const pending = allUsers.filter(u => u.role === "OWNER" && (u as HotelOwner).verificationStatus === "PENDING").length;

    const ask = (label: string, fn: () => void) => setConfirmAction({ label, onConfirm: fn });

    return (
        <div className="space-y-10 relative">
            {/* Quick insight row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { label: "End Users", value: totalUsers, color: "indigo", icon: <Users className="w-5 h-5" /> },
                    { label: "Property Owners", value: totalOwners, color: "purple", icon: <Building2 className="w-5 h-5" /> },
                    { label: "Revoked Logs", value: blocked, color: "red", icon: <Ban className="w-5 h-5" /> },
                    { label: "System Admins", value: totalAdmins, color: "amber", icon: <Shield className="w-5 h-5" /> },
                ].map(c => (
                    <div key={c.label} className="bg-slate-900/40 backdrop-blur-xl rounded-xl p-5 border border-white/5 shadow-xl relative overflow-hidden group">
                        <div className="flex justify-between items-center relative z-10">
                            <div>
                                <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">{c.label}</p>
                                <p className="text-3xl font-black text-white bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">{c.value}</p>
                            </div>
                            <div className={`w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform`}>
                                {c.icon}
                            </div>
                        </div>
                    </div>
                ))}
                {/* ADD OWNER BUTTON */}
                <div
                    onClick={() => setShowAddOwner(true)}
                    className="bg-indigo-600/10 backdrop-blur-xl rounded-xl p-5 border border-indigo-500/20 shadow-xl relative overflow-hidden group cursor-pointer hover:bg-indigo-600/20 transition-all flex flex-col items-center justify-center text-center gap-2"
                >
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 group-hover:scale-110 transition-transform">
                        <Plus className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-black text-indigo-400 uppercase tracking-widest mt-1">Register New Owner</p>
                </div>
            </div>

            {/* Floating Control Bar */}
            <div className="bg-slate-900/90 backdrop-blur-2xl p-4 rounded-2xl border border-slate-800 shadow-2xl flex flex-wrap gap-4 items-center relative">
                <div className="flex-1 min-w-[250px] relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search by identity..."
                        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-1 bg-slate-950/50 p-1.5 rounded-xl border border-slate-800">
                    {(["ALL", "USER", "OWNER", "ADMIN"] as const).map(f => (
                        <button key={f} onClick={() => setRoleFilter(f)}
                            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${roleFilter === f ? "bg-indigo-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"}`}>
                            {f}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-1 bg-slate-950/50 p-1.5 rounded-xl border border-slate-800">
                    {(["ALL", "ACTIVE", "BLOCKED", "SUSPENDED"] as const).map(f => (
                        <button key={f} onClick={() => setStatusFilter(f)}
                            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${statusFilter === f ? "bg-indigo-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"}`}>
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            {roleFilter !== "OWNER" && roleFilter !== "ADMIN" && filtered.some(u => u.role === "USER") && (
                <UserSection
                    title="👤 Regular Users"
                    accent="border-blue-500"
                    rows={filtered.filter(u => u.role === "USER")}
                    ask={ask}
                    reload={reload}
                />
            )}

            {roleFilter === "ADMIN" || (roleFilter === "ALL" && filtered.some(u => u.role === "ADMIN")) ? (
                <AdminSection
                    title="🛡️ System Administrators"
                    accent="border-amber-500"
                    rows={filtered.filter(u => u.role === "ADMIN")}
                    ask={ask}
                    reload={reload}
                />
            ) : null}

            {roleFilter !== "USER" && roleFilter !== "ADMIN" && filtered.some(u => u.role === "OWNER") && (
                <OwnerSection
                    title="🏨 Hotel Owners"
                    accent="border-purple-500"
                    rows={filtered.filter(u => u.role === "OWNER") as HotelOwner[]}
                    hotels={hotels}
                    bookings={bookings}
                    ask={ask}
                    reload={reload}
                    onViewInsight={setViewingOwner}
                />
            )}

            {filtered.length === 0 && (
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-16 text-center text-slate-500">
                    No accounts match your filters.
                </div>
            )}

            {/* Confirm Modal */}
            {confirmAction && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center">
                        <p className="text-white font-bold text-lg mb-2">Confirm Action</p>
                        <p className="text-slate-400 text-sm mb-6">{confirmAction.label}</p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setConfirmAction(null)}
                                className="flex-1 border border-slate-700 text-slate-300 py-2 rounded-xl text-sm hover:bg-slate-800"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => { confirmAction.onConfirm(); setConfirmAction(null); }}
                                className="flex-1 bg-red-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-red-700"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Owner Insight / Control Modal */}
            {viewingOwner && (
                <OwnerInsightModal
                    owner={viewingOwner}
                    hotels={hotels.filter(h => h.ownerId === viewingOwner.id)}
                    bookings={bookings}
                    onClose={() => setViewingOwner(null)}
                    ask={ask}
                    reload={reload}
                />
            )}

            {showAddOwner && <AddOwnerModal onClose={() => setShowAddOwner(false)} reload={reload} />}
        </div>
    );
}

function AdminSection({ title, accent, rows, ask, reload }: {
    title: string; accent: string;
    rows: UserProfile[];
    ask: (label: string, fn: () => void) => void;
    reload: () => void;
}) {
    return (
        <div className={`bg-slate-900/40 backdrop-blur-xl rounded-[24px] border border-slate-800 border-t-4 ${accent} overflow-hidden shadow-2xl`}>
            <div className="px-6 py-4 border-b border-slate-800/50 flex items-center justify-between bg-slate-800/20">
                <div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">{title}</h3>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Core System Oversight</p>
                </div>
                <div className="bg-slate-950/50 px-4 py-2 rounded-xl border border-slate-800">
                    <span className="text-amber-400 font-black text-sm">{rows.length}</span>
                    <span className="text-slate-500 text-xs font-bold uppercase ml-2 tracking-widest">Admins</span>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-base min-w-[700px]">
                    <thead className="bg-slate-950/30 text-slate-500 uppercase text-xs font-black tracking-[0.2em]">
                        <tr>
                            <th className="py-5 px-8 text-left">Admin Identity</th>
                            <th className="py-5 px-8 text-center">Status</th>
                            <th className="py-5 px-8 text-center">Privilege Level</th>
                            <th className="py-5 px-8 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {rows.map(u => (
                            <tr key={u.id} className="group hover:bg-slate-800/40 transition-all duration-300">
                                <td className="py-4 px-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-600/20 to-amber-900/20 border border-amber-500/20 flex items-center justify-center text-amber-400 font-black shadow-lg">
                                            {u.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-white text-sm">{u.name}</p>
                                            <p className="text-xs text-slate-500 font-medium font-mono lowercase mt-0.5">{u.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-8 text-center">
                                    <Badge color="green">ACTIVE</Badge>
                                </td>
                                <td className="py-4 px-8 text-center">
                                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-1 inline-block">
                                        <span className="text-amber-500 text-[10px] font-black uppercase tracking-widest">Full Access</span>
                                    </div>
                                </td>
                                <td className="py-4 px-8 text-right">
                                    <ActionBtn
                                        onClick={() => ask(`DEMOTE administrator "${u.name}" to regular User?`, async () => { await api.updateUserRole(u.id, "USER"); reload(); })}
                                        color="slate" label="Demote" icon={<Users className="w-3.5 h-3.5" />}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function UserSection({ title, accent, rows, ask, reload }: {
    title: string; accent: string;
    rows: UserProfile[];
    ask: (label: string, fn: () => void) => void;
    reload: () => void;
}) {
    return (
        <div className={`bg-slate-900/40 backdrop-blur-xl rounded-[24px] border border-slate-800 border-t-4 ${accent} overflow-hidden shadow-2xl`}>
            <div className="px-6 py-4 border-b border-slate-800/50 flex items-center justify-between bg-slate-800/20">
                <div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">{title}</h3>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Platform Security Protocol</p>
                </div>
                <div className="bg-slate-950/50 px-4 py-2 rounded-xl border border-slate-800">
                    <span className="text-indigo-400 font-black text-sm">{rows.length}</span>
                    <span className="text-slate-500 text-xs font-bold uppercase ml-2 tracking-widest">Entities</span>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-base min-w-[700px]">
                    <thead className="bg-slate-950/30 text-slate-500 uppercase text-xs font-black tracking-[0.2em]">
                        <tr>
                            <th className="py-5 px-8 text-left">Endpoint Identity</th>
                            <th className="py-5 px-8 text-center">Status</th>
                            <th className="py-5 px-8 text-center">Entry Date</th>
                            <th className="py-5 px-8 text-right">Oversight Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {rows.map(u => (
                            <tr key={u.id} className={`group hover:bg-slate-800/40 transition-all duration-300 hover:scale-[1.002] ${u.status === "BLOCKED" ? "opacity-50" : ""}`}>
                                <td className="py-4 px-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-800 to-slate-950 border border-white/5 flex items-center justify-center text-indigo-400 font-black shadow-lg group-hover:scale-110 transition-transform text-sm">
                                            {u.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-white text-sm">{u.name}</p>
                                            <p className="text-xs text-slate-500 font-medium font-mono lowercase mt-0.5">{u.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-8 text-center">
                                    <Badge color={u.status === "ACTIVE" ? "green" : u.status === "BLOCKED" ? "red" : "amber"}>
                                        {u.status}
                                    </Badge>
                                </td>
                                <td className="py-4 px-8 text-center">
                                    <p className="text-slate-400 font-bold text-xs">{new Date(u.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                </td>
                                <td className="py-4 px-8">
                                    <div className="flex justify-end gap-1.5">
                                        <ActionBtn
                                            onClick={() => ask(`PROMOTE "${u.name}" to SYSTEM ADMIN?`, async () => { await api.updateUserRole(u.id, "ADMIN"); reload(); })}
                                            color="amber" label="Promote" icon={<Shield className="w-3.5 h-3.5" />}
                                        />
                                        {u.status === "BLOCKED" ? (
                                            <ActionBtn
                                                onClick={() => ask(`Restore access for "${u.name}"?`, async () => { await api.updateUserStatus(u.id, "ACTIVE"); reload(); })}
                                                color="green" label="Restore" icon={<CheckCircle className="w-3.5 h-3.5" />}
                                            />
                                        ) : (
                                            <>
                                                <ActionBtn
                                                    onClick={() => ask(`Permanently revoke access for "${u.name}"?`, async () => { await api.updateUserStatus(u.id, "BLOCKED"); reload(); })}
                                                    color="red" label="Revoke" icon={<Ban className="w-3.5 h-3.5" />}
                                                />
                                                {u.status === "SUSPENDED" ? (
                                                    <ActionBtn onClick={async () => { await api.updateUserStatus(u.id, "ACTIVE"); reload(); }} color="slate" label="Lift" icon={<RefreshCw className="w-3.5 h-3.5" />} />
                                                ) : (
                                                    <ActionBtn onClick={() => ask(`Suspend account "${u.name}"?`, async () => { await api.updateUserStatus(u.id, "SUSPENDED"); reload(); })} color="amber" label="Hold" icon={<AlertTriangle className="w-3.5 h-3.5" />} />
                                                )}
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {rows.length === 0 && (
                            <tr>
                                <td colSpan={4} className="py-20 text-center">
                                    <Users className="w-12 h-12 text-slate-800 mx-auto mb-4" />
                                    <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">No Endpoints Detected</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div >
    );
}

function OwnerSection({ title, accent, rows, hotels, bookings, ask, reload, onViewInsight }: {
    title: string; accent: string;
    rows: HotelOwner[];
    hotels: Hotel[];
    bookings: Booking[];
    ask: (label: string, fn: () => void) => void;
    reload: () => void;
    onViewInsight: (owner: HotelOwner) => void;
}) {
    return (
        <div className={`bg-slate-900/40 backdrop-blur-xl rounded-[24px] border border-slate-800 border-t-4 ${accent} overflow-hidden shadow-2xl`}>
            <div className="px-6 py-4 border-b border-slate-800/50 flex items-center justify-between bg-slate-800/20">
                <div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">{title}</h3>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Property Stakeholder Registry</p>
                </div>
                <div className="bg-slate-950/50 px-4 py-2 rounded-xl border border-slate-800">
                    <span className="text-purple-400 font-black text-sm">{rows.length}</span>
                    <span className="text-slate-500 text-xs font-bold uppercase ml-2 tracking-widest">Operators</span>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-base min-w-[1000px]">
                    <thead className="bg-slate-950/30 text-slate-500 uppercase text-xs font-black tracking-[0.2em]">
                        <tr>
                            <th className="py-6 px-8 text-left">Stakeholder</th>
                            <th className="py-6 px-8 text-center">Asset Load</th>
                            <th className="py-6 px-8 text-center">Flow Volume</th>
                            <th className="py-6 px-8 text-center">Trust Status</th>
                            <th className="py-6 px-8 text-center">Node State</th>
                            <th className="py-6 px-8 text-right">Operational Control</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {rows.map(owner => {
                            const oHotels = hotels.filter(h => h.ownerId === owner.id);
                            const aHotels = oHotels.filter(h => h.isActive).length;
                            const oHotelIds = oHotels.map(h => h.id);
                            const tBookings = bookings.filter(b => oHotelIds.includes(b.hotelId)).length;

                            return (
                                <tr key={owner.id} className={`group hover:bg-slate-800/30 transition-colors ${owner.status === "BLOCKED" ? "opacity-50" : ""}`}>
                                    <td className="py-4 px-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-800/20 to-purple-900/20 border border-purple-500/20 flex items-center justify-center text-purple-400 font-black shadow-lg group-hover:scale-110 transition-transform text-sm">
                                                {owner.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-white text-sm">{owner.name}</p>
                                                <p className="text-xs text-slate-500 font-medium font-mono lowercase mt-0.5">{owner.email}</p>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="py-4 px-8 text-center text-white font-black text-base">
                                        {aHotels}
                                        <span className="text-slate-600 text-xs ml-2 font-bold italic">/ {oHotels.length}</span>
                                    </td>

                                    <td className="py-4 px-8 text-center">
                                        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg py-1 px-3 inline-block">
                                            <span className="text-indigo-400 font-black text-sm">{tBookings}</span>
                                        </div>
                                    </td>

                                    <td className="py-4 px-8 text-center">
                                        <Badge color={owner.verificationStatus === "VERIFIED" ? "green" : owner.verificationStatus === "REJECTED" ? "red" : "amber"}>
                                            {owner.verificationStatus === "VERIFIED" ? "TRUSTED" : owner.verificationStatus === "REJECTED" ? "REVOKED" : "PENDING"}
                                        </Badge>
                                    </td>

                                    <td className="py-4 px-8 text-center">
                                        <Badge color={owner.status === "ACTIVE" ? "green" : owner.status === "BLOCKED" ? "red" : "amber"}>
                                            {owner.status}
                                        </Badge>
                                    </td>

                                    <td className="py-4 px-8">
                                        <div className="flex justify-end gap-1.5">
                                            <ActionBtn
                                                onClick={() => ask(`PROMOTE owner "${owner.name}" to SYSTEM ADMIN?`, async () => { await api.updateUserRole(owner.id, "ADMIN"); reload(); })}
                                                color="amber" label="Promote" icon={<Shield className="w-3 h-3" />}
                                            />
                                            <button
                                                onClick={() => onViewInsight(owner)}
                                                className="p-1.5 rounded-lg bg-indigo-600/10 border border-white/5 text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all shadow-md group/btn"
                                            >
                                                <BarChart3 className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
                                            </button>

                                            {owner.status === "BLOCKED" ? (
                                                <ActionBtn onClick={() => ask(`Unblock owner "${owner.name}"?`, async () => { await api.updateUserStatus(owner.id, "ACTIVE"); reload(); })} color="green" label="Enable" icon={<CheckCircle className="w-3 h-3" />} />
                                            ) : (
                                                <ActionBtn onClick={() => ask(`Block owner "${owner.name}"? All associated hotels will be taken offline.`, async () => { await api.updateUserStatus(owner.id, "BLOCKED"); reload(); })} color="red" label="Disable" icon={<Ban className="w-3 h-3" />} />
                                            )}

                                            {owner.verificationStatus === "PENDING" && (
                                                <ActionBtn onClick={() => ask(`Approve credentials for "${owner.name}"?`, async () => { await api.updateVerificationStatus(owner.id, "VERIFIED"); reload(); })} color="emerald" label="Approve" icon={<CheckCircle className="w-3 h-3" />} />
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {rows.length === 0 && (
                            <tr>
                                <td colSpan={6} className="py-20 text-center">
                                    <Building2 className="w-12 h-12 text-slate-800 mx-auto mb-4" />
                                    <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">No Asset Registry Found</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
