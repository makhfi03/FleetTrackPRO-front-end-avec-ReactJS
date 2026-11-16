import { useState } from 'react';

export default function UserForm({ onSubmit, onCancel, isLoading, errorMessage }) {
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [email, setEmail] = useState('');
    const [motDePasse, setMotDePasse] = useState('');
    const [telephone, setTelephone] = useState('');
    const [localError, setLocalError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError('');

        if (!nom.trim() || !prenom.trim() || !email.trim() || !motDePasse.trim()) {
            setLocalError('Veuillez remplir tous les champs obligatoires.');
            return;
        }

        if (motDePasse.length < 6) {
            setLocalError('Le mot de passe doit comporter au moins 6 caractères.');
            return;
        }

        await onSubmit({
            nom: nom.trim(),
            prenom: prenom.trim(),
            email: email.trim(),
            motDePasse: motDePasse.trim(),
            telephone: telephone.trim() || undefined
        });
    };

    const errorToShow = localError || errorMessage;

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-xl mx-auto">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
                <h3 className="text-lg font-bold text-white">Nouveau Chauffeur</h3>
                <button
                    type="button"
                    onClick={onCancel}
                    className="text-slate-400 hover:text-white text-sm"
                >
                    Annuler
                </button>
            </div>

            {errorToShow && (
                <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-sm">
                    {errorToShow}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                            Nom *
                        </label>
                        <input
                            type="text"
                            required
                            value={nom}
                            onChange={(e) => setNom(e.target.value)}
                            placeholder="Ex: Benali"
                            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                            Prénom *
                        </label>
                        <input
                            type="text"
                            required
                            value={prenom}
                            onChange={(e) => setPrenom(e.target.value)}
                            placeholder="Ex: Youssef"
                            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                        Adresse Email *
                    </label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="youssef.benali@flotte.com"
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                        Mot de passe provisoire * (min. 6 caractères)
                    </label>
                    <input
                        type="password"
                        required
                        value={motDePasse}
                        onChange={(e) => setMotDePasse(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                        Téléphone (optionnel)
                    </label>
                    <input
                        type="tel"
                        value={telephone}
                        onChange={(e) => setTelephone(e.target.value)}
                        placeholder="0612345678"
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-sm font-medium transition-all"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        {isLoading ? 'Création en cours...' : 'Enregistrer le chauffeur'}
                    </button>
                </div>
            </form>
        </div>
    );
}
