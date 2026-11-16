export default function AdminLayout({ activeTab, onSelectTab, children }) {
    return (
        <div className="space-y-6">
            <div className="flex border-b border-slate-800 gap-2">
                <button
                    type="button"
                    onClick={() => onSelectTab('utilisateurs')}
                    className={`px-5 py-3 text-sm font-semibold rounded-t-xl transition-all border-b-2 ${
                        activeTab === 'utilisateurs'
                            ? 'text-blue-400 border-blue-500 bg-slate-900/60'
                            : 'text-slate-400 border-transparent hover:text-white hover:bg-slate-900/30'
                    }`}
                >
                    Chauffeurs & Utilisateurs
                </button>
                <button
                    type="button"
                    onClick={() => onSelectTab('camions')}
                    className={`px-5 py-3 text-sm font-semibold rounded-t-xl transition-all border-b-2 ${
                        activeTab === 'camions'
                            ? 'text-blue-400 border-blue-500 bg-slate-900/60'
                            : 'text-slate-400 border-transparent hover:text-white hover:bg-slate-900/30'
                    }`}
                >
                    Parc de Camions
                </button>
            </div>

            <div>{children}</div>
        </div>
    );
}
