import { useState } from 'react';

export default function UserList({
    users,
    isLoading,
    errorMessage,
    onToggleStatus,
    onRefresh,
    onOpenCreateForm
}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('tous');

    const filteredUsers = users.filter((u) => {
        const fullName = `${u.prenom || ''} ${u.nom || ''}`.toLowerCase();
        const email = (u.email || '').toLowerCase();
        const term = searchTerm.toLowerCase();

        const matchText = fullName.includes(term) || email.includes(term);
        const matchStatus = statusFilter === 'tous' || u.statut === statusFilter;

        return matchText && matchStatus;
    });

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <div className="flex flex-wrap items-center gap-3 flex-1">
                    <input
                        type="text"
                        placeholder="Rechercher par nom ou email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 min-w-[200px]"
                    />

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="tous">Tous les statuts</option>
                        <option value="actif">Actif</option>
                        <option value="suspendu">Suspendu</option>
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={onRefresh}
                        disabled={isLoading}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-xl border border-slate-700 transition-all disabled:opacity-50"
                    >
                        {isLoading ? 'Chargement...' : 'Actualiser'}
                    </button>

                    <button
                        type="button"
                        onClick={onOpenCreateForm}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2"
                    >
                        <span>+ Nouveau Chauffeur</span>
                    </button>
                </div>
            </div>

            {errorMessage && (
                <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-sm">
                    {errorMessage}
                </div>
            )}

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                {isLoading && users.length === 0 ? (
                    <div className="p-12 text-center text-slate-400 text-sm">
                        Chargement de la liste des chauffeurs...
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="p-12 text-center text-slate-400 text-sm">
                        Aucun utilisateur ne correspond à vos critères.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-300">
                            <thead className="bg-slate-950/60 border-b border-slate-800 text-xs font-semibold uppercase text-slate-400">
                                <tr>
                                    <th className="px-6 py-4">Chauffeur</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Téléphone</th>
                                    <th className="px-6 py-4">Statut</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60">
                                {filteredUsers.map((user) => {
                                    const isActif = user.statut === 'actif';
                                    return (
                                        <tr key={user._id || user.id} className="hover:bg-slate-800/40 transition-colors">
                                            <td className="px-6 py-4 font-medium text-white">
                                                {user.prenom} {user.nom}
                                            </td>
                                            <td className="px-6 py-4 text-slate-300">
                                                {user.email}
                                            </td>
                                            <td className="px-6 py-4 text-slate-400">
                                                {user.telephone || '-'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                                                        isActif
                                                            ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30'
                                                            : 'bg-red-950/60 text-red-400 border-red-500/30'
                                                    }`}
                                                >
                                                    {isActif ? 'Actif' : 'Suspendu'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => onToggleStatus(user._id || user.id, user.statut)}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                                                        isActif
                                                            ? 'border-red-500/40 text-red-300 hover:bg-red-950/50'
                                                            : 'border-emerald-500/40 text-emerald-300 hover:bg-emerald-950/50'
                                                    }`}
                                                >
                                                    {isActif ? 'Suspendre' : 'Réactiver'}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
