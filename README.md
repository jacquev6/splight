[Splight](http://splight.fr)

Comment mettre à jour le site
=============================

Pour changer le *contenu* du site, éditer les fichiers dans [le dossier `data`](data).
Voir le README à cet endroit pour les détails.

Outils utilisés
===============

Pour aider au design :

- [Paletton](http://paletton.com) pour choisir un jeu de couleurs
- [Responsinator](http://www.responsinator.com/?url=http%3A%2F%2Fsplight.fr) pour visualiser le site sur plusieurs tailles d'écran

Sur le site statique (en HTML, CSS3 en JavaScript) :

- [Bootstrap](http://getbootstrap.com) pour avoir un site adapté à plusieurs tailels d'écran
- [jQuery](http://jquery.com) comme librairie de base JavaScript

Pour générer le site statique :

- Une moulinette en [Python](http://python.org) : [tools.generator](tools/generator)
- [Yaml](https://en.wikipedia.org/wiki/YAML) comme format pour les données à afficher
- Des templates en [Jinja](http://jinja.pocoo.org)
- [Travis CI](https://travis-ci.org/jacquev6/splight.fr) pour lancer la moulinette automatiquement

Pour valider certains aspects techniques du site (p. ex. l'absence de liens morts) :

- Une autre moulinette en Python : [tools.checker](tools/checker)
