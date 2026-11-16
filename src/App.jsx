import { useState } from 'react';
import { loginApi, logoutApi } from './api/auth.api';
import { getChauffeursApi, createChauffeurApi, updateChauffeurStatusApi } from './api/users.api';
import { getCamionsApi, createCamionApi, updateCamionApi, archiveCamionApi } from './api/trucks.api';
import { getMyTrajetsApi } from './api/driver.api';
import LoginForm from './components/LoginForm';
import AppShell from './components/AppShell';
import ProtectedView from './components/ProtectedView';
import AdminLayout from './layouts/AdminLayout';
import DriverLayout from './layouts/DriverLayout';
import UserList from './components/UserList';
import UserForm from './components/UserForm';
import TruckList from './components/TruckList';
import TruckDetails from './components/TruckDetails';
import TruckForm from './components/TruckForm';
import DriverTrips from './components/DriverTrips';

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

    const [trucks, setTrucks] = useState([]);
    const [isTrucksLoading, setIsTrucksLoading] = useState(false);
    const [trucksError, setTrucksError] = useState('');
    const [selectedTruck, setSelectedTruck] = useState(null);
    const [truckFormMode, setTruckFormMode] = useState(null);
    const [isTruckSubmitting, setIsTruckSubmitting] = useState(false);
    const [truckFormError, setTruckFormError] = useState('');
    const [isArchiving, setIsArchiving] = useState(false);

    const [driverTrips, setDriverTrips] = useState([]);
    const [isTripsLoading, setIsTripsLoading] = useState(false);
    const [tripsError, setTripsError] = useState('');

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

    const loadTrucks = async (token) => {
        setIsTrucksLoading(true);
        setTrucksError('');
        try {
            const data = await getCamionsApi(token);
            setTrucks(data);
            setIsTrucksLoading(false);
        } catch (err) {
            setTrucksError(err.message);
            setIsTrucksLoading(false);
        }
    };

    const loadDriverTrips = async (token) => {
        setIsTripsLoading(true);
        setTripsError('');
        try {
            const data = await getMyTrajetsApi(token);
            setDriverTrips(data);
            setIsTripsLoading(false);
        } catch (err) {
            setTripsError(err.message);
            setIsTripsLoading(false);
        }
    };

    const handleLogin = async ({ email, password }) => {
        setIsAuthLoading(true);
        setAuthError('');

        try {
            const data = await loginApi(email, password);
            setSession(data);
            setIsAuthLoading(false);

            const userToken = data.token || data.accessToken;
            if (data.user.role === 'admin') {
                setActiveTab('utilisateurs');
                await loadUsers(userToken);
            } else {
                setActiveTab('trajets');
                await loadDriverTrips(userToken);
            }

            return true;
        } catch (err) {
            setAuthError(err.message);
            setIsAuthLoading(false);
            return false;
        }
    };

    const handleLogout = async () => {
        const token = session?.token || session?.accessToken;
        if (token) {
            await logoutApi(token);
        }
        setSession(null);
        setUsers([]);
        setTrucks([]);
        setDriverTrips([]);
        setSelectedTruck(null);
        setTruckFormMode(null);
        setIsCreatingUser(false);
        setAuthError('');
        setActiveTab('utilisateurs');
    };

    const handleTabChange = async (tab) => {
        setActiveTab(tab);
        const token = session?.token || session?.accessToken;
        if (!token) return;

        if (tab === 'utilisateurs') {
            await loadUsers(token);
        } else if (tab === 'camions') {
            await loadTrucks(token);
        }
    };

    const handleToggleStatus = async (id, currentStatut) => {
        const token = session?.token || session?.accessToken;
        const nextStatut = currentStatut === 'actif' ? 'suspendu' : 'actif';
        try {
            await updateChauffeurStatusApi(token, id, nextStatut);
            await loadUsers(token);
        } catch (err) {
            setUsersError(err.message);
        }
    };

    const handleCreateUser = async (formData) => {
        const token = session?.token || session?.accessToken;
        setIsUserSubmitting(true);
        setCreateUserError('');
        try {
            await createChauffeurApi(token, formData);
            setIsUserSubmitting(false);
            setIsCreatingUser(false);
            await loadUsers(token);
        } catch (err) {
            setCreateUserError(err.message);
            setIsUserSubmitting(false);
        }
    };

    const handleSelectTruck = (truck) => {
        setSelectedTruck(truck);
        setTruckFormMode(null);
    };

    const handleSaveTruck = async (formData) => {
        const token = session?.token || session?.accessToken;
        setIsTruckSubmitting(true);
        setTruckFormError('');

        try {
            if (truckFormMode === 'edit' && selectedTruck) {
                const updated = await updateCamionApi(token, selectedTruck._id || selectedTruck.id, formData);
                setSelectedTruck(updated);
            } else {
                const created = await createCamionApi(token, formData);
                setSelectedTruck(created);
            }
            setIsTruckSubmitting(false);
            setTruckFormMode(null);
            await loadTrucks(token);
        } catch (err) {
            setTruckFormError(err.message);
            setIsTruckSubmitting(false);
        }
    };

    const handleArchiveTruck = async (id) => {
        const token = session?.token || session?.accessToken;
        setIsArchiving(true);
        try {
            await archiveCamionApi(token, id);
            setSelectedTruck(null);
            setIsArchiving(false);
            await loadTrucks(token);
        } catch (err) {
            setTrucksError(err.message);
            setIsArchiving(false);
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

    const currentToken = session.token || session.accessToken;

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
                                        currentUser={session.user}
                                        isLoading={isUsersLoading}
                                        errorMessage={usersError}
                                        onToggleStatus={handleToggleStatus}
                                        onRefresh={() => loadUsers(currentToken)}
                                        onOpenCreateForm={() => setIsCreatingUser(true)}
                                    />
                                )}
                            </div>
                        )}

                        {activeTab === 'camions' && (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2">
                                    <TruckList
                                        trucks={trucks}
                                        selectedTruckId={selectedTruck?._id || selectedTruck?.id}
                                        onSelectTruck={handleSelectTruck}
                                        isLoading={isTrucksLoading}
                                        errorMessage={trucksError}
                                        onRefresh={() => loadTrucks(currentToken)}
                                        onOpenCreate={() => {
                                            setSelectedTruck(null);
                                            setTruckFormMode('create');
                                            setTruckFormError('');
                                        }}
                                    />
                                </div>

                                <div className="space-y-4">
                                    {truckFormMode ? (
                                        <TruckForm
                                            initialData={truckFormMode === 'edit' ? selectedTruck : null}
                                            onSubmit={handleSaveTruck}
                                            onCancel={() => {
                                                setTruckFormMode(null);
                                                setTruckFormError('');
                                            }}
                                            isLoading={isTruckSubmitting}
                                            errorMessage={truckFormError}
                                        />
                                    ) : selectedTruck ? (
                                        <TruckDetails
                                            truck={selectedTruck}
                                            onEdit={() => {
                                                setTruckFormMode('edit');
                                                setTruckFormError('');
                                            }}
                                            onArchive={handleArchiveTruck}
                                            onClose={() => setSelectedTruck(null)}
                                            isArchiving={isArchiving}
                                        />
                                    ) : (
                                        <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl">
                                            <div className="w-10 h-10 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3 text-sm font-semibold">
                                                i
                                            </div>
                                            <p className="text-slate-300 font-medium text-sm">
                                                Aucun camion sélectionné
                                            </p>
                                            <p className="text-slate-500 text-xs mt-1">
                                                Cliquez sur une ligne du tableau pour afficher sa fiche détaillée et ses actions.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </AdminLayout>
                </ProtectedView>
            ) : (
                <DriverLayout user={session.user}>
                    <DriverTrips
                        trips={driverTrips}
                        isLoading={isTripsLoading}
                        errorMessage={tripsError}
                        onRefresh={() => loadDriverTrips(currentToken)}
                    />
                </DriverLayout>
            )}
        </AppShell>
    );
}
