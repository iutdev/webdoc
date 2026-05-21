# Note d'intention — Webdoc
## « Comment la musique a propulsé des révolutions dans le monde »

**Groupe A** — Arsenii Kostenko, Loan Fages, Ewen Raison, Arthur Phisbien  
**Formation** : IUT Toulouse — R2.13  
**Date** : 2026

---

## 1. Présentation du projet

Ce webdoc propose une exploration interactive et pédagogique de la manière dont la musique a propulsé des révolutions à travers le monde. De l'Antiquité grecque jusqu'à aujourd'hui, il s'agit de montrer comment la musique a été un moteur de changement politique et social — des chants de révolte aux hymnes de libération, du gospel américain au rap iranien, du rock soviétique à la salsa cubaine.

Le projet s'adresse à un **grand public curieux**, sans prérequis historique ou musicologique particulier. L'objectif est de rendre accessible une réflexion profonde sur le pouvoir de la musique comme arme de résistance et vecteur de révolution, à travers une expérience immersive mêlant globe 3D, carte interactive, chronologies et archives musicales.

---

## 2. Problématique

> **Comment la musique a-t-elle propulsé des révolutions politiques et sociales à travers le monde, de l'Antiquité à nos jours ?**

La musique n'est jamais neutre. Selon les époques et les pays, elle a été un outil de libération, un cri de résistance, un vecteur d'espoir et un moteur de changement. Des chants des esclaves américains au hip-hop contestataire, du reggae de Bob Marley à la Nueva Trova cubaine, ce webdoc explore comment la musique a changé le monde.

---

## 3. Périmètre géographique et temporel

### Pays couverts
- France
- Allemagne
- Espagne
- Italie
- Royaume-Uni
- États-Unis
- Brésil
- Cuba
- Afrique du Sud
- Jamaïque
- Inde
- Russie
- Iran
- Chili
- Argentine
- Chine
- Ukraine
- Europe de l'Est / Bloc soviétique (Pologne, Tchécoslovaquie, Hongrie…)
- Scandinavie (Suède et/ou Norvège)
- Grèce

### Période
De l'**Antiquité** (musique grecque antique et son rôle dans la cité) jusqu'à **aujourd'hui** (rap, hip-hop, musiques électroniques et enjeux contemporains).

---

## 4. Angle éditorial

L'angle central est **la musique comme moteur de révolution** :

- **La musique comme arme de résistance** : chants de révolte, gospel et droits civiques, reggae de libération, rock contestataire, rap des ghettos, Nueva Canción latino-américaine.
- **La musique comme force de changement social** : comment les artistes ont mobilisé les foules, contourné la censure et fait basculer l'histoire.
- **La musique comme acte de résistance face à l'oppression** : de l'apartheid à la dictature, du totalitarisme à l'occupation.

Le ton est **pédagogique et accessible**, sans être simpliste. Chaque fiche pays illustre comment la musique a changé le cours de l'histoire dans ce territoire.

---

## 5. Page d'accueil

L'utilisateur arrive sur une page d'accueil immersive avec :

- Un **globe 3D interactif** qui commence dans un style de carte ancienne, se transforme en globe moderne, puis en hologramme — symbolisant l'évolution du regard sur le monde.
- Une **question provocatrice** comme accroche principale : *"Et si la musique avait changé le monde ?"*
- Accompagnée d'une **citation de Pythagore** pour poser l'ambiance intellectuelle.
- Un bouton **"Entrer"** qui mène à la carte interactive mondiale.

---

## 6. Structure de navigation

### Architecture globale

```
Page d'Accueil
  → Globe 3D animé (vintage → moderne → hologramme) + accroche + bouton "Entrer"
      ↓
Carte Interactive du Monde (stylisée / D3)
  → Frise chronologique en bas + boutons d'époques
  → Zoom et navigation sur la carte mondiale
      ↓ (clic sur un pays)
Page d'introduction du pays
  → Figure emblématique du pays (portrait visuel)
  → La figure "guide" l'utilisateur avec des commentaires à chaque époque
  → Extrait audio de présentation du style musical du pays / de l'époque
      ↓
Chronologie interactive du pays
  → Événements-clés, variables selon la richesse historique du pays
  → Volets : Visuel / Textuel / Audio
      ↓
Page À Propos & Sources
```

### La carte interactive
- Représentée en **carte mondiale interactive** utilisant D3.js avec projection Natural Earth.
- En bas de la carte : une **frise chronologique horizontale** combinée à des **boutons d'époques cliquables** (Antiquité / Moyen-Âge / Renaissance / XIXe / XXe / XXIe).
- Possibilité de zoomer et de se déplacer sur la carte pour explorer tous les continents.
- Les pays avec des données sont mis en évidence au survol.
- La navigation est **non-linéaire** : l'utilisateur peut passer d'un pays à l'autre, changer d'époque, ou revenir à l'accueil à tout moment.

---

## 7. Les fiches pays

### La figure emblématique
Chaque pays est incarné par une **figure historique emblématique**, choisie en cohérence avec le territoire et la période la plus représentative de ce pays :

- La figure est représentée par un **portrait visuel** (illustration ou photo d'archive).
- Elle **guide l'utilisateur tout au long de la chronologie**, avec de courts commentaires contextuels à chaque époque — comme si elle prenait la parole pour éclairer les événements.
- Elle est propre à chaque pays : Mozart ne représentera pas l'Ukraine, un *kobzar* ukrainien ne représentera pas l'Italie.
- Pour les pays couvrant une très longue période (ex : Grèce, de l'Antiquité à aujourd'hui), **une figure par grande époque** sera privilégiée, permettant un relais narratif cohérent.

Exemples de figures :
| Pays | Figure(s) |
|---|---|
| France | Édith Piaf / Georges Brassens |
| Allemagne | Johann Sebastian Bach |
| Espagne | Federico García Lorca |
| Italie | Giuseppe Verdi |
| Royaume-Uni | David Bowie |
| États-Unis | Nina Simone |
| Brésil | Caetano Veloso |
| Cuba | Silvio Rodríguez |
| Afrique du Sud | Miriam Makeba |
| Jamaïque | Bob Marley |
| Inde | Rabindranath Tagore |
| Russie | Viktor Tsoi |
| Iran | Mohammad Reza Shajarian |
| Chili | Víctor Jara |
| Ukraine | Taras Chevtchenko |
| Europe de l'Est | Dmitri Chostakovitch |
| Scandinavie | ABBA (Suède) |
| Grèce | Pythagore / Mikis Theodorakis |

### Contenu de la chronologie
- Nombre d'événements **variable selon les pays**, selon la richesse historique disponible.
- Chaque événement s'articule autour de trois volets :

| Volet | Contenu |
|---|---|
| **Visuel** | Photos d'archives, affiches, portraits d'artistes, imagerie d'époque |
| **Textuel** | Article explicatif + repères chronologiques |
| **Audio** | Extrait musical illustratif du style de l'époque + interview (à venir) |

### La dimension sonore des fiches
Chaque fiche pays intègre des **extraits musicaux de présentation** permettant à l'utilisateur d'*entendre* le style musical propre à chaque époque et territoire, avant même de lire. L'audio est au cœur de l'expérience, pas seulement en complément.

---

## 8. Interviews et témoignages

Des interviews sont prévues pour enrichir les fiches pays : musiciens, historiens, ethnomusicologues ou acteurs culturels susceptibles de témoigner du rapport entre musique, culture et politique dans leur pays.

**Statut actuel** : contacts à établir. Les interviews seront enregistrées avec une caméra Sony ZV-E10 ou un smartphone, et intégrées dans le volet Audio de chaque fiche.

En l'absence d'interviews, des **archives sonores et visuelles** (discours, enregistrements d'époque, documentaires existants) seront utilisées.

---

## 9. Page À propos & Sources

Une page dédiée, accessible depuis le menu principal, comprenant :

- **Présentation de l'équipe** : les quatre membres du groupe, leurs rôles respectifs.
- **Démarche éditoriale** : pourquoi ce sujet, comment il a été abordé, les partis pris narratifs.
- **Sources bibliographiques et médiatiques** : références historiques, musicologiques, archives utilisées.
- **Contexte du projet** : réalisé dans le cadre du cours R2.13 à l'IUT de Toulouse.
- **Remerciements** : interviewés, personnes ressources, enseignants.

---

## 10. Choix techniques

### Support cible
Le webdoc est conçu en priorité pour une **consultation sur ordinateur**, la richesse de la carte interactive et des chronologies nécessitant un écran suffisamment grand pour une expérience optimale.

### Matériel
| Usage | Matériel |
|---|---|
| Prise de vue | Sony ZV-E10 ou smartphone |
| Prise de son | Microphone intégré caméra / téléphone |
| Stabilisation | Trépied |
| Montage / Post-prod | PC Linux |

### Logiciels
| Logiciel | Rôle |
|---|---|
| VSCode | Développement web (HTML, CSS, JS) |
| DaVinci Resolve Studio | Montage vidéo interviews et reportages |
| Bitwig Studio | Enregistrement et montage audio |
| Adobe Photoshop | Retouche photos, colorisation d'archives |
| Canva / Figma | Maquettage interface et créations graphiques |

### Hébergement
Libre choix d'hébergement — aucune contrainte imposée par l'enseignant.

---

## 11. Planning

| Phase | Contenu | Échéance | Statut |
|---|---|---|---|
| **Phase 1** | Problématique, recherches documentaires | Janv.–Fév. 2026 | ✅ Terminé |
| **Phase 2** | Contacts interviews, rédaction fiches pays, filmage | Mars–Avril 2026 | 🔄 En cours |
| **Phase 3** | Montage vidéo/son, intégration médias, tests navigation | Mai 2026 | ⏳ À venir |
| **Phase 4** | Mise en ligne, rendu final, bilan de projet | Juin 2026 | ⏳ À venir |

---

## 12. Ambitions et enjeux

Ce webdoc ambitionne de **dépasser le simple cours d'histoire** pour proposer une expérience immersive et sensible. En associant archives visuelles, extraits musicaux, figures narratives incarnées et récits contextualisés, il invite l'utilisateur à *entendre* l'histoire autant qu'à la lire.

La figure emblématique par pays humanise le propos : ce n'est plus seulement un récit abstrait, c'est une voix, un visage, une musique. L'utilisateur ne consulte pas une encyclopédie — il voyage.

Il répond également à un enjeu de **mémoire culturelle** : rappeler que la musique, souvent perçue comme un simple divertissement, est en réalité profondément politique — et qu'elle l'a toujours été, de la Grèce antique aux scènes underground du XXIe siècle.
