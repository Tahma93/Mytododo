// Simulation d'une base de données temporaire (partagée pour l'instant)
let tasks = [
    { id: 1, title: "Terminer le projet Mytododo", completed: false },
    { id: 2, title: "Revoir les commentaires du code", completed: true },
    ];

// COntrôleur pour récupérer toutes les tâches
export const getAllTasks = (req, res) => {
    res.json(tasks); // Envoi de la liste des tâches au format JSON
};

// Contrôleur pour ajouter une nouvelle tâche
export const createTask = (req, res) => {
    const { title } = req.body; // Extraction du titre de la tâche depuis le corps (body) de la requête

    // Création d'un nouvel objet tâche avec un ID unique et la date actuelle
    const newTask = {
        id: Date.now(), // Utilisation de la date actuelle comme ID unique pour la tâche
        title, // valeur par défaut du titre de la tâche
        completed: false, // Par défaut, la tâche est marquée comme non complétée
    };

    // Ajout de la nouvelle tâche dans notre tableau temporaire
    tasks.push(newTask);

    // Renvoi d'une réponse HTTP avec le code 201 (Created) et la nouvelle tâche au format JSON
    res.status(201).json(newTask);
}