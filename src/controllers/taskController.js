
// Liste des tâches par défaut de Mytododo
const defaultTasks = [
    {
        id: 1,
        title: "Terminer le projet Mytododo",
        completed: false
    },
    {
        id: 2,
        title: "Revoir les commentaires du code",
        completed: true
    },
    {
        id: 3,
        title: "Ajouter de nouvelles fonctionnalités",
        completed: false
    },
    {
        id: 4,
        title: "Tester l'application",
        completed: false
    }
];

// Initialisation de la liste
let tasks = defaultTasks.map(task => ({ ...task }));

// Récupérer toutes les tâches
export const getAllTasks = (req, res) => {
    // Si la liste est vide, on restaure les tâches par défaut
    if (tasks.length === 0) {
        tasks = defaultTasks.map(task => ({ ...task }));
    }

    res.json(tasks);
};

// Ajouter une nouvelle tâche
export const createTask = (req, res) => {
    const { title } = req.body;

    if (!title || !title.trim()) {
        return res.status(400).json({
            message: "Le titre de la tâche est obligatoire"
        });
    }

    const newTask = {
        id: Date.now(),
        title: title.trim(),
        completed: false
    };

    tasks.push(newTask);

    res.status(201).json(newTask);
};

// Supprimer une tâche
export const deleteTask = (req, res) => {
    const taskId = Number(req.params.id);

    const taskIndex = tasks.findIndex(t => t.id === taskId);

    if (taskIndex === -1) {
        return res.status(404).json({
            message: "Tâche non trouvée"
        });
    }

    const deletedTask = tasks.splice(taskIndex, 1);

    res.json({
        message: "Tâche supprimée avec succès",
        task: deletedTask[0]
    });
};

// Modifier une tâche
export const updateTask = (req, res) => {
    const taskId = Number(req.params.id);

    const task = tasks.find(t => t.id === taskId);

    if (!task) {
        return res.status(404).json({
            message: "Tâche non trouvée"
        });
    }

    const { title, completed } = req.body;

    if (title !== undefined) {
        task.title = title;
    }

    if (completed !== undefined) {
        task.completed = completed;
    }

    res.json({
        message: "Tâche mise à jour avec succès",
        task
    });
};
