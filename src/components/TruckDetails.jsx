export default function TruckDetails({
    truck,
    onEdit,
    onArchive,
    onClose,
    isArchiving
}) {
    if (!truck) return null;

    const handleConfirmArchive = () => {
        const confirm = window.confirm(
            `Êtes-vous sûr de vouloir archiver le camion matricule ${truck.matricule} ?`
        );
        if (confirm) {
            onArchive(truck._id || truck.id);
        }
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
                <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                        Fiche Véhicule
                    </span>
                    <h3 className="text-xl font-bold font-mono text-white mt-0.5">
                        {truck.matricule}
                    </h3>
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    className="text-slate-400 hover:text-white text-sm"
                >
                    ✕
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                    <p className="text-xs text-slate-400">Marque</p>
                    <p className="font-semibold text-white mt-0.5">{truck.marque}</p>
                </div>

                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                    <p className="text-xs text-slate-400">Modèle</p>
                    <p className="font-semibold text-white mt-0.5">{truck.modele}</p>
                </div>

                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                    <p className="text-xs text-slate-400">Kilométrage</p>
                    <p className="font-semibold font-mono text-white mt-0.5">
                        {(truck.kilometrage || 0).toLocaleString()} km
                    </p>
                </div>

                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                    <p className="text-xs text-slate-400">Statut actuel</p>
                    <p className="font-semibold text-white capitalize mt-0.5">
                        {truck.statut}
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                {truck.statut !== 'archive' && (
                    <button
                        type="button"
                        onClick={handleConfirmArchive}
                        disabled={isArchiving}
                        className="px-4 py-2 border border-red-500/40 text-red-300 hover:bg-red-950/50 rounded-xl text-xs font-medium transition-all disabled:opacity-50"
                    >
                        {isArchiving ? 'Archivage...' : 'Archiver'}
                    </button>
                )}

                <button
                    type="button"
                    onClick={() => onEdit(truck)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-medium transition-all shadow-md shadow-blue-600/20"
                >
                    Modifier la fiche
                </button>
            </div>
        </div>
    );
}
