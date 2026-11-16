import { useState } from 'react';

export default function TruckForm({
    initialData,
    onSubmit,
    onCancel,
    isLoading,
    errorMessage
}) {
    const isEdit = Boolean(initialData);

    const [matricule, setMatricule] = useState(initialData?.matricule || '');
    const [marque, setMarque] = useState(initialData?.marque || '');
    const [modele, setModele] = useState(initialData?.modele || '');
    const [kilometrage, setKilometrage] = useState(initialData?.kilometrage ?? 0);
    const [statut, setStatut] = useState(initialData?.statut || 'disponible');

    const [localError, setLocalError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError('');

        if (!matricule.trim() || !marque.trim() || !modele.trim()) {
            setLocalError('Veuillez renseigner le matricule, la marque et le modèle.');
            return;
        }

        const payload = {
            matricule: matricule.trim(),
            marque: marque.trim(),
            modele: modele.trim(),
            kilometrage: Number(kilometrage) || 0,
            statut
        };

        await onSubmit(payload);
    };

    const errorToShow = localError || errorMessage;

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                <h3 className="text-lg font-bold text-white">
                    {isEdit ? `Modifier le Camion : ${initialData.matricule}` : 'Nouveau Camion'}
                </h3>
                <button
                    type="button"
                    onClick={onCancel}
                    className="text-slate-400 hover:text-white text-sm"
                >
                    ✕
                </button>
            </div>

            {errorToShow && (
                <div className="mb-4 p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs">
                    {errorToShow}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                        Matricule *
                    </label>
                    <input
                        type="text"
                        required
                        disabled={isEdit}
                        value={matricule}
                        onChange={(e) => setMatricule(e.target.value)}
                        placeholder="Ex: 12345-A-26"
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed font-mono"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                            Marque *
                        </label>
                        <input
                            type="text"
                            required
                            value={marque}
                            onChange={(e) => setMarque(e.target.value)}
                            placeholder="Ex: Volvo"
                            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                            Modèle *
                        </label>
                        <input
                            type="text"
                            required
                            value={modele}
                            onChange={(e) => setModele(e.target.value)}
                            placeholder="Ex: FH16"
                            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                            Kilométrage (km)
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={kilometrage}
                            onChange={(e) => setKilometrage(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                            Statut
                        </label>
                        <select
                            value={statut}
                            onChange={(e) => setStatut(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="disponible">Disponible</option>
                            <option value="en_mission">En mission</option>
                            <option value="maintenance">Maintenance</option>
                            <option value="archive">Archivé</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-medium transition-all"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-xl shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50"
                    >
                        {isLoading ? 'Enregistrement...' : isEdit ? 'Mettre à jour' : 'Créer le camion'}
                    </button>
                </div>
            </form>
        </div>
    );
}
