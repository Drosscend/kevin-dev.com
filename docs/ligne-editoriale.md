# Ligne éditoriale des articles et fiches projet

Ce que doivent respecter les textes publiés sur le site (blog et projets),
quelle que soit la langue.

## Ton

Factuel et vrai. Le texte raconte ce qui existe et ce qui s'est passé, pas ce
que ça pourrait représenter. Le lectorat visé est développeur : on peut nommer
une techno sans l'expliquer longuement.

On n'écrit rien qui ne soit exactement vrai, même si la formule est jolie. Une
phrase du type « la fonction que j'utilise le plus » doit correspondre à un
usage réel, sinon elle saute.

## Formulations interdites

**Pas de tiret cadratin (`—`).** Ni en français ni en anglais. On utilise la
virgule, les deux-points, la parenthèse ou le point.

**Pas de chute rhétorique en fin de paragraphe.** Le registre LinkedIn se
reconnaît à la phrase courte qui vient « conclure » un paragraphe déjà terminé,
souvent construite en opposition. Exemples de ce qu'on n'écrit pas :

- « Ce que l'assistant peut modifier est donc une liste finie, que je peux
  relire, et pas une surface ouverte. »
- « Cette séparation a l'air d'un détail d'implémentation. À l'usage, c'est ce
  qui fait qu'on ose poser des questions. »
- « Un second cerveau qui vibre douze fois pour le même incident, on finit par
  couper les notifications, et on perd aussi les vraies. »

Dans les trois cas l'information était déjà donnée : la phrase n'ajoute rien,
elle met en scène. On termine sur le constat, pas sur l'effet.

**Pas de registre commercial.** Aucun bénéfice survendu, aucun superlatif,
aucun appel à l'action. On ne vend rien.

**Pas de hype IA.** Pas d'« agent autonome », pas de promesse de magie. On
décrit ce que le système fait réellement, y compris ses limites.

**Pas de justification morale d'un choix technique.** Expliquer pourquoi une
décision a été prise, oui ; expliquer qu'elle est vertueuse, non.

## Contenu

- Ouvrir sur un manque concret, pas sur une intention.
- Décrire l'usage réel avant l'architecture : ce qu'on fait avec, à quel moment
  de la journée, combien de temps ça prend.
- Les erreurs et les impasses se racontent au cas par cas, pas
  systématiquement. On demande avant d'ajouter une section « ce que j'ai
  appris ».
- Sur les sujets personnels, rester sur les mécaniques (entrées datées,
  recherche, suivi) et pas sur ce que contiennent les données.
- Pas de détail d'infrastructure exploitable : ni chemin, ni nom de volume, ni
  détail d'authentification ou de sauvegarde.
- Pas de bloc de code dans les fiches projet.

## Liens

Chaque technologie citée dans le corps du texte est liée vers sa documentation
officielle, à sa première mention seulement. Les liens vers MDN suivent la
langue de la fiche (`/fr/` en français, `/en-US/` en anglais).

## Longueur

Une fiche projet fait environ 2 000 mots, six à huit sections. Le champ
`readingTime` est recalculé automatiquement à l'enregistrement, on n'y touche
pas.

## Publication

Les fiches préparées hors de l'application passent par la commande d'import,
qui écrit à travers `ProjectService` et fait donc le rendu markdown comme une
sauvegarde depuis l'admin :

```sh
node ace projects:import <fichier.json>            # crée en brouillon
node ace projects:import <fichier.json> --update   # écrase un slug connu
node ace projects:import <fichier.json> --publish  # publie au lieu du brouillon
```

Le markdown du fichier JSON ne reprend pas le titre en `#` : il vit dans son
propre champ. Les technologies sont référencées par slug, celles qui n'existent
pas en base sont ignorées et signalées.
