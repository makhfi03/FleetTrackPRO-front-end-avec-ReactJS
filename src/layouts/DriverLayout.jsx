export default function DriverLayout({ user, children }) {
    return (
        <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-2xl flex items-center justify-center font-bold text-lg">
                        {user.prenom ? user.prenom[0] : 'C'}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-bold text-white">
                                {user.prenom} {user.nom}
                            </h2>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-950/70 text-blue-300 border border-blue-500/30 capitalize">
                                {user.role}
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Connecté en tant que conducteur ({user.email})
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        Compte Opérationnel
                    </span>
                </div>
            </div>

            <div>{children}</div>
        </div>
    );
}
