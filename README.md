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


---

## 6. Plan de Tests Manuels Rempli & Preuves de Sécurité

Conformément aux exigences du brief, voici la validation des scénarios réels sur l'application et la preuve de protection au niveau du serveur :

| Scénario | Action effectuée | Résultat attendu | Résultat observé | Statut |
| :--- | :--- | :--- | :--- | :---: |
| **Login invalide** | Saisie d'un mauvais mot de passe (`admin@flotte.com` / `WrongPass`) | Refus HTTP 401, message clair, aucun layout ouvert | Message d'erreur visible, formulaire conservé | **CONFORME** |
| **Admin valide** | Connexion avec `admin@flotte.com` / `Admin123!` | Ouverture du layout Admin avec données réelles | Layout Admin affiché, chargement effectif des chauffeurs | **CONFORME** |
| **Chauffeur valide** | Connexion avec `chauffeur@flotte.com` / `Chauffeur123!` | Espace Chauffeur ouvert ; aucune vue Admin accessible | Layout Chauffeur dédié ouvert, aucun composant Admin | **CONFORME** |
| **Chauffeur suspendu** | Connexion avec `suspendu@flotte.com` / `Chauffeur123!` | Refus HTTP 403, aucune session initialisée | Message d'erreur bloquant « Accès refusé : compte suspendu » | **CONFORME** |
| **Session expirée** | Rechargement (`F5`) ou tentative avec token expiré | Retour à la connexion ou refus 401 | Retour automatique au formulaire de connexion | **CONFORME** |
| **Utilisateur invalide** | Soumission avec champs manquants | Erreurs de validation, saisie conservée | Validation de présence affichée, champs saisis conservés | **CONFORME** |
| **Chauffeur créé** | Soumission du formulaire d'ajout chauffeur | Compte créé via `POST /chauffeurs` et visible en liste | Nouveau chauffeur présent dans le tableau après réponse 201 | **CONFORME** |
| **Compte Admin** | Consultation de sa fiche | Rôle visible, limitation documentée | Fiche avec badge `admin` visible, mention de contrat affichée | **CONFORME** |
| **Camion refusé** | Tentative de modification du matricule | Refus HTTP 400 (`"matricule" is not allowed`), champs conservés | Message explicite sans faux succès, formulaire préservé | **CONFORME** |
| **Camion valide** | Création, modification et archivage | Synchronisation immédiate avec l'API | Données mises à jour dans la liste et le panneau de détail | **CONFORME** |
| **Déconnexion** | Clic sur le bouton « Déconnexion » | Session et token purgés en mémoire | Retour immédiat au formulaire de connexion | **CONFORME** |
| **Accessibilité & Responsive** | Navigation clavier et test écran mobile | Focus visible, labels clairs, pas de défilement horizontal | Affichage adapté en colonne unique sur mobile et 2 colonnes sur bureau | **CONFORME** |

### Preuve du contrôle d'accès direct sur le backend (HTTP 403 Forbidden) :
Le brief stipule : *« Masquer un bouton React ne prouve pas la protection du serveur. »*  
Lorsqu'un token Chauffeur tente d'appeler directement un endpoint d'administration :
```bash
curl -X GET http://localhost:5001/api/v1/chauffeurs \
  -H "Authorization: Bearer <TOKEN_CHAUFFEUR>"
```
**Réponse directe du serveur Express :**
```json
{
  "status": "fail",
  "message": "Accès refusé : vous n'avez pas les autorisations nécessaires."
}
```
*(Code HTTP HTTP/1.1 403 Forbidden).*
