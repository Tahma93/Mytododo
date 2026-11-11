// Importation du framework Express pour créer le serveur web et gérer les routes HTTP
import express from "express";

// Importation des fonctions du contrôleur (getTasks et createTask) pour gérer les requêtes liées aux tâches
import { getAllTasks, createTask } from "../controllers/taskController.js";

// Création d'une instance de routeur Express pour gérer les routes liées aux tâches
const router = express.Router();

// Route GET sur la racine du routeur ('/api/tasks') pour récupérer toutes les tâches
router.get("/", getAllTasks); // Appel de la fonction getAllTasks pour traiter la requête GET

// Route POST sur la racine du routeur ('/api/tasks') pour créer une nouvelle tâche
router.post("/", createTask); // Appel de la fonction createTask pour traiter la requête POST

// Route DELETE : Supprime une tâche par son ID (exemple : /api/tasks/1)
route.delete("/:id", deleteTask); // Appel de la fonction deleteTask pour traiter la requête DELETE

// Route PUT : Met à jour une tâche par son ID (exemple : /api/tasks/1)
router.put("/:id", updateTask); // Appel de la fonction updateTask pour traiter la requête PUT


//Exportation du routeur pour qu'il puisse être utilisé dans d'autres parties de l'application (notamment dans server.js)
export default router;