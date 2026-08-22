# Lucid sur Postgres, avec un schéma généré

La persistance passe par Lucid sur Postgres. Les migrations restent la source de
vérité du schéma : `database/schema.ts` en est régénéré à chaque exécution, et
chaque modèle étend sa classe générée pour n'ajouter que ses relations et ses
accesseurs. Les colonnes ne sont donc jamais déclarées deux fois, et une colonne
renommée casse la compilation au lieu de casser une requête à l'exécution.
