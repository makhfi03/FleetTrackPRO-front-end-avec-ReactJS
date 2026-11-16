# FleetTrackPRO — Frontend ReactJS (Sprint 3)

Interface web moderne développée avec **React 19** et **Tailwind CSS**, connectée à l'API REST de gestion de flotte routière **FleetTrackPRO**.

---

## 1. Installation et Lancement

### Prérequis
- Node.js (v18+)
- Backend FleetTrackPRO actif sur le port `5001` (`http://localhost:5001`)

### Commandes
```bash
# 1. Cloner et installer les dépendances
git clone https://github.com/makhfi03/FleetTrackPRO-front-end-avec-ReactJS.git
cd FleetTrackPRO-front-end-avec-ReactJS
npm install

# 2. Lancer le serveur de développement Vite
npm run dev

# 3. Construire pour la production
npm run build
```
L'application est accessible par défaut sur `http://localhost:5173`.

---

## 2. Fiche de Contrat d'Intégration Backend

| Point à relever | Spécification réelle de l'API |
| :--- | :--- |
| **Base URL** | `http://localhost:5001/api/v1` |
| **CORS** | Autorisé pour `http://localhost:5173` sur le serveur Express |
| **Authentification** | `POST /api/v1/auth/login` (Body JSON : `{ email, motDePasse }`) |
| **Session & Token** | JWT Bearer transporté via l'en-tête `Authorization: Bearer <token>`. Session conservée **strictement en mémoire** (state React) conformément aux exigences de sécurité |
| **Identité & Rôles** | Champ `role` présent dans l'objet utilisateur (`admin` ou `chauffeur`) |
| **Déconnexion** | `POST /api/v1/auth/logout` + purge de l'état en mémoire côté client |
| **Gestion Utilisateurs** | `GET /api/v1/chauffeurs` (liste Admin), `POST /api/v1/chauffeurs` (création), `PATCH /api/v1/chauffeurs/:id/status` (suspension/réactivation) |
| **Gestion Camions** | `GET /api/v1/camions` (liste), `POST /api/v1/camions` (création Admin), `PUT /api/v1/camions/:id` (édition Admin), `DELETE /api/v1/camions/:id` (archivage Admin) |
| **Espace Chauffeur** | `GET /api/v1/chauffeur/trajets` (récupère uniquement les trajets du chauffeur connecté) |
| **Format des erreurs** | JSON standardisé `{ status: 'fail' \| 'error', message: '...' }` pour 400, 401, 403, 404, 409, 429 |

---

## 3. Schémas JSON de l'API

### Connexion (`POST /api/v1/auth/login`)
- **Requête** :
  ```json
  {
    "email": "admin@fleettrack.pro",
    "motDePasse": "Password123!"
  }
  ```
- **Réponse Succès (200 OK)** :
  ```json
  {
    "status": "success",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": "671fb43a88a4c123456789ab",
        "nom": "Directeur Logistique",
        "email": "admin@fleettrack.pro",
        "role": "admin"
      }
    }
  }
  ```

### Chauffeur / Utilisateur (`POST /api/v1/chauffeurs`)
- **Requête** :
  ```json
  {
    "nom": "Karim Idrissi",
    "email": "karim.idrissi@fleettrack.pro",
    "motDePasse": "Chauffeur123!",
    "telephone": "+212612345678",
    "numeroPermis": "MA-987654",
    "typePermis": "EC",
    "dateExpirationPermis": "2027-12-31"
  }
  ```

### Camion (`POST /api/v1/camions`)
- **Requête** :
  ```json
  {
    "matricule": "12345-A-26",
    "marque": "Volvo",
    "modele": "FH16",
    "annee": 2022,
    "kilometrage": 45000,
    "capaciteCharge": 24000,
    "statut": "disponible"
  }
  ```

---

## 4. Règles Architecturales React

1. **Seul hook autorisé** : `useState` (aucun `useEffect`, `useContext`, etc.).
2. **Aucune bibliothèque externe superflue** : pas de React Router, Redux, Axios ou React Query.
3. **Navigation par affichage conditionnel** sur une seule URL `/`.
4. **Lifting State & Data Flow Unidirectionnel** :
   - Les données descendent par les `props`.
   - Les actions remontent par des fonctions de rappel (*callbacks*).
   - Les listes filtrées et données dérivées sont calculées à la volée pendant le rendu.
5. **Formulaires contrôlés** : synchronisation stricte avec `useState`, conservation des valeurs en cas d'erreur API, aucun faux succès.

---

## 5. Arbre des Composants et Props

```text
App (Session en mémoire, vueActive, notifications)
├── LoginForm (Saisie email/password, gestion erreurs 401/403)
└── AppShell (En-tête, profil utilisateur, déconnexion)
    ├── ProtectedView (Garde-fou selon le rôle)
    ├── AdminLayout (Navigation onglets Utilisateurs / Camions)
    │   ├── UsersView
    │   │   ├── UserList / UserCard (Filtres locaux, liste, sélection, suspension)
    │   │   └── UserForm (Création contrôlée, conservation de saisie si erreur)
    │   └── TrucksView
    │       ├── TruckList / TruckCard (Filtres locaux, sélection, archivage)
    │       ├── TruckDetails (Panneau de détail en lifting state)
    │       └── TruckForm (Création / Édition contrôlée)
    └── DriverLayout (Espace Chauffeur sécurisé)
        └── DriverTrips (Mes trajets assignés, sans accès aux données Admin)
```
