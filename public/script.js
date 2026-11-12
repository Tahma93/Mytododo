

/* ================================================= */
/* 1. Initialisation de mon application              */
/* ================================================= */

document.addEventListener('DOMContentLoaded', function() {

    // Récupération des éléments principaux de mon interface
    const tasksContainer = document.getElementById('tasksContainer');
    const historyList = document.getElementById('historyList');
    const historyCards = document.getElementById('historyCards');

    // Définition des clés utilisées pour sauvegarder mes données
    const STORAGE_CURRENT = 'mytododo_current';
    const STORAGE_HISTORY = 'mytododo_history';
    const STORAGE_THEME = 'mytododo_theme';

    // Récupération de la date actuelle
    function getDate() {
        return new Date().toLocaleDateString('fr-FR');
    }

    // Création d'un identifiant unique pour chaque liste
    function createId() {
        return Date.now().toString() + Math.random().toString(36).slice(2, 8);
    }

    /* ================================================= */
    /* 2. Création de mes exemples de tâches              */
    /* ================================================= */

    // Organisation de mes tâches par catégories
    const taskExamples = {
        'Personnel': [
            'Organiser mon emploi du temps',
            'Ranger mon espace de travail',
            'Faire mes courses',
            'Préparer mes rendez-vous',
            'Classer mes documents personnels',
            'Organiser mes activités de la semaine',
            'Préparer mes affaires',
            'Faire le point sur mes priorités',
            'Mettre à jour mon calendrier',
            'Préparer ma semaine suivante'
        ],

        'Administratif': [
            'Classer mes documents administratifs',
            'Vérifier mes courriers importants',
            'Mettre à jour mes informations personnelles',
            'Préparer mes justificatifs',
            'Vérifier mes échéances administratives',
            'Archiver mes factures',
            'Organiser mes documents numériques',
            'Vérifier mes dossiers en attente',
            'Préparer mes démarches administratives',
            'Mettre à jour mes documents'
        ],

        'RNCP': [
            'Préparer le dossier professionnel RNCP',
            'Relire les consignes du référentiel',
            'Identifier les compétences attendues',
            'Organiser les preuves professionnelles',
            'Rédiger la présentation du contexte',
            'Décrire mes missions professionnelles',
            'Présenter les outils utilisés',
            'Vérifier la cohérence du dossier',
            'Relire le dossier professionnel',
            'Finaliser la mise en page du dossier'
        ],

    'Activités types': [
    'Identifier les activités types du référentiel',
    'Rédiger la première activité type',
    'Décrire une situation professionnelle',
    'Présenter les méthodes de travail',
    'Décrire les outils professionnels utilisés',
    'Expliquer les résultats obtenus',
    "Rédiger les fiches d'activités types",
    'Vérifier les compétences associées',
    "Relire les fiches d'activités",
    'Finaliser les fiches professionnelles'
],


        'Formation': [
            'Relire mes supports de formation',
            'Réviser les notions importantes',
            'Préparer mes exercices pratiques',
            'Revoir les commentaires du code',
            'Tester les fonctionnalités développées',
            'Corriger les erreurs identifiées',
            'Organiser mes notes de formation',
            'Préparer les questions pour le formateur',
            'Réaliser un exercice de synthèse',
            'Faire le bilan de mes apprentissages'
        ],

        'Objectifs': [
            'Définir mes objectifs du mois',
            'Planifier les tâches prioritaires',
            'Faire le point sur mon avancement',
            'Identifier les difficultés rencontrées',
            'Définir les prochaines étapes',
            'Mettre à jour mes objectifs',
            'Vérifier les tâches terminées',
            'Organiser le travail restant',
            'Préparer le bilan mensuel',
            'Définir les objectifs du mois suivant'
        ]
    };

    // Création de la liste initiale avec mes 60 exemples
    function createInitialTasks() {

        const tasks = [];

        Object.entries(taskExamples).forEach(([category, examples]) => {

            examples.forEach(title => {

                tasks.push({
                    id: createId(),
                    title: title,
                    category: category,
                    state: 0
                });

            });
        });

        return tasks;
    }

    /* ================================================= */
    /* 3. Chargement et sauvegarde de mes données         */
    /* ================================================= */

    // Récupération de ma liste actuelle ou création de la première
    let currentList = JSON.parse(localStorage.getItem(STORAGE_CURRENT)) || {
        id: createId(),
        name: 'Ma première liste',
        date: getDate(),
        tasks: createInitialTasks()
    };

    // Récupération de mon historique de listes
    let history = JSON.parse(localStorage.getItem(STORAGE_HISTORY)) || [];

    // Sauvegarde automatique de la liste et de son historique
    function saveData() {
        localStorage.setItem(STORAGE_CURRENT, JSON.stringify(currentList));
        localStorage.setItem(STORAGE_HISTORY, JSON.stringify(history));
    }

    /* ================================================= */
    /* 4. Affichage des tâches par catégorie             */
    /* ================================================= */

    // Affichage de toutes les tâches de ma liste actuelle
    function renderTasks() {

        tasksContainer.innerHTML = '';

        // Affichage d'un message si ma liste est vide
        if (currentList.tasks.length === 0) {
            tasksContainer.innerHTML =
                '<p class="empty-message">Aucune tâche pour le moment. Ajoutez votre première tâche !</p>';
            updateDashboard();
            return;
        }

        // Regroupement de mes tâches par catégorie
        const categories = {};

        currentList.tasks.forEach(task => {

            if (!categories[task.category]) {
                categories[task.category] = [];
            }

            categories[task.category].push(task);
        });

        // Création d'une section pour chaque catégorie
        Object.entries(categories).forEach(([category, tasks]) => {

            const section = document.createElement('div');
            section.className = 'category-section';

            const title = document.createElement('h2');
            title.className = 'category-title';
            title.textContent = category + ' (' + tasks.length + ')';

            section.appendChild(title);

            // Affichage des tâches de la catégorie
            tasks.forEach(task => {

                const item = document.createElement('div');
                item.className = 'task-item';

                // Attribution de la couleur selon l'état de la tâche
                if (task.state === 1) {
                    item.classList.add('valide');
                }

                if (task.state === 2) {
                    item.classList.add('non-valide');
                }

                item.dataset.id = task.id;

                // Création de la case de statut
                const status = document.createElement('span');
                status.className = 'task-status';

                status.textContent =
                    task.state === 1 ? '✓' :
                    task.state === 2 ? '✕' : '□';

                if (task.state === 1) status.classList.add('valide');
                if (task.state === 2) status.classList.add('non-valide');

                // Création du texte de la tâche
                const text = document.createElement('span');
                text.className = 'task-text';
                text.textContent = task.title;

                // Création du bouton de suppression
                const removeButton = document.createElement('button');
                removeButton.className = 'delete-task';
                removeButton.textContent = '×';
                removeButton.title = 'Supprimer cette tâche';

                // Association des éléments à la bulle
                item.append(status, text, removeButton);
                section.appendChild(item);

            });

            tasksContainer.appendChild(section);

        });

        updateDashboard();
    }

    /* ================================================= */
    /* 5. Gestion des trois états de mes tâches           */
    /* ================================================= */

    // Gestion des clics sur les bulles de tâches
    tasksContainer.addEventListener('click', function(event) {

        const item = event.target.closest('.task-item');

        if (!item) return;

        const task = currentList.tasks.find(t => t.id === item.dataset.id);

        if (!task) return;

        // Suppression de la tâche sélectionnée
        if (event.target.closest('.delete-task')) {

            if (confirm('Souhaitez-vous supprimer cette tâche ?')) {
                currentList.tasks = currentList.tasks.filter(t => t.id !== task.id);
                saveData();
                renderTasks();
            }

            return;
        }

        // Passage successif entre les trois états
        task.state = (task.state + 1) % 3;

        // Enregistrement et actualisation de l'affichage
        saveData();
        renderTasks();
    });

    /* ================================================= */
    /* 6. Mise à jour des compteurs et de la progression */
    /* ================================================= */

    // Calcul automatique des statistiques de ma liste
    function updateDashboard() {

        const total = currentList.tasks.length;

        const validated = currentList.tasks.filter(t => t.state === 1).length;

        const rejected = currentList.tasks.filter(t => t.state === 2).length;

        const pending = currentList.tasks.filter(t => t.state === 0).length;

        // Calcul du pourcentage de tâches validées
        const percent = total === 0 ? 0 : Math.round((validated / total) * 100);

        document.getElementById('validatedCount').textContent = validated;
        document.getElementById('rejectedCount').textContent = rejected;
        document.getElementById('pendingCount').textContent = pending;

        document.getElementById('progressPercent').textContent = percent + '%';

        document.getElementById('progressBar').style.width = percent + '%';
    }

    /* ================================================= */
    /* 7. Ajout d'une nouvelle tâche                     */
    /* ================================================= */

    document.getElementById('addTaskBtn').addEventListener('click', function() {

        const input = document.getElementById('newTaskInput');
        const category = document.getElementById('taskCategory');

        const title = input.value.trim();

        // Vérification du champ de saisie
        if (!title) {
            alert('Veuillez saisir le nom de votre tâche.');
            return;
        }

        // Ajout de la nouvelle tâche dans la liste
        currentList.tasks.push({
            id: createId(),
            title: title,
            category: category.value,
            state: 0
        });

        input.value = '';

        saveData();
        renderTasks();
    });

    // Ajout d'une tâche avec la touche Entrée
    document.getElementById('newTaskInput').addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            document.getElementById('addTaskBtn').click();
        }
    });

    /* ================================================= */
    /* 8. Gestion de l'historique de mes anciennes listes */
    /* ================================================= */

    // Affichage de la liste des anciennes listes dans le menu
    function renderHistory() {

        historyList.innerHTML = '';
        historyCards.innerHTML = '';

        history.forEach(list => {

            // Création d'un élément dans le menu latéral
            const menuItem = document.createElement('button');
            menuItem.className = 'nav-item';
            menuItem.textContent = '◷ ' + list.name;

            menuItem.addEventListener('click', () => restoreList(list.id));

            historyList.appendChild(menuItem);

            // Création d'une carte dans la page historique
            const card = document.createElement('div');
            card.className = 'history-card';

            const info = document.createElement('div');

            const title = document.createElement('strong');
            title.textContent = list.name;

            const date = document.createElement('p');
            date.textContent = 'Créée le ' + list.date;

            const stats = document.createElement('small');
            const done = list.tasks.filter(t => t.state === 1).length;

            stats.textContent =
                done + ' tâche(s) validée(s) sur ' + list.tasks.length;

            info.append(title, date, stats);

            const button = document.createElement('button');
            button.textContent = 'Consulter';

            button.addEventListener('click', () => restoreList(list.id));

            card.append(info, button);
            historyCards.appendChild(card);

        });

    }

    // Enregistrement de la liste actuelle dans l'historique
    function archiveCurrentList() {

        if (currentList.tasks.length === 0) return;

        // Copie de la liste pour conserver son état à la date d'archivage
        const archivedList = JSON.parse(JSON.stringify(currentList));

        archivedList.archivedAt = getDate();

        history.unshift(archivedList);

        saveData();
        renderHistory();
    }

    // Création d'une nouvelle liste
    document.getElementById('newListBtn').addEventListener('click', function() {

        if (currentList.tasks.length > 0) {

            if (!confirm('Archiver la liste actuelle et en créer une nouvelle ?')) {
                return;
            }

            archiveCurrentList();
        }

        currentList = {
            id: createId(),
            name: 'Nouvelle liste',
            date: getDate(),
            tasks: []
        };

        saveData();
        showView('current');
        renderTasks();
    });

    // Archivage de la liste terminée
    document.getElementById('archiveBtn').addEventListener('click', function() {

        if (currentList.tasks.length === 0) {
            alert('Cette liste ne contient aucune tâche.');
            return;
        }

        archiveCurrentList();

        currentList = {
            id: createId(),
            name: 'Nouvelle liste',
            date: getDate(),
            tasks: []
        };

        saveData();
        showView('current');
        renderTasks();

        alert('Votre liste a bien été archivée !');
    });

    // Restauration d'une ancienne liste
    function restoreList(id) {

        const selectedList = history.find(list => list.id === id);

        if (!selectedList) return;

        // Sauvegarde de la liste actuelle avant de changer de liste
        if (currentList.tasks.length > 0) {

            if (!confirm('Remplacer la liste actuelle par cette ancienne liste ?')) {
                return;
            }
        }

        currentList = JSON.parse(JSON.stringify(selectedList));

        saveData();
        showView('current');
        renderTasks();

    }

    /* ================================================= */
    /* 9. Navigation entre les différentes pages          */
    /* ================================================= */

    // Affichage de la liste actuelle ou de l'historique
    function showView(view) {

        const isHistory = view === 'history';

        tasksContainer.classList.toggle('hidden', isHistory);
        document.querySelector('.dashboard').classList.toggle('hidden', isHistory);
        document.querySelector('.progress-section').classList.toggle('hidden', isHistory);
        document.querySelector('.add-task-section').classList.toggle('hidden', isHistory);
        document.querySelector('.list-actions').classList.toggle('hidden', isHistory);
        document.getElementById('historyView').classList.toggle('hidden', !isHistory);

        document.getElementById('pageTitle').textContent =
            isHistory ? 'Historique de mes listes' : currentList.name;

        document.querySelectorAll('[data-view]').forEach(button => {
            button.classList.toggle('active', button.dataset.view === view);
        });

        if (isHistory) {
            renderHistory();
        }
    }

    document.querySelectorAll('[data-view]').forEach(button => {
        button.addEventListener('click', function() {
            showView(this.dataset.view);
        });
    });

    /* ================================================= */
    /* 10. Gestion des paramètres de mon application     */
    /* ================================================= */

    const settingsModal = document.getElementById('settingsModal');

    // Ouverture des paramètres depuis les deux boutons
    document.getElementById('settingsBtn').addEventListener('click', () => {
        settingsModal.classList.remove('hidden');
    });

    document.getElementById('settingsTopBtn').addEventListener('click', () => {
        settingsModal.classList.remove('hidden');
    });

    // Fermeture de la fenêtre des paramètres
    document.getElementById('closeSettings').addEventListener('click', () => {
        settingsModal.classList.add('hidden');
    });

    // Activation ou désactivation du mode sombre
    const darkMode = document.getElementById('darkMode');

    darkMode.checked = localStorage.getItem(STORAGE_THEME) === 'dark';

    document.body.classList.toggle('dark-mode', darkMode.checked);

    darkMode.addEventListener('change', function() {

        document.body.classList.toggle('dark-mode', this.checked);

        localStorage.setItem(
            STORAGE_THEME,
            this.checked ? 'dark' : 'light'
        );
    });

    // Suppression de l'historique après confirmation
    document.getElementById('clearHistoryBtn').addEventListener('click', function() {

        if (confirm('Voulez-vous vraiment supprimer tout votre historique ?')) {

            history = [];

            saveData();
            renderHistory();

            alert('Votre historique a été supprimé.');
        }
    });

    /* ================================================= */
    /* 11. Déconnexion de mon application                */
    /* ================================================= */

    document.getElementById('logoutBtn').addEventListener('click', function() {

        if (confirm('Souhaitez-vous vous déconnecter de Mytododo ?')) {

            // Suppression de l'indicateur de connexion de démonstration
            sessionStorage.removeItem('mytododo_logged');

            // Retour à la page de connexion
            window.location.href = '/login';
        }
    });

    /* ================================================= */
    /* 12. Chargement initial de mon application         */
    /* ================================================= */

    // Sauvegarde de la première liste lors de sa création
    saveData();

    // Affichage des tâches et de l'historique
    renderTasks();
    renderHistory();

});
