Couche serveur : routes, controllers, services, modèles, validators.

Lire [l'architecture de l'application](../docs/architecture/application.md) avant
d'ajouter un écran, un champ ou une règle de publication. Le vocabulaire du
domaine est dans [CONTEXT.md](../CONTEXT.md).

- Controllers RESTful, publics à la racine, administration dans `controllers/admin/`.
  Ils valident, chargent, **traduisent** et sérialisent les props. Ils n'ouvrent
  jamais de transaction et ne portent aucune règle réutilisable.
- Toute écriture qui touche des traductions ou des relations passe par un service
  de `services/`, qui possède la transaction.
- `models/` n'ajoute que relations et accesseurs par-dessus les classes générées
  de `database/schema.ts`, à ne jamais éditer à la main.
- Les briques de validation communes vivent dans `validators/shared.ts` : slug
  figé, transitions de statut, traduction, date de publication. Une édition
  transmet `EditedRow` en `meta`, sans quoi ces règles ne s'appliquent pas.
- `types/` est le seul répertoire que le client peut importer. Ce qui y entre ne
  doit avoir aucune dépendance runtime.
