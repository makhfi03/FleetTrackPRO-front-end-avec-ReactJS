import { useState } from 'react';
import { loginApi, logoutApi } from './api/auth.api';
import LoginForm from './components/LoginForm';
import AppShell from './components/AppShell';

export default function App() {
    const [session, setSession] = useState(null);
    const [isAuthLoading, setIsAuthLoading] = useState(false);
    const [authError, setAuthError] = useState('');
    const [activeTab, setActiveTab] = useState('utilisateurs');

    const handleLogin = async ({ email, password }) => {
        setIsAuthLoading(true);
        setAuthError('');

        try {
            const data = await loginApi(email, password);
            setSession(data);
            setActiveTab(data.user.role === 'admin' ? 'utilisateurs' : 'trajets');
            setIsAuthLoading(false);
            return true;
        } catch (err) {
            setAuthError(err.message);
            setIsAuthLoading(false);
            return false;
        }
    };

    const handleLogout = async () => {
        if (session?.token) {
            await logoutApi(session.token);
        }
        setSession(null);
        setAuthError('');
        setActiveTab('utilisateurs');
    };

    if (!session) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
                <LoginForm
                    onLogin={handleLogin}
                    isLoading={isAuthLoading}
                    errorMessage={authError}
                />
            </div>
        );
    }

    return (
        <AppShell user={session.user} onLogout={handleLogout}>
            <div className="space-y-6">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-white mb-1">
                        Bienvenue, {session.user.nom || session.user.email} !
                    </h2>
                    <p className="text-slate-400 text-sm">
                        Session active avec le rôle <span className="text-blue-400 font-semibold">{session.user.role}</span>.
                    </p>
                </div>

                <div className="bg-slate-900/50 border border-dashed border-slate-800 rounded-2xl p-8 text-center">
                    <p className="text-slate-400 text-sm">
                        Écran connecté prêt. Prochaine étape : intégration des Layouts Admin & Chauffeur.
                    </p>
                </div>
            </div>
        </AppShell>
    );
}
