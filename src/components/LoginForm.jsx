import { useState } from 'react';

export default function LoginForm({ onLogin, isLoading, errorMessage }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [localValidation, setLocalValidation] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalValidation('');

        if (!email.trim() || !password.trim()) {
            setLocalValidation('Veuillez renseigner à la fois votre email et votre mot de passe.');
            return;
        }

        const success = await onLogin({ email, password });
        if (success) {
            setPassword('');
        }
    };

    const displayError = localValidation || errorMessage;

    return (
        <div className="w-full max-w-md mx-auto p-6">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-8">
                <div className="flex flex-col items-center mb-8 text-center">
                    <div className="w-14 h-14 bg-blue-600/20 text-blue-400 rounded-2xl flex items-center justify-center font-black text-2xl mb-3 border border-blue-500/30">
                        FT
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">FleetTrackPRO</h1>
                    <p className="text-slate-400 text-sm mt-1">Plateforme de Gestion de Flotte Routière</p>
                </div>

                {displayError && (
                    <div className="mb-6 p-4 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-sm flex items-start gap-3">
                        <span className="font-bold text-base leading-none">!</span>
                        <p className="leading-snug">{displayError}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                    <div>
                        <label 
                            htmlFor="email" 
                            className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2"
                        >
                            Adresse Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            disabled={isLoading}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@flotte.com"
                            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 text-sm"
                        />
                    </div>

                    <div>
                        <label 
                            htmlFor="password" 
                            className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2"
                        >
                            Mot de passe
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            disabled={isLoading}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••••••"
                            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 text-sm"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-2 py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                        {isLoading ? (
                            <>
                                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                <span>Authentification en cours...</span>
                            </>
                        ) : (
                            <span>Se connecter</span>
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-700/60 text-center">
                    <p className="text-xs text-slate-400">
                        Comptes de test : <span className="text-slate-300 font-mono">admin@flotte.com</span> (mdp: <span className="text-slate-300 font-mono">Admin123!</span>)
                    </p>
                </div>
            </div>
        </div>
    );
}
