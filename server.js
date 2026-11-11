// Importation du framework Express pour créer le serveur wev et gérer les routes HTTP
import express from "express"; 

// Importation du middleware CORS pour autoriser les requêtes cross-origin entre le client et le serveur
import cors from "cors"; 

// Importation de dotenv pour charger et sécuriser les variables d'environnement à partir d'un fichier .env
import dotenv from "dotenv";

// Importation des routes dédiées aux tâches 
import taskRoutes from "./src/routes/tasks.js";



// Initialisation et chargement des variables d'environnement dans l'objet global process.env
dotenv.config();

// Création de l'instance de l'application Express
const app = express();

// Définition du port d'écoute : utilisation de la variable d'environnement PORT ou du port 3000 par défaut
const PORT = process.env.PORT || 3000;

// Configuration des middlewares globaux pour l'application Express
app.use(cors()) // Activation du middleware CORS pour autoriser les échanges de données
app.use(express.json()); // Configuration d'Express pour parser automatiquement les requêtes entrantes au format JSON

// Déclaration de la route test à la racine de l'API pour vérifier le bon fonctionnement du serveur
app.get("/", (req, res) => {
res.json({ message: "Bienvenue sur l'API Mytododo !" }); // Envoi d'une réponse JSON avec un message de bienvenue
});

// Démarage du serveur Node.js sur le port défini et affichage d'un message dans la console pour indiquer que le serveur est opérationnel
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`); // Affichage du message de confirmation dans la console
});

// Utilisation des routes dédiées aux tâches pour toutes les requêtes commençant par /api/tasks
app.use("/api/tasks", taskRoutes); 