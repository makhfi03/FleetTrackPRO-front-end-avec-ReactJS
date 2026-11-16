export default function ProtectedView({ role, allowedRoles, children }) {
    const isAllowed = allowedRoles.includes(role);

    if (!isAllowed) {
        return (
            <div className="p-8 text-center bg-red-950/30 border border-red-500/40 rounded-2xl max-w-lg mx-auto mt-10">
                <div className="w-12 h-12 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4 border border-red-500/40">
                    !
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Accès refusé</h3>
                <p className="text-sm text-slate-300">
                    Votre rôle actuel (<span className="font-semibold text-red-400">{role}</span>) ne vous autorise pas à accéder à cette section.
                </p>
            </div>
        );
    }

    return children;
}
