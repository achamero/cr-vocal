# cr-vocal

Application de compte rendu assistée par IA — Guide utilisateur


📅 Avril 2026
✍️ Conçu et réalisé par A. Cham
🤖 IA : Groq (Llama 3.3 + Whisper)
🌐 Chrome · Android · iOS · PC
Guide utilisateur
Présentation
CR Vocal transforme un enregistrement audio ou une dictée en compte rendu structuré, prêt à exporter en Word ou PDF. L'application fonctionne entièrement dans le navigateur Chrome, sans installation.

Prérequis : Chrome sur Android, iOS ou PC. Une connexion internet est nécessaire pour la transcription et la structuration IA.
Workflow standard
Renseigner les métadonnées
Objet, date, durée, participants — tous les champs sont optionnels et seront déduits ou estimés automatiquement si laissés vides.
Choisir la source audio
Onglet
🎙 Dictée micro
pour dicter en temps réel, ou onglet
📁 Fichier audio
pour importer un enregistrement (MP3, AAC, M4A, WAV…).
Obtenir la transcription
En dictée : la transcription s'affiche en temps réel. Pour un fichier : cliquer sur
Transcrire →
. Vous pouvez aussi coller du texte directement dans le champ.
Structurer avec l'IA
Cliquer sur
✨ Structurer avec IA
. L'IA organise la transcription en sections : objet, participants, points abordés, décisions, actions, prochaine étape.
Exporter
Boutons
⬇ Word
et
⬇ PDF
dans la barre du bas. Le fichier est nommé automatiquement : yyyymmdd Nom Réunion CR.docx
Dictée micro
Appuyer sur le bouton rouge pour démarrer, appuyer à nouveau pour arrêter. La transcription s'accumule en temps réel. L'écran reste allumé pendant l'enregistrement (Wake Lock).

Sur Android : Chrome peut interrompre le micro après quelques minutes si l'application passe en arrière-plan. Garder l'écran allumé et l'application au premier plan. Parler distinctement à 20-30 cm du micro, éviter le bruit de fond.
Astuce : Marquer une courte pause entre chaque phrase réduit les répétitions de capture sur Android.
Import fichier audio
Glisser-déposer ou sélectionner un fichier. Les fichiers volumineux sont automatiquement découpés en segments de 10 Mo et transcrits séquentiellement. La progression est affichée.

Quota Groq : La limite gratuite est de 120 minutes d'audio par heure. En cas de dépassement, l'application attend automatiquement le délai indiqué par Groq avant de reprendre.
Modèle Word personnalisé
Vous pouvez fournir un fichier .docx comme modèle de mise en forme. Insérez des balises {{...}} aux endroits où l'IA doit insérer du contenu :

Balise	Contenu inséré
{{sujet}} ou {{objet}}	Titre ou objet de la réunion
{{date}}	Date de la réunion
{{durée}}	Durée estimée ou saisie
{{participants}}	Liste des participants identifiés
{{nombre de participants}}	Nombre de participants
{{points abordés}}	Développement des points discutés
{{décisions}}	Décisions prises
{{actions}}	Actions à mener (qui, quoi, quand)
{{prochaine étape}}	Prochains jalons
{{n'importe quelle balise}}	L'IA interprète et remplit intelligemment
Sans modèle : L'IA utilise une structure standard avec sections fixes (objet, participants, points, décisions, actions, agenda).
Clé IA gratuite
L'application utilise par défaut une clé Groq partagée. Pour éviter les limites de quota ou utiliser votre propre compte :

Créer un compte gratuit sur console.groq.com
Générer une clé API (API Keys → Create API Key)
Coller la clé dans le champ 🔑 de l'application
La clé est sauvegardée localement dans votre navigateur et n'est jamais transmise ailleurs que vers Groq directement.

Propriétés des fichiers exportés
Propriété	Valeur
Auteur	Cham IA
Titre	Objet de la réunion
Mots-clés	Objet + participants + titres des points abordés
Nommage	yyyymmdd Nom CR.docx ou yyyymmdd Nom Transcript.pdf


User Stories

🎙 Capture audio

US-01 CORE ANDROID
Dictée micro en temps réel
En tant qu'utilisateur, je veux dicter ma réunion à voix haute pour obtenir une transcription automatique sans saisir de texte.
Le micro démarre au clic sur le bouton rouge
La transcription s'affiche en temps réel
L'écran reste allumé (Wake Lock)
Sur Android : mode non-continu pour réduire les répétitions
La durée de session est estimée automatiquement

US-02 CORE Import fichier audio
En tant qu'utilisateur, je veux importer un enregistrement audio existant pour le transcrire sans avoir à dicter en temps réel.
Formats supportés : MP3, AAC, M4A, WAV, OGG, WebM
Fichiers volumineux découpés automatiquement en segments de 10 Mo
Progression affichée segment par segment
Gestion automatique du quota Groq avec attente et retry
Glisser-déposer et sélection par clic supportés

US-03 CORE Saisie ou collage manuel
En tant qu'utilisateur, je veux pouvoir coller ou saisir du texte directement dans la zone de transcription.
Zone de texte éditable librement
Bouton "Effacer" disponible
Les boutons export s'activent dès qu'il y a du texte


🤖 Structuration IA

US-04 IA Structuration automatique du CR
En tant qu'utilisateur, je veux que l'IA transforme ma transcription brute en compte rendu structuré et lisible.
Sections : objet & contexte, participants, points abordés, décisions, actions (tableau Qui/Quoi/Quand), prochaine étape
Chaque point développé : contexte, irritant, besoin, propositions, points saillants
Sections vides masquées automatiquement
Titre auto-généré si non saisi

US-05 IA Estimation automatique des métadonnées
En tant qu'utilisateur, je ne veux pas avoir à renseigner manuellement tous les champs s'ils peuvent être déduits.
Titre déduit du contenu si champ vide
Participants identifiés dans la transcription
Durée estimée depuis le chrono micro ou la transcription
Date extraite de la date du fichier audio

US-06 IA Modèle Word personnalisé
En tant qu'utilisateur, je veux que l'IA remplisse mon propre modèle de CR plutôt qu'un format générique.
Upload d'un fichier .docx comme modèle
Structure extraite et transmise à l'IA
Balises {{...}} remplacées intelligemment
Toute balise descriptive est interprétée
Modèle conservé entre les sessions

US-07 IA Clé IA personnelle
En tant qu'utilisateur avancé, je veux utiliser mon propre compte Groq pour ne pas dépendre du quota partagé.
Champ de saisie de clé Groq dans l'interface
Clé sauvegardée localement (localStorage)
Transcription audio directe depuis le navigateur (pas de timeout serveur)
Lien vers console.groq.com pour créer une clé
📤 Export

US-08 EXPORT Export Word (.docx)
En tant qu'utilisateur, je veux exporter mon CR en fichier Word éditable.
Génération côté navigateur (pas de serveur)
Titres hiérarchisés, listes, tableaux
Métadonnées : auteur "Cham IA", titre, mots-clés
Nommage : yyyymmdd Nom CR.docx
Si CR non structuré : export du transcript brut

US-09 EXPORT Export PDF
En tant qu'utilisateur, je veux exporter mon CR en PDF prêt à partager.
Rendu multi-page avec pagination automatique
Métadonnées PDF : auteur, titre, mots-clés
Nommage : yyyymmdd Nom CR.pdf
Si CR non structuré : export du transcript brut


🎨 Expérience utilisateur

US-10 UX Interface mobile-first
En tant qu'utilisateur sur smartphone, je veux une interface adaptée à l'écran de mon téléphone.
Responsive sur tous les formats d'écran
Boutons suffisamment larges pour une utilisation tactile
Installable en PWA via "Ajouter à l'écran d'accueil"

US-11 UX Réinitialisation sans perdre le modèle
En tant qu'utilisateur, je veux pouvoir démarrer un nouveau CR sans avoir à recharger le modèle Word ou la clé.
Bouton "🔄 Nouveau" remet à zéro transcription, CR et métadonnées
Modèle Word et clé IA conservés
Date remise à aujourd'hui automatiquement

US-12 UX Prévisualisation du CR avant export
En tant qu'utilisateur, je veux voir le CR structuré dans l'interface avant d'exporter.
CR affiché dans l'app après structuration
Mode modèle : aperçu Markdown rendu en HTML
Mode standard : sections organisées avec tableaux

US-13 ANDROID
Maintien de l'écran allumé
En tant qu'utilisateur sur Android, je veux que l'écran reste allumé pendant l'enregistrement pour ne pas interrompre la dictée.
Wake Lock API activée au démarrage de l'enregistrement
Wake Lock ré-acquise si l'écran se rallume
Libérée à l'arrêt de l'enregistrement
