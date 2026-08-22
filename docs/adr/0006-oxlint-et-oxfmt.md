# oxlint et oxfmt comme seul outillage de style

Le lint et le format sont assurés par oxlint et oxfmt, configurés à la racine.
Les conventions que ces outils ne connaissent pas sont écrites comme règles dans
`tools/oxlint/project-style/` : frontière serveur vers client, direction de la
dépendance entre app et src, mémoïsation interdite sous le compilateur React,
composants Inertia typés par les routes, flèches réservées à `LinkArrow`, tiret
cadratin proscrit, et les trois règles de mise en forme reprises du boilerplate
de Romain Lanz : ligne vide après les imports, ligne vide avant un `if`, champs
privés natifs plutôt que le modificateur TypeScript. Une convention qui vaut
d'être écrite dans un fichier d'instructions vaut d'être vérifiée par la CI.
