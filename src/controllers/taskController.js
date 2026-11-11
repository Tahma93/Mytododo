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


// Contrôleur pour supprimer une tâche par son ID
export const deleteTask = (req, res) => {
    const { id } = req.params; // Extraction de l'ID de la tâche depuis les paramètres de l'URL

    const taskId = Number (req.params.id); // Conversion de l'ID en nombre pour la comparaison
    const taskIndex = tasks.findIndex(t => t.id === taskId); // Recherche de l'index de la tâche à supprimer dans le tableau

    if (taskIndex === -1) { // Si la tâche n'est pas trouvée (index = -1)
        return res.status(404).json({ message: "Tâche non trouvée" }); // Envoi d'une réponse HTTP 404 avec un message d'erreur
    }

    const deletedTask = tasks.splice(taskIndex, 1); // Suppression de la tâche du tableau et récupération de la tâche supprimée
    res.json ({ message: "Tâche supprimée avec succès", task: deletedTask[0] }); // Envoi d'une réponse HTTP avec un message de succès et la tâche supprimée
};

// Contrôleur pour modifier une tâche par son ID

export const updateTask = (req, res) => {
    const taskId = Number(req.params.id); // Conversion de l'ID en nombre pour la comparaison
    const task = tasks.find(t => t.id === taskId); // Recherche de la tâche à modifier dans le tableau

    if (task) { // Si la tâche est trouvée
        return res.status(404).json({ message: "Tâche non trouvée" }); // Envoi d'une réponse HTTP 404 avec un message d'erreur
    }

    const { title, completed } = req.body; // Extraction des nouvelles valeurs depuis le corps (body) de la requête

    if (title !== undefined) task.title = title; // Mise à jour du titre si une nouvelle valeur est fournie
    if (completed !== undefined) task.completed = completed; // Mise à jour du statut de complétion si une nouvelle valeur est fournie

    res.json({ message: "Tâche mise à jour avec succès", task }); // Envoi d'une réponse HTTP avec un message de succès et la tâche mise à jour
}
