// Importation du framework Express pour créer le serveur web et les routes
import express from 'express';

// Importation de CORS pour autoriser les requêtes entre le navigateur et le serveur
import cors from 'cors';

// Importation de dotenv pour lire le fichier .env
import dotenv from 'dotenv';

// Importation du module path pour manipuler les chemins de fichiers
import path from 'path';

// Importation de fileURLToPath pour trouver le dossier du fichier actuel
import { fileURLToPath } from 'url';

// Importation du module crypto (intégré à Node.js) pour sécuriser les mots de passe
import crypto from 'crypto';

// Importation des routes des tâches
import taskRoutes from './src/routes/tasks.js';

// Création de l'application Express
const app = express();

// Chargement des variables du fichier .env
dotenv.config();

// Chemins de fichiers (nécessaires avec les modules ES)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Liste des comptes créés.
// Attention : ces comptes sont perdus quand le serveur redémarre.
// On ajoutera une base de données plus tard.
const utilisateurs = [];

// Transforme un mot de passe en version illisible avant de le stocker
function hacherMotDePasse(motDePasse) {
    const sel = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync(motDePasse, sel, 64).toString('hex');
    return `${sel}:${hash}`;
}

// Vérifie qu'un mot de passe correspond à celui stocké
function verifierMotDePasse(motDePasse, motDePasseStocke) {
    const [sel, hashStocke] = motDePasseStocke.split(':');
    const hashTest = crypto.scryptSync(motDePasse, sel, 64).toString('hex');
    return crypto.timingSafeEqual(
        Buffer.from(hashStocke, 'hex'),
        Buffer.from(hashTest, 'hex')
    );
}

// Middlewares globaux
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Route d'inscription : création d'un nouveau compte
app.post('/api/auth/register', (req, res) => {

    // Récupération des informations envoyées par le formulaire
    const nom = (req.body.nom || '').trim();
    const email = (req.body.email || '').trim().toLowerCase();
    const password = req.body.password || '';

    // Vérification : tous les champs sont remplis
    if (!nom || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Tous les champs sont obligatoires."
        });
    }

    // Vérification : mot de passe assez long
    if (password.length < 8) {
        return res.status(400).json({
            success: false,
            message: "Le mot de passe doit contenir au moins 8 caractères."
        });
    }

    // Vérification : l'email n'est pas déjà utilisé
    const existe = utilisateurs.some(u => u.email === email);
    if (existe) {
        return res.status(409).json({
            success: false,
            message: "Un compte existe déjà avec cette adresse email."
        });
    }

    // Enregistrement du nouveau compte (mot de passe haché)
    utilisateurs.push({
        nom,
        email,
        motDePasse: hacherMotDePasse(password)
    });

    return res.status(201).json({
        success: true,
        redirect: '/'
    });
});

// Route de connexion : accepte le compte de démo ou un compte créé
app.post('/api/auth/login', (req, res) => {

    // Récupération des identifiants saisis
    const email = (req.body.email || '').trim().toLowerCase();
    const password = req.body.password || '';

    // Identifiants de démonstration (depuis le fichier .env)
    const demoEmail = process.env.DEMO_EMAIL;
    const demoPassword = process.env.DEMO_PASSWORD;

    // Cas 1 : connexion avec le compte de démo
    if (demoEmail && email === demoEmail.toLowerCase() && password === demoPassword) {
        return res.status(200).json({
            success: true,
            redirect: '/'
        });
    }

    // Cas 2 : connexion avec un compte créé
    const utilisateur = utilisateurs.find(u => u.email === email);
    if (utilisateur && verifierMotDePasse(password, utilisateur.motDePasse)) {
        return res.status(200).json({
            success: true,
            redirect: '/'
        });
    }

    // Sinon : identifiants incorrects
    return res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect."
    });
});

// Page de connexion
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Page principale
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Routes des tâches
app.use('/api/tasks', taskRoutes);

// Démarrage du serveur
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Serveur Mytododo démarré sur le port ${PORT}`);
});