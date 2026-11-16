export default function DriverTrips({ trips, isLoading, errorMessage, onRefresh }) {
    const getStatusBadge = (statut) => {
        switch (statut) {
            case 'cree':
                return 'bg-blue-950/60 text-blue-400 border-blue-500/30';
            case 'en_cours':
                return 'bg-amber-950/60 text-amber-400 border-amber-500/30';
            case 'termine':
                return 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30';
            case 'annule':
                return 'bg-red-950/60 text-red-400 border-red-500/30';
            default:
                return 'bg-slate-800 text-slate-400 border-slate-700';
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <div>
                    <h3 className="text-base font-bold text-white">Missions & Trajets assignés</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                        Consultez la liste des trajets planifiés et en cours qui vous sont attribués.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onRefresh}
                    disabled={isLoading}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 transition-all disabled:opacity-50"
                >
                    {isLoading ? 'Actualisation...' : 'Actualiser mes trajets'}
                </button>
            </div>

            {errorMessage && (
                <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-sm">
                    {errorMessage}
                </div>
            )}

            {isLoading && trips.length === 0 ? (
                <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 text-sm">
                    Chargement de vos trajets...
                </div>
            ) : trips.length === 0 ? (
                <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                    <p className="text-white font-medium text-sm">Aucun trajet assigné</p>
                    <p className="text-slate-400 text-xs">
                        Vous n'avez aucune mission active ou planifiée pour le moment.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {trips.map((trajet) => {
                        const camionInfo = trajet.camion
                            ? `${trajet.camion.matricule} (${trajet.camion.marque} ${trajet.camion.modele})`
                            : 'Véhicule non spécifié';

                        return (
                            <div
                                key={trajet._id || trajet.id}
                                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition-all"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                                            Itinéraire
                                        </span>
                                        <h4 className="text-base font-bold text-white mt-0.5 flex items-center gap-2">
                                            <span>{trajet.siteDepart}</span>
                                            <span className="text-slate-500">→</span>
                                            <span>{trajet.siteArrivee}</span>
                                        </h4>
                                    </div>

                                    <span
                                        className={`px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${getStatusBadge(
                                            trajet.statut
                                        )}`}
                                    >
                                        {trajet.statut}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
                                    <div>
                                        <p className="text-slate-500">Marchandise</p>
                                        <p className="font-medium text-slate-200 mt-0.5">{trajet.marchandise || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500">Camion assigné</p>
                                        <p className="font-medium text-slate-200 font-mono mt-0.5">{camionInfo}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500">Départ prévu</p>
                                        <p className="font-medium text-slate-300 mt-0.5">
                                            {trajet.dateDebut ? new Date(trajet.dateDebut).toLocaleDateString() : '-'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500">Arrivée prévue</p>
                                        <p className="font-medium text-slate-300 mt-0.5">
                                            {trajet.dateFin ? new Date(trajet.dateFin).toLocaleDateString() : '-'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
