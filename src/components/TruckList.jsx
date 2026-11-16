import { useState } from 'react';

export default function TruckList({
    trucks,
    selectedTruckId,
    onSelectTruck,
    isLoading,
    errorMessage,
    onRefresh,
    onOpenCreate
}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('tous');

    const filteredTrucks = trucks.filter((truck) => {
        const text = `${truck.matricule || ''} ${truck.marque || ''} ${truck.modele || ''}`.toLowerCase();
        const matchesSearch = text.includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'tous' || truck.statut === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (statut) => {
        switch (statut) {
            case 'disponible':
                return 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30';
            case 'en_mission':
                return 'bg-blue-950/60 text-blue-400 border-blue-500/30';
            case 'maintenance':
                return 'bg-amber-950/60 text-amber-400 border-amber-500/30';
            case 'archive':
                return 'bg-slate-800 text-slate-400 border-slate-700';
            default:
                return 'bg-slate-800 text-slate-300 border-slate-700';
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <div className="flex flex-wrap items-center gap-3 flex-1">
                    <input
                        type="text"
                        placeholder="Rechercher (matricule, marque)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 min-w-[180px]"
                    />

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="tous">Tous les statuts</option>
                        <option value="disponible">Disponible</option>
                        <option value="en_mission">En mission</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="archive">Archivé</option>
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={onRefresh}
                        disabled={isLoading}
                        className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-xl border border-slate-700 transition-all disabled:opacity-50"
                    >
                        {isLoading ? '...' : 'Actualiser'}
                    </button>
                    <button
                        type="button"
                        onClick={onOpenCreate}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center gap-1.5"
                    >
                        <span>+ Nouveau Camion</span>
                    </button>
                </div>
            </div>

            {errorMessage && (
                <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-sm">
                    {errorMessage}
                </div>
            )}

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                {isLoading && trucks.length === 0 ? (
                    <div className="p-10 text-center text-slate-400 text-sm">
                        Chargement de la flotte de camions...
                    </div>
                ) : filteredTrucks.length === 0 ? (
                    <div className="p-10 text-center text-slate-400 text-sm">
                        Aucun camion trouvé pour ces critères.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-300">
                            <thead className="bg-slate-950/60 border-b border-slate-800 text-xs font-semibold uppercase text-slate-400">
                                <tr>
                                    <th className="px-5 py-3.5">Matricule</th>
                                    <th className="px-5 py-3.5">Marque / Modèle</th>
                                    <th className="px-5 py-3.5">Kilométrage</th>
                                    <th className="px-5 py-3.5">Statut</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60">
                                {filteredTrucks.map((truck) => {
                                    const isSelected = selectedTruckId === (truck._id || truck.id);
                                    return (
                                        <tr
                                            key={truck._id || truck.id}
                                            onClick={() => onSelectTruck(truck)}
                                            className={`cursor-pointer transition-colors ${
                                                isSelected
                                                    ? 'bg-blue-900/30 border-l-4 border-blue-500'
                                                    : 'hover:bg-slate-800/40'
                                            }`}
                                        >
                                            <td className="px-5 py-3.5 font-mono font-medium text-white">
                                                {truck.matricule}
                                            </td>
                                            <td className="px-5 py-3.5">
                                                {truck.marque} {truck.modele}
                                            </td>
                                            <td className="px-5 py-3.5 font-mono text-slate-400">
                                                {(truck.kilometrage || 0).toLocaleString()} km
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${getStatusBadge(
                                                        truck.statut
                                                    )}`}
                                                >
                                                    {truck.statut}
                                                </span>
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
