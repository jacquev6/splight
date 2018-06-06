Introduction
============

Les données présentées sur le site viennent des fichiers présents dans ce dossier et ses sous-dossiers.
Ces fichiers sont en [YAML](https://fr.wikipedia.org/wiki/YAML),
un format textuel permettant la présentation de données structurées,
facile à modifier et à comprendre pour un humain, et à analyser pour un ordinateur.

Noms de fichiers
================

Pour ajouter certaines données, il faut créer de nouveaux fichiers.
Il faut respecter les règles de nommage suivantes:

Tous fichiers doivent avoir l'extension `.yml`, pour être interprétés comme du YAML.

Le nom de base des fichiers est souvent utilisée comme un [slug](https://fr.wikipedia.org/wiki/Slug_(journalisme)) sur le site,
et se retrouve dans certaines [URLs](https://fr.wikipedia.org/wiki/Uniform_Resource_Locator).
Elle doit donc ne comporter que des lettres minuscules non accentuées, des chiffres, et le tiret `-`.
Il est préférable de garder des noms courts (une dizaine de caractères) mais il n'y a pas d'obligation technique.

Exemples:

  - `reims.yml`
  - `the-who.yml`

Contre-exemples:

  - `Charleville.yml` (majuscule interdite)
  - `the who.yml` (espace)
  - `the_who.yml` (underscore)
  - `théâtre.yml` (accents)
  - `theatre.yaml` (mauvaise extension)

Structure
=========

Artistes
--------

Les données concernant les artistes sont partagées entre toutes les villes présentes sur le site.
Elle sont dans le dossier [artists](artists).

Dans ce dossier, chaque fichier `.yml` contient les données relative à un unique artiste.
Le nom de base du fichier devrait être une version simplifiée du nom de l'artiste
(accents enlevés ; articles supprimés sauf s'ils sont importants ; espaces, apostrophes et autres caractères spéciaux supprimés ou remplacés par des tirets `-`).

Exemples:

  - `beatles.yml` pour [Les Beatles](https://fr.wikipedia.org/wiki/The_Beatles)
  - `the-who.yml` pour [The Who](https://fr.wikipedia.org/wiki/The_Who)

Exemple de fichier `the-who.yml` (@todo Compléter):

    name: The Who

Villes
======

Dans le dossier [cities](cities), chaque fichier représente une ville.

Exemple de fichier `reims.yml` (@todo Compléter):

    name: Reims

À coté de chaque fichier de ville, un dossier, avec le *même* nom de base, contient les lieux et les événements de cette ville.

Lieux
=====

Dans le dossier [locations](cities/reims/locations) de chaque ville, chaque fichier représente un lieu de spectacle.

Exemple de fichier `cartonnerie.yml` (@todo Compléter):

    name: La Cartonnerie

Événements
==========

Les informations relative aux événements sont dans le dossier [events](cities/reims/events) de chaque ville.

Chaque fichier contient une liste d'événements.
Le nom du fichier correspond au tag principal (voir "Tags" ci-dessous) des événements qu'il contient.

Exemple de fichier `musique.yml` (@todo Compléter):

- datetime: 2018/06/04 19:00
  artist: zinzin
  location: cartonnerie
- datetime: 2018/06/04 21:00
  artist: beatles
  location: fond_droite
- artist: rolling_stones
  location: erlon
  occurrences:
    - datetime: 2018/06/11 20:00
    - datetime: 2018/06/20 20:00

Les champs "artist" et "location" contiennent respectivement une référence vers un artiste et une référence vers un lieu.
Ces références sont les slugs (c.-à-d. les noms de base des fichiers) de cet artistes et ce lieu.

Pour les événements ne se produisant qu'une fois, le champ "datetime" contient la date et l'heure du début de l'événement,
au format "AAAA/MM/JJ hh:mm".
Pour les événements avec plusieurs représentations, le champs "occurrences" contient une liste de "datetime" similaires.

Tags
====

@todo Documenter
