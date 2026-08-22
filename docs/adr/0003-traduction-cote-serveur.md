# La traduction se fait côté serveur

Le client ne connaît aucune bibliothèque i18n : les controllers résolvent les
libellés et les envoient en props, le middleware Inertia y ajoute ceux du chrome
et de la lightbox. Les traductions ne partent donc pas dans le bundle, et une
chaîne oubliée se voit tout de suite, puisqu'elle apparaît en dur dans un
composant au lieu d'être une clé manquante à l'exécution.
