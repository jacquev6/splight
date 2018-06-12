- réduire le jumbotron Splight
- supprimer le lien "semaine précédente" de la semaine actuelle


Définition des rôles
====================

- développeur :
    - s'occupe de la partie technique du site
    - modifie le dossier "tools"
- web-master :
    - met à jour les événements affichés sur le site
    - modifie le dossier "data"
- spectateurs :
    - consultent le site pour trouver un spectacle à aller voir
- organisateurs :
    - veulent faire apparaître leurs spectacles sur le site


User-stories
============

En tant que spectateur, je ne veux plus réfléchir pour savoir à quelle semaine se rapporte ce que je vois
---------------------------------------------------------------------------------------------------------

### Problème

Afficher la date est certes parfaitement explicite, mais demande une certaine gymnastique cérébrale.

### Solution(s)

Afficher "cette semaine", "la semaine prochaine", "dans 15 jours", "dans 3 semaines", "dans un mois", etc.


En tant que spectateur, je veux connaître la durée des événements
-----------------------------------------------------------------

### Problème

Savoir à quelle heure c'est, c'est bien. Savoir jusqu'à quelle heure ça va durer, c'est mieux.

### Solution(s)

Data : ajouter un champ "duration".
Générateur : calculer la date de fin et l'ajouter à l'event FullCalendar.


En tant que spectateur, je veux des détails sur les événements
--------------------------------------------------------------

### Problème

(évident, existe seulement au stade préliminaire)

Solution
--------

Ajouter aux événements une boite de dialogue affichant :

- les détails du lieu :
    - adresse, plan de situation, photo
    - site web
    - heure d'ouverture
    - modalités d'admission
    - modalités de réservation (pour les resto / bars)
- les détails du spectacle :
    - description / résumé
    - public ciblé
    - site web
    - modalité de réservation
    - autres représentations
- les détails des artistes :
    - description / résumé
    - site web


En tant que spectateur, je veux les horaires de cinéma
------------------------------------------------------

### Problème

Les horaires de cinéma ne sont pas disponibles à l'avance.
Ils sont publiés le mercredi matin.

### Solution(s)

Peut-être automatiser la récupération sur AlloCiné? https://github.com/search?q=allocine
Mais ça ne serait jamais fiable de manière pérenne : on serait toujours sujet aux changements faits par AlloCiné.

Se renseigner auprès des cinémas pour savoir comment leurs horaires arrivent sur AlloCiné.
Peut-être peut-on se brancher dans le circuit?


En tant que spectateur, je veux que les horaires de cinéma soient lisibles
--------------------------------------------------------------------------

### Problème

Les séances de cinéma sont répétées un grand nombre de fois.
Les afficher naïvement comme les autres événements leur donnerait une trop grande importance.

### Solution(s)

?
Peut-être on met juste des liens vers les pages AlloCiné des cinémas ?


En tant que spectateur, je veux que les horaires des expositions soient lisibles
--------------------------------------------------------------------------------

### Problème

Les expositions durent de plusieurs jours à plusieurs semaines.
On ne peut pas les afficher comme les événements avec une heure de début dans l'agenda.

### Solution(s)


En tant que web-master, je veux cacher de manière sécurisée les événements pas encore publiés
---------------------------------------------------------------------------------------------

### Problème

@todo

### Solution(s)

Rendre le repository GitHub privé (7€/mois).
Ajouter un contrôle d'accès à la version /admin du site. (Pas évident techniquement)


En tant que web-master, je veux que mes visiteurs explorent le site
-------------------------------------------------------------------

### Problème

Les visiteurs se contentent de regarder ce qu'ils connaissent déjà.
Il faut aiguiller leur curiosité.

### Solution(s)

Cacher des easter-eggs sur le site, et offrir des entrées et places gratuites aux visiteurs qui les découvrent.


En tant que web-master, je veux fidéliser mes visiteurs
-------------------------------------------------------

### Problème

Les visiteurs ne viennent que très occasionnellement.

### Solution(s)

Organiser un concours de reconnaissance de photos (détails d’œuvres d'art, de films, de monuments, etc.).
Mettre les épreuves à disposition pendant quelques jours, tous les quelques jours.
Lots : entrées et places gratuites.


En tant qu'organisateur, je veux informer le web-master d'un événement
----------------------------------------------------------------------

### Problème

Le web-master ne peut pas tout savoir

### Solution(s)

Une page de contact permet d'envoyer des informations au web-master.


En tant que spectateur, je veux être averti suffisamment à l'avance pour les événements demandant une réservation anticipée
---------------------------------------------------------------------------------------------------------------------------

### Problème

La vue par calendrier limité à 5 semaines ne permet pas de voir les événements qui sont complets des mois à l'avance
(p. ex. les gros concerts de groupes célèbres).

### Solution(s)

Afficher de manière très visible (page d'accueil?) ces événements avant l'ouverture des réservations.


En tant que web-master, je veux monétiser le site
-------------------------------------------------

### Problème

L'argent, ça ne fait pas le bonheur. Mais bon...

### Solution(s)

Afficher de la publicité. Ciblée en fonction des tags visités. (Pas nécessairement besoin de tracker le visiteur :
ça peut juste vouloir dire qu'on met de la pub pour des concerts sur la page musique,
et de la pub plus générique (restos, bars, etc.) sur les pages d'agenda agrégé.)


En tant que spectateur, je veux une diversité de catégories
-----------------------------------------------------------

### Problème

Les spectateurs peuvent avoir des goûts très variés et spécifiques.

### Solution(s)

Les catégories identifiées :

- musique (concerts, opéras au ciné, festivals, etc.)
- théâtre
- spectacles (danse, humour, etc.)
- cinéma (associations cinéphiles, projections exceptionnelles, cinémas conventionnels, etc.)
- animations (dans la rue : e.g. semaine de l'Italie)
- expositions
- rencontres et débat (conférences, débats, dédicaces, etc.)
- salons et forums (dont portes ouvertes)
- au vert / plein air / sport populaire ? (nom pas encore fixé) (randonnée, course à pied, géocatching, course à vélo, etc.)
- patrimoine (monuments visitables en permanence, visites exceptionnelles, etc.)
- brocantes
- avec les enfants


En tant que web-master, je veux mettre certains événements dans plusieurs catégories
------------------------------------------------------------------------------------

### Problème

Certains événements ont leur place dans plusieurs catégories. Par exemple, un opéra dans musique et théâtre,
ou un ballet dans musique et danse. La catégorie "avec les enfants" contient beaucoup d'événements des autres catégories.

### Solution(s)

Utiliser une notion plus générale de "tags". Les catégories sont simplement un sous-ensemble des tags.


En tant que web-master, je veux avoir des statistiques de fréquentation du site
-------------------------------------------------------------------------------

### Problème

Pour la collaboration avec l'agence publicitaire, il faut avoir une idée du nombres de pages vues et du nombre de
visiteurs uniques.

### Solution(s)

Google Analytics ?


En tant que développeur, je veux gérer les dépendances du code JavaScript
-------------------------------------------------------------------------

### Problème

Les dépendances JavaScript sont déjà nombreuses.
Les lister manuellement dans les templates n'est pas fiable, et fonctionne différemment dans Node.js.

### Solution(s)

http://www.requirejs.org/ ?


En tant que développeur, je veux que la génération du site soit une fonction pure des data
------------------------------------------------------------------------------------------

### Problème

Le site a une date de publication. Cela a été implémenté en faisant dépendre le site généré de la date de génération.
Cela rend difficile la validation manuelle du site généré après une modification du générateur :
un changement peut venir de cette modification, ou simplement de la nouvelle date de génération.

### Solution(s)

Générer le site uniquement en fonction des data, et implémenter la date de publication en JavaScript.


En tant que développeur, je veux valider le code JavaScript
-----------------------------------------------------------

### Problème

JavaScript est un langage interprété. Les erreurs n’apparaissent que quand le code est activé, c'est à dire
dans le navigateur des visiteurs. C'est trop tard dans le cycle de vie du site.

### Solution(s)

Tests automatiques. Peut-être utilisant https://github.com/jsdom/jsdom dans Node.js?
Ça devrait permettre de valider les manipulations du DOM.
