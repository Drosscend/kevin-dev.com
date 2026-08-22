# Le Markdown est rendu à l'enregistrement

Le HTML d'un contenu est produit au moment où l'admin l'enregistre, puis stocké.
Les pages publiques ne lisent que ce HTML. Le rendu, la coloration syntaxique et
l'assainissement se paient une fois par écriture plutôt qu'à chaque visite, et un
changement de pipeline Markdown impose de réenregistrer les contenus, ce qui est
un effet voulu : le HTML servi reste celui qui a été relu.
