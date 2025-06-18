# Taskflow 📝✨

Taskflow est une application Todo moderne et riche en icônes, construite avec [Next.js](https://nextjs.org/) et [Firebase](https://firebase.google.com/), enrichie par l’API [Gemini](https://ai.google.dev/gemini-api) pour une gestion intelligente des tâches. Organisez votre journée avec style, collaborez en temps réel et profitez de fonctionnalités IA pour booster votre productivité !

---

## 🚀 Fonctionnalités

- 🔒 **Authentification** : connexion et inscription sécurisées avec Firebase Auth.
- 🗂️ **Tâches intelligentes** : créez, modifiez, supprimez et marquez vos tâches comme terminées.
- 🧠 **Suggestions IA** : recevez des suggestions et résumés intelligents grâce à l’API Gemini.
- 👥 **Collaboration en temps réel** : partagez et éditez vos listes en direct avec vos amis ou collègues.
- 🎨 **UI moderne** : design élégant, responsive, et de superbes icônes pour chaque action.
- ☁️ **Synchronisation cloud** : toutes vos tâches sont automatiquement synchronisées entre vos appareils.
- 🌓 **Mode sombre** : reposant pour les yeux, de jour comme de nuit.

---

## 📦 Stack technique

- [Next.js](https://nextjs.org/) ![Next.js](https://img.shields.io/badge/Next.js-000?logo=next.js&logoColor=white)
- [Firebase](https://firebase.google.com/) ![Firebase](https://img.shields.io/badge/Firebase-ffca28?logo=firebase&logoColor=black)
- [Gemini API](https://ai.google.dev/gemini-api) ![Gemini](https://img.shields.io/badge/Gemini%20API-4285F4?logo=google&logoColor=white)
- [React Icons](https://react-icons.github.io/react-icons/) ![Icons](https://img.shields.io/badge/Icons-React%20Icons-blue)
- [Tailwind CSS](https://tailwindcss.com/) ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38bdf8?logo=tailwindcss&logoColor=white)

---

## 📸 Captures d’écran

| Accueil             | Suggestions IA         | Mode sombre          |
|:-------------------:|:---------------------:|:--------------------:|
| ![image](https://github.com/user-attachments/assets/12d03dd0-57a1-493e-929a-203e3e9597f0) | ![image](https://github.com/user-attachments/assets/c13bdf31-28f9-40bf-af78-fddf62c44392) | ![image](https://github.com/user-attachments/assets/a202bce4-1c7f-46e4-be17-6d9d24b40805)
 

---

## 🛠️ Démarrage rapide

1. **Cloner le dépôt**
    ```bash
    git clone https://github.com/your-username/taskflow.git
    cd taskflow
    ```

2. **Installer les dépendances**
    ```bash
    npm install
    ```

3. **Configurer Firebase**
   - Créez un projet sur [Firebase Console](https://console.firebase.google.com/).
   - Activez l’authentification et la base de données Firestore.
   - Copiez votre config Firebase dans `.env.local` :
     ```
     NEXT_PUBLIC_FIREBASE_API_KEY=votre_api_key
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=votre_auth_domain
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=votre_project_id
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=votre_storage_bucket
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=votre_sender_id
     NEXT_PUBLIC_FIREBASE_APP_ID=votre_app_id
     ```

4. **Configurer l’API Gemini**
   - Récupérez votre clé API Gemini sur [Google AI Studio](https://aistudio.google.com/app/apikey).
   - Ajoutez-la à `.env.local` :
     ```
     NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
     ```

5. **Lancer l’application**
    ```bash
    npm run dev
    ```

6. **Ouvrez** [http://localhost:3000](http://localhost:3000) pour voir l’application !

---

## 🧩 Structure du projet

```
taskflow/
├─ components/       # Composants UI réutilisables
├─ pages/            # Pages Next.js & routes API
├─ lib/              # Utilitaires Firebase & Gemini
├─ styles/           # Styles globaux & Tailwind
├─ public/           # Fichiers statiques & icônes
└─ ...
```

---

## 🤖 Exemple : Suggestions avec Gemini API

```js
import { useGemini } from '../lib/gemini';

export default function AiSuggestion({ tasks }) {
  const { suggestions, getSuggestions } = useGemini();

  useEffect(() => {
    getSuggestions(tasks);
  }, [tasks]);

  return (
    <div>
      <h3 className="flex items-center gap-2">
        <span>💡</span> Suggestions IA
      </h3>
      <ul>
        {suggestions.map(s => <li key={s}>{s}</li>)}
      </ul>
    </div>
  );
}
```

---

## 🤝 Contribuer

Les PR et étoiles sont les bienvenus ! Voir [CONTRIBUTING.md](CONTRIBUTING.md) pour plus d’infos.

---



Fait avec ❤️ par [Lovasoa Nantenaina](https://github.com/Lovaxcoding)
