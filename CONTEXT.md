# Domaine de kevin-dev.com

Vocabulaire du site, tel que le code, les URL et l'administration l'emploient.
Un mot défini ici garde le même sens partout : dans un nom de modèle, dans un
libellé d'admin et dans une conversation.

## Entrées de contenu

Trois familles partagent la même mécanique : un slug, des traductions, un statut
de publication, des technologies et une image de couverture.

**Article** : billet du blog, écrit en Markdown, rattaché à une catégorie et à
zéro ou plusieurs projets.

**Projet** : réalisation du portfolio. Porte une période (début, fin) et des
liens externes typés. Un projet commencé sans date de fin est _en cours_.

**Talk** : conférence ou intervention, datée par son événement. Un talk dont
l'événement n'a pas encore eu lieu est _à venir_.

## Références

**Technologie** : langage, framework, outil ou infra, classée par catégorie.
Elle relie articles, projets et talks entre eux et a sa propre page publique.

**Catégorie** : classe les articles, et seulement eux.

**Entrée de parcours** : ligne du CV (formation ou poste), affichée sur
l'accueil et sur la page CV, ordonnée à la main par sa position.

**Média** : fichier téléversé, décliné en variantes par le traitement d'image.
Sert de couverture, de logo de technologie, ou d'illustration dans un contenu.

**Réglage** : valeur éditable depuis l'admin, hors de tout contenu (blocs de
l'accueil, coordonnées, textes des pages Markdown).

**Message de contact** : envoi du formulaire public, lu puis supprimé depuis
l'admin.

## Publication

**Brouillon** : jamais servi au public. Un visiteur reçoit 404.

**Publié** : visible, à condition que la date de publication soit atteinte.

**Programmée** : une entrée publiée dont la date est dans le futur. Elle reste
invisible jusqu'à cette date, sans changer de statut.

**Archivé** : entrée retirée du site après avoir été en ligne. Un visiteur
reçoit 410, pas 404, parce que l'URL a réellement existé.

**En ligne** : se dit d'une entrée dont l'URL a déjà été atteignable. Deux règles
en découlent : le slug se fige et le retour au brouillon devient impossible.

**Aperçu** : lecture d'une entrée invisible au public par un visiteur connecté,
signalée par un bandeau. C'est ce qui remplace une URL de prévisualisation.

**Slug** : segment d'URL d'une entrée, commun aux deux langues.

## Langues

Le site est bilingue : le français vit à la racine, l'anglais sous `/en`.

**Traduction** : titre, résumé et corps d'une entrée dans une langue. Le français
existe toujours, l'anglais est optionnel. Vider les champs anglais supprime la
traduction anglaise plutôt que de stocker du vide.

**Locale** : `fr` ou `en`, déduite du préfixe d'URL et de rien d'autre.
