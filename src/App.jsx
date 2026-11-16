import { useState } from 'react';
import { loginApi, logoutApi } from './api/auth.api';
import { getChauffeursApi, createChauffeurApi, updateChauffeurStatusApi } from './api/users.api';
import LoginForm from './components/LoginForm';
import AppShell from './components/AppShell';
import ProtectedView from './components/ProtectedView';
import AdminLayout from './layouts/AdminLayout';
import UserList from './components/UserList';
import UserForm from './components/UserForm';

export default function App() {
    const [session, setSession] = useState(null);
    const [isAuthLoading, setIsAuthLoading] = useState(false);
    const [authError, setAuthError] = useState('');

    const [activeTab, setActiveTab] = useState('utilisateurs');

    const [users, setUsers] = useState([]);
    const [isUsersLoading, setIsUsersLoading] = useState(false);
    const [usersError, setUsersError] = useState('');

    const [isCreatingUser, setIsCreatingUser] = useState(false);
    const [isUserSubmitting, setIsUserSubmitting] = useState(false);
    const [createUserError, setCreateUserError] = useState('');

    const loadUsers = async (token) => {
        setIsUsersLoading(true);
        setUsersError('');
        try {
            const data = await getChauffeursApi(token);
            setUsers(data);
            setIsUsersLoading(false);
        } catch (err) {
            setUsersError(err.message);
            setIsUsersLoading(false);
        }
    };

    const handleLogin = async ({ email, password }) => {
        setIsAuthLoading(true);
        setAuthError('');

        try {
            const data = await loginApi(email, password);
            setSession(data);
            setIsAuthLoading(false);

            if (data.user.role === 'admin') {
                setActiveTab('utilisateurs');
                await loadUsers(data.token);
            } else {
                setActiveTab('trajets');
            }

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
        setUsers([]);
        setIsCreatingUser(false);
        setAuthError('');
        setActiveTab('utilisateurs');
    };

    const handleTabChange = async (tab) => {
        setActiveTab(tab);
        if (tab === 'utilisateurs' && session?.token) {
            await loadUsers(session.token);
        }
    };

    const handleToggleStatus = async (id, currentStatut) => {
        const nextStatut = currentStatut === 'actif' ? 'suspendu' : 'actif';
        try {
            await updateChauffeurStatusApi(session.token, id, nextStatut);
            await loadUsers(session.token);
        } catch (err) {
            setUsersError(err.message);
        }
    };

    const handleCreateUser = async (formData) => {
        setIsUserSubmitting(true);
        setCreateUserError('');
        try {
            await createChauffeurApi(session.token, formData);
            setIsUserSubmitting(false);
            setIsCreatingUser(false);
            await loadUsers(session.token);
        } catch (err) {
            setCreateUserError(err.message);
            setIsUserSubmitting(false);
        }
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
            {session.user.role === 'admin' ? (
                <ProtectedView role={session.user.role} allowedRoles={['admin']}>
                    <AdminLayout activeTab={activeTab} onSelectTab={handleTabChange}>
                        {activeTab === 'utilisateurs' && (
                            <div className="space-y-6">
                                {isCreatingUser ? (
                                    <UserForm
                                        onSubmit={handleCreateUser}
                                        onCancel={() => {
                                            setIsCreatingUser(false);
                                            setCreateUserError('');
                                        }}
                                        isLoading={isUserSubmitting}
                                        errorMessage={createUserError}
                                    />
                                ) : (
                                    <UserList
                                        users={users}
                                        isLoading={isUsersLoading}
                                        errorMessage={usersError}
                                        onToggleStatus={handleToggleStatus}
                                        onRefresh={() => loadUsers(session.token)}
                                        onOpenCreateForm={() => setIsCreatingUser(true)}
                                    />
                                )}
                            </div>
                        )}

                        {activeTab === 'camions' && (
                            <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl">
                                <p className="text-slate-400 text-sm">
                                    Section Parc de Camions (sera intégrée dans la prochaine étape US05).
                                </p>
                            </div>
                        )}
                    </AdminLayout>
                </ProtectedView>
            ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-2">Espace Chauffeur</h3>
                    <p className="text-slate-400 text-sm">
                        Bienvenue dans votre espace Chauffeur. L'accès aux données administrateur est restreint.
                    </p>
                </div>
            )}
        </AppShell>
    );
}
