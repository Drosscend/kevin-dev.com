# Une application AdonisJS unique, pas d'API séparée

Le site est un seul serveur AdonisJS 7 qui rend des pages Inertia React. Il n'y a
ni API publique, ni client découplé, ni monorepo : le controller est le point de
jonction, et les pages reçoivent leurs props déjà calculées. Pour un site à un
seul consommateur, une frontière HTTP interne coûterait un contrat à maintenir
sans rien apporter.
