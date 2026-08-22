# Séparer la délivrance des capacités métier

`app/` ne contient plus que ce qui parle HTTP et Inertia, et `src/` porte les
capacités métier : actions, queries, repositories, modèles. La dépendance ne va
que dans un sens, et le lint la tient. Les lectures ont désormais un nom, ce qui
était le vrai manque : ajouter un champ à une page se fait dans une query
nommée plutôt qu'au milieu de deux cents lignes de controller. Le moteur de
persistance devient aussi remplaçable fichier par fichier, puisque toutes les
requêtes vivent dans des queries et des repositories.
