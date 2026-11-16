export default function AppShell({ user, onLogout, children }) {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
            <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600/20 text-blue-400 rounded-xl flex items-center justify-center font-black text-lg border border-blue-500/30">
                            FT
                        </div>
                        <div>
                            <span className="font-bold text-lg text-white tracking-tight">FleetTrackPRO</span>
                            <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 font-mono">
                                v2.0
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium text-white">{user?.nom || user?.email}</p>
                            <p className="text-xs text-slate-400 capitalize">
                                Rôle : <span className="text-blue-400 font-semibold">{user?.role}</span>
                            </p>
                        </div>

                        <span className="w-px h-6 bg-slate-800 hidden sm:block"></span>

                        <button
                            type="button"
                            onClick={onLogout}
                            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-red-950/60 border border-slate-700 hover:border-red-500/50 text-slate-300 hover:text-red-300 text-xs font-medium transition-all"
                        >
                            Déconnexion
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
                {children}
            </main>
        </div>
    );
}
