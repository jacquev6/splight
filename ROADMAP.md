En tant que dévelopeur, je veux réutiliser du code open-source existant
=======================================================================

Problème
--------

Réinventer la roue prend du temps. Et je ne suis pas si efficace en JavaScript.

Solution(s)
-----------

Affichage de calendrier:

- https://fullcalendar.io/
- http://bootstrap-calendar.eivissapp.com/
- https://www.w3schools.com/howto/howto_css_calendar.asp
- https://www.codeproject.com/Articles/732679/HTML-Event-Calendar-Scheduler
- https://bootsnipp.com/tags/calendar
- https://www.bootply.com/tagged/calendar

Affichage de dates relative (i.e. "il y a 5 jours"):

- http://momentjs.com/


En tant que visiteur, je ne veux plus réfléchir pour savoir à quelle semaine se rapporte ce que je vois
=======================================================================================================

Problème
--------

Afficher la date est certe parfaitement explicite, mais demande une certaine gymnastique cérébrale.

Solution(s)
-----------

Afficher "cette semaine", "la semaine prochaine", "dans 15 jours", "dans 3 semaines", "dans un mois", etc.


En tant que visiteur, je veux une vue synthétique de tout ce qui m'intéresse
============================================================================

Problème
--------

Un visiteur intéressé par plusieurs catégories doit faire des aller-retours entre les pages de ces catégories.
Il serait utile de les visualiser sur la même page.

Solution(s)
-----------

Un agenda (hebdomadaire ou quotidien) regroupant tous les événements de toutes les catégories.
Filtrable par catégories.


En tant que visiteur, je veux des détails sur les événements
============================================================

Problème
--------

(évident, existe seulement au stade préliminaire)

Solution
--------

Ajouter aux événements une boite de dialogue affichant:

- les détails du lieu:
    - adresse, plan de situation, photo
    - site web
    - heure d'ouverture
    - modalités d'admission
    - modalités de réservation (pour les resto/bars)
- les détails du spectacle:
    - description/résumé
    - public ciblé
    - site web
    - modalité de réservation
    - autres représentations
- les détails des artistes:
    - description/résumé
    - site web


En tant que visiteur, je veux les horaires de cinéma
====================================================

Problème
--------

Les horaires de cinéma ne sont pas disponibles à l'avance.
Ils sont publiés le mercredi matin.

Solution(s)
-----------

Peut-être automatiser la récupération sur AlloCiné? https://github.com/search?q=allocine
Mais ça ne serait jamais fiable de manière pérenne: on serait toujours sujet aux changements faits par AlloCiné.

Se renseigner auprès des cinémas pour savoir comment leurs horaires arrivent sur AlloCiné.
Peut-être peut-on se brancher dans le circuit?


En tant que visiteur, je veux que les horaires de cinéma soient lisibles
========================================================================

Problème
--------

Les séances de cinéma sont répétées un grand nombre de fois.
Les afficher naïvement comme les autres événements leur donnerait une trop grande importance.

Solution(s)
-----------

?
Peut-être on met juste des liens vers les pages AlloCiné des cinémas ?


En tant que visiteur, je veux que les horaires des expositions soient lisibles
==============================================================================

Problème
--------

Les expositions durent de plusieurs jours à plusieurs semaines.
On ne peut pas les afficher comme les événements avec une heure de début dans l'agenda.

Solution(s)
-----------


En tant que webmaster, je veux que mes visiteurs explorent le site
==================================================================

Problème
--------

Les visiteurs se contentent de regarder ce qu'ils connaissent déjà.
Il faut aiguiller leur curiosité.

Solution(s)
-----------

Cacher des easter-eggs sur le site, et offrir des entrées et places gratuites aux visiteurs qui les découvrent.


En tant que webmaster, je veux fidéliser mes visiteurs
======================================================

Problème
--------

Les visiteurs ne viennent que très occasionellement.

Solution(s)
-----------

Organiser un concours de reconnaissance de photos (détails d'oeuvres d'art, de films, de monuments, etc.).
Mettre les épreuves à disposition pendant quelques jours, tous les quelques jours.
Lots: entrées et places gratuites.


En tant qu'organisateur, je veux informer le webmaster d'un événement
=====================================================================

Problème
--------

Le webmaster ne peut pas tout savoir

Solution(s)
-----------

Une page de contact permet d'envoyer des informations au webmaster.


En tant que visiteur, je veux être averti suffisamment à l'avance pour les événements demandant une réservation anticipée
=========================================================================================================================

Problème
--------

La vue par calendrier limité à 5 semaines ne permet pas de voir les événements qui sont complets des mois à l'avance
(p. ex. les gros concerts de groupes célèbres).

Solution(s)
-----------

Afficher de manière très visible (page d'accueil?) ces événements avant l'ouverture des réservations.


En tant que webmaster, je veux monétiser le site
================================================

Problème
--------

L'argent, ça ne fait pas le bonheur. Mais bon...

Solution(s)
-----------

Afficher de la publicité. Ciblée en fonction des tags visités. (Pas nécessairement besoin de tracker le visiteur :
ça peut juste vouloir dire qu'on met de la pub pour des concerts sur la page musique,
et de la pub plus générique (restos, bars, etc.) sur les pages d'agenda agrégé.)


En tant que visiteur, je veux une diversité de catégories
=========================================================

Problème
--------

Les visiteurs peuvent avoir des goûts très variés et spécifiques.

Solution(s)
-----------

Les catégories identifiées:

    - musique (concerts, opéras au ciné, festivals, etc.)
    - théâtre
    - spectacles (danse, humour, etc.)
    - cinéma (associations cinéphiles, projections exceptionnelles, cinémas conventionnels, etc.)
    - animations (dans la rue: e.g. semaine de l'Italie)
    - expositions
    - rencontres et débat (conférences, débats, dédicaces, etc.)
    - salons et forums (dont portes ouvertes)
    - au vert / plein air / sport populaire ? (nom pas encore fixé) (randonnée, course à pied, géocatching, course à vélo, etc.)
    - patrimoine (monuments visitables en permanence, visites exceptionnelles, etc.)
    - brocantes
    - avec les enfants


An tant que webmaster, je veux mettre certains événements dans plusieurs catégories
===================================================================================

Problème
--------

Certains événements ont leur place dans plusieurs catégories. Par exemple, un opéra dans musique et théâtre,
ou un ballet dans musique et danse. La catégorie "avec les enfants" contient beaucoup d'événements des autres catégories.

Solution(s)
-----------

Utiliser une notion plus générale de "tags". Les catégories sont simplement un sous-ensemble des tags.