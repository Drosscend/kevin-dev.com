# La traduction se fait côté serveur

Le client ne connaît aucune bibliothèque i18n. Le middleware Inertia partage
`messages`, le dictionnaire de la langue courante, en prop `once` : il voyage
une fois par langue et le client le garde d'une visite à l'autre. Son type dérive
du fichier français, donc une clé absente en anglais casse le typecheck. Les
libellés qui dépendent d'une donnée restent résolus par le controller, et aucun
moteur ICU ne part dans le bundle.
