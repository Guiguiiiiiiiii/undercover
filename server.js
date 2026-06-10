const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

const lobbies = {};

const gameThemes = {
    "Mots Lambdas": [ 
        ["Bière", "Vin"], ["Café", "Thé"], ["Coca", "Oasis"], ["Pizza", "Burger"], ["Frites", "Chips"], ["Nutella", "Confiture"], ["Beurre", "Crème"], ["Sucre", "Miel"], ["Ketchup", "Moutarde"], ["Mayo", "Vinaigrette"], ["Pâtes", "Riz"], ["Soupe", "Purée"], ["Pain", "Brioche"], ["Gâteau", "Tarte"], ["Pomme", "Poire"], ["Fraise", "Framboise"], ["Orange", "Citron"], ["Banane", "Avocat"], ["Poulet", "Jambon"], ["Thon", "Saumon"], ["Lait", "Yaourt"], ["Fromage", "Dessert"], ["Sel", "Poivre"], ["Bonbon", "Chocolat"], ["Glace", "Sorbet"], ["Lit", "Canapé"], ["Chaise", "Tabouret"], ["Table", "Bureau"], ["Coussin", "Oreiller"], ["Tapis", "Moquette"], ["Rideau", "Store"], ["Miroir", "Vitre"], ["Lampe", "Bougie"], ["Horloge", "Montre"], ["Cadre", "Poster"], ["Porte", "Fenêtre"], ["Clé", "Badge"], ["Valise", "Sac"], ["Stylo", "Crayon"], ["Cahier", "Livre"], ["Agenda", "Calendrier"], ["Lettre", "Mail"], ["Journal", "Magazine"], ["T-shirt", "Chemise"], ["Pull", "Veste"], ["Pantalon", "Short"], ["Robe", "Jupe"], ["Basket", "Botte"], ["Chapeau", "Casquette"], ["Bonnet", "Écharpe"], ["Gants", "Moufles"], ["Chaussette", "Collant"], ["Ceinture", "Bretelles"], ["Pyjama", "Peignoir"], ["Maillot", "Slip"], ["Bague", "Collier"], ["Montre", "Chrono"], ["Lunettes", "Lentilles"], ["Parapluie", "Manteau"], ["Savon", "Shampoing"], ["Parfum", "Déodorant"], ["Brosse", "Peigne"], ["Rasoir", "Ciseaux"], ["Serviette", "Peignoir"], ["Dentifrice", "Colluctoire"], ["Miroir", "Maquillage"], ["Douche", "Bain"], ["Balai", "Aspirateur"], ["Éponge", "Chiffon"], ["Poubelle", "Sac"], ["Fer", "Centrale"], ["Bassine", "Seau"], ["Casserole", "Poêle"], ["Four", "Microondes"], 
        ["Frigo", "Congélateur"], ["Bouilloire", "Cafetière"], ["Assiette", "Bol"], ["Verre", "Tasse"], ["Couteau", "Fourchette"], ["Cuillère", "Louche"], ["Décapsuleur", "Tirebouchon"], ["Balance", "Minuteur"], ["Torchon", "Tablier"], ["Alarme", "Sirene"], ["Téléphone", "Tablette"], ["Ordinateur", "Télévision"], ["Écran", "Projecteur"], ["Enceinte", "Casque"], ["Télécommande", "Manette"], ["Prise", "Câble"], ["Batterie", "Chargeur"], ["Pile", "Batterie"], ["Console", "Pc"], ["Radio", "Podast"], ["Appareil", "Caméra"], ["Voiture", "Moto"], ["Vélo", "Trottinette"], ["Camion", "Bus"], ["Train", "Métro"], ["Avion", "Hélicoptère"], ["Bateau", "Sousmarin"], ["Taxi", "Ambulance"], ["Fusée", "Satellite"], ["Tramway", "Rer"], ["Scooter", "Mobylette"], ["Caravane", "Tente"], ["Route", "Autoroute"], ["Rue", "Avenue"], ["Pont", "Tunnel"], ["Trottoir", "Piste"], ["Gare", "Aéroport"], ["Parking", "Garage"], ["Station", "Borne"], ["Ticket", "Carte"], ["Volant", "Guidon"], ["Phare", "Klaxon"], ["Pneu", "Roue"], ["Moteur", "Batterie"], ["Permis", "Passeport"], ["Clé", "Télécommande"], ["Mer", "Océan"], ["Lac", "Rivière"], ["Piscine", "Plage"], ["Cascade", "Ruisseau"], ["Vague", "Marée"], 
        ["Île", "Presquîle"], ["Montagne", "Colline"], ["Forêt", "Bois"], ["Désert", "Plaine"], ["Grotte", "Falaise"], ["Campagne", "Village"], ["Volcan", "Cratère"], ["Banquise", "Glacier"], ["Vallée", "Canyon"], ["Prairie", "Champ"], ["Rocher", "Caillou"], ["Sable", "Boue"], ["Pluie", "Neige"], ["Vent", "Tempête"], ["Orage", "Éclair"], ["Brouillard", "Nuage"], ["Soleil", "Lune"], ["Étoile", "Planète"], ["Chaleur", "Canicule"], ["Froid", "Givre"], ["Ombre", "Lumière"], ["Matin", "Soir"], ["Jour", "Nuit"], ["Chien", "Chat"], ["Loup", "Renard"], ["Lion", "Tigre"], ["Cheval", "Poney"], ["Souris", "Rat"], ["Lapin", "Lièvre"], ["Mouton", "Chèvre"], ["Vache", "Taureau"], ["Cochon", "Sanglier"], ["Singe", "Gorille"], ["Ours", "Panda"], ["Écureuil", "Hérisson"], ["Cerf", "Chevreuil"], ["Dauphin", "Requin"], ["Baleine", "Orque"], ["Tortue", "Lézard"], ["Serpent", "Vipère"], ["Grenouille", "Crapaud"], ["Crocodile", "Alligator"], ["Pigeon", "Moineau"], ["Corbeau", "Pie"], ["Aigle", "Faucon"], ["Hibou", "Chouette"], ["Canard", "Cygne"], ["Poule", "Coq"], ["Perroquet", "Perruche"], ["Abeille", "Guêpe"], ["Fourmi", "Araignée"], ["Moustique", "Mouche"], ["Papillon", "Libellule"], ["Escargot", "Limace"], ["Poisson", "Crevette"], ["Arbre", "Plante"], ["Fleur", "Rose"], ["Herbe", "Pelouse"], ["Feuille", "Branche"], ["Tronc", "Racine"], ["Graine", "Fruit"], ["Sapin", "Pin"], ["Cactus", "Bambou"], 
        ["Champignon", "Mousse"], ["Blé", "Maïs"], ["Vigne", "Raisin"], ["Pomme", "Tomate"], ["Carotte", "Pomme"], ["Salade", "Chou"], ["Oignon", "Ail"], ["Amande", "Noisette"], ["Cinéma", "Théâtre"], ["Concert", "Festival"], ["Musée", "Expo"], ["Cirque", "Cabaret"], ["Match", "Stade"], ["Carnaval", "Fête"], ["Film", "Série"], ["Roman", "Bd"], ["Journal", "Magazine"], ["Chanson", "Musique"], ["Dessin", "Peinture"], ["Photo", "Vidéo"], ["Acteur", "Réalisateur"], ["Danse", "Gym"], ["Piano", "Guitare"], ["Batterie", "Tamtam"], ["Violon", "Flûte"], ["Micro", "Enceinte"], ["Jeu", "Jouet"], ["Cartes", "Dés"], ["Échecs", "Dames"], ["Puzzle", "Lego"], ["Billard", "Bowling"], ["Fléchettes", "Cible"], ["Sport", "Fitness"], ["Foot", "Rugby"], ["Basket", "Hand"], ["Tennis", "Pingpong"], ["Course", "Marche"], ["Natation", "Plongée"], ["Ski", "Luge"], ["Boxe", "Judo"], ["Vélo", "Vtt"], ["Randonnée", "Escalade"], ["Équitation", "Poney"], ["Golf", "Croquet"], ["Gym", "Danse"], ["Skate", "Roller"], ["Surf", "Wake"], ["Hôtel", "Camping"], ["Gîte", "Chambre"], 
        ["Voyage", "Vacances"], ["Plage", "Piscine"], ["Valise", "Sacoche"], ["Passeport", "Visa"], ["Train", "Avion"], ["Guide", "Carte"], ["Souvenir", "Cadeau"], ["École", "Collège"], ["Lycée", "Université"], ["Classe", "Amphi"], ["Prof", "Maître"], ["Élève", "Étudiant"], ["Cours", "Leçon"], ["Examen", "Contrôle"], ["Devoir", "Exercice"], ["Note", "Moyenne"], ["Diplôme", "Brevet"], ["Bureau", "Tableau"], ["Récréation", "Cantine"], ["Rentrée", "Vacances"], ["Stylo", "Règle"], ["Cahier", "Classeur"], ["Sac", "Cartable"], ["Hôpital", "Clinique"], ["Pharmacie", "Laboratoire"], ["Cabinet", "Urgences"], ["Docteur", "Médecin"], ["Infirmier", "Pharmacien"], ["Patient", "Client"], ["Maladie", "Grippe"], ["Sirop", "Pilule"], ["Piqûre", "Vaccin"], ["Pansement", "Plâtre"], ["Radio", "Scanner"], ["Sieste", "Sommeil"], ["Fatigue", "Stress"], ["Santé", "Régime"], ["Mairie", "Préfecture"], ["Tribunal", "Bureau"], ["Commissariat", "Caserne"], ["Prison", "Cellule"], ["Juge", "Avocat"], ["Police", "Gendarme"], ["Enquête", "Procès"], ["Loi", "Règle"], ["Crime", "Vol"], ["Prisonnier", "Gardien"], ["Alibi", "Preuve"], ["Amende", "Contravention"], 
        ["Code", "Mot"], ["Signature", "Tampon"], ["Banque", "Bourse"], ["Argent", "Cash"], ["Carte", "Billet"], ["Pièce", "Monnaie"], ["Chèque", "Virement"], ["Compte", "Épargne"], ["Crédit", "Prêt"], ["Prix", "Tarif"], ["Achat", "Vente"], ["Caisse", "Rayon"], ["Panier", "Chariot"], ["Or", "Argent"], ["Bijou", "Diamant"], ["Coffre", "Tirelire"], ["Facture", "Ticket"], ["Client", "Vendeur"], ["Église", "Cathédrale"], ["Temple", "Mosquée"], ["Prêtre", "Curé"], ["Pape", "Cardinal"], ["Moine", "Sœur"], ["Messe", "Prière"], ["Bible", "Coran"], ["Autel", "Croix"], ["Cloche", "Carillon"], ["Ange", "Diable"], ["Paradis", "Enfer"], ["Saint", "Statue"], ["Château", "Palais"], ["Tour", "Donjon"], ["Fort", "Citadelle"], ["Mur", "Muraille"], ["Ruines", "Vestiges"], ["Musée", "Monument"], ["Trône", "Couronne"], ["Roi", "Prince"], ["Reine", "Princesse"], ["Chevalier", "Soldat"], ["Épée", "Bouclier"], ["Arc", "Flèche"], ["Canon", "Fusil"], ["Drapeau", "Bannière"], ["Usine", "Atelier"], ["Chantier", "Travaux"], ["Grue", "Tracteur"], ["Bureau", "Siège"], ["Magasin", "Boutique"], ["Supermarché", "Supérette"], ["Marché", "Foire"], ["Boulangerie", "Pâtisserie"], ["Boucherie", "Traiteur"], ["Resto", "Bistro"], ["Bar", "Pub"], ["Salon", "Coiffeur"], ["Poste", "Banque"], ["Tabac", "Presse"], ["Librairie", "Bibliothèque"], ["Cinéma", "Théâtre"], ["Zoo", "Aquarium"], ["Parc", "Jardin"], ["Piscine", "Patinoire"], ["Salle", "Club"], ["Ville", "Métropole"], ["Banlieue", "Centre"], ["Quartier", "Zone"], ["Immeuble", "Tour"], ["Maison", "Villa"], ["Appartement", "Studio"], ["Studio", "Logement"], ["Toit", "Cheminée"], ["Façade", "Mur"], ["Fenêtre", "Balcon"], ["Escalier", "Ascenseur"], ["Couloir", "Entrée"], ["Salon", "Séjour"], ["Cuisine", "Kitchenette"], ["Chambre", "Bureau"], ["Douche", "Toilettes"], ["Jardin", "Cour"], ["Clôture", "Haie"], ["Portail", "Portillon"], ["Allée", "Chemin"], ["Clou", "Vis"], ["Marteau", "Tournevis"], ["Scie", "Hache"], ["Pince", "Cutter"], ["Colle", "Scotch"], ["Peinture", "Rouleau"], ["Échelle", "Escabeau"], 
        ["Planche", "Tréteau"], ["Fil", "Câble"], ["Pile", "Ampoule"], ["Lampe", "Torche"], ["Corde", "Ficelle"], ["Cadenas", "Verrou"], ["Clé", "Serrure"], ["Briquet", "Allumette"], ["Chiffon", "Éponge"], ["Seau", "Bassine"], ["Poubelle", "Sac"], ["Balai", "Pelle"], ["Savon", "Lessive"], ["Veste", "Blouson"], ["Pull", "Sweat"], ["Chemise", "T-shirt"], ["Pantalon", "Jean"], ["Short", "Bermudas"], ["Robe", "Jupe"], ["Pyjama", "Caleçon"], ["Manteau", "Veste"], ["Costume", "Smoking"], ["Uniforme", "Blouse"], ["Chapeau", "Bonnet"], ["Casquette", "Béret"], ["Écharpe", "Foulard"], ["Gants", "Moufles"], ["Ceinture", "Bretelles"], ["Cravate", "Nœud"], ["Chaussure", "Basket"], ["Botte", "Bottine"], ["Sandale", "Tongs"], ["Chausson", "Pantoufle"], ["Sac", "Sacoche"], ["Valise", "Sac"], ["Portefeuille", "Cartes"], ["Parapluie", "Parasol"], ["Lunettes", "Masque"], ["Montre", "Horloge"], ["Bague", "Alliance"], ["Collier", "Bracelet"], ["Boucle", "Pendentif"], ["Épinglette", "Badge"], ["Boulangerie", "Épicerie"], ["Boucher", "Charcutier"], ["Épicier", "Caissier"], ["Client", "Acheteur"], ["Monnaie", "Rendu"], ["Ticket", "Reçu"], ["Sac", "Sachet"], ["Rayon", "Tête"], ["Chariot", "Panier"], ["Balance", "Prix"], ["Pain", "Baguette"], ["Croissant", "Brioche"], ["Gâteau", "Éclair"], ["Tarte", "Flan"], ["Chocolat", "Confiserie"], ["Bonbon", "Chewinggum"], ["Sucre", "Édulcorant"], ["Miel", "Confiture"], ["Café", "Déca"], ["Thé", "Tisane"], ["Lait", "Crème"], ["Beurre", "Margarine"], ["Fromage", "Yaourt"], ["Œuf", "Omelette"], ["Jambon", "Saucisson"], ["Steak", "Escalope"], ["Poulet", "Dinde"], ["Saucisse", "Merguez"], ["Poisson", "Saumon"], ["Thon", "Sardine"], ["Crevette", "Moule"], ["Crabe", "Calamar"], ["Pâtes", "Riz"], ["Purée", "Frites"], ["Soupe", "Bouillon"], ["Salade", "Tomate"], ["Carotte", "Courgette"], ["Pomme", "Banane"], ["Fraise", "Cerise"], ["Orange", "Clémentine"], ["Citron", "Pamplemousse"], ["Pêche", "Abricot"], ["Melon", "Pastèque"], ["Raisin", "Prune"], ["Noisette", "Cacahuète"], ["Sel", "Moutarde"], ["Ketchup", "Mayo"], ["Huile", "Vinaigre"], ["Eau", "Soda"], ["Jus", "Sirop"], ["Bière", "Cidre"], ["Vin", "Champagne"], ["Rhum", "Whisky"], ["Cocktail", "Shot"], ["Glace", "Sorbet"], ["Crêpe", "Gaufre"], ["Gâteau", "Biscuit"], ["Chips", "Cacahuètes"], ["Pizza", "Quiche"], 
        ["Sandwich", "Wrap"], ["Kebab", "Tacos"], ["Burger", "Bagel"], ["Panini", "Croquemonsieur"], ["Frites", "Potatoes"], ["Sauce", "Fromage"], ["Café", "Expresso"], ["Thé", "Infusion"], ["Jus", "Nectar"], ["Bière", "Panaché"], ["Vin", "Sangria"], ["Vodka", "Gin"], ["Liqueur", "Sirop"], ["Sucre", "Sel"], ["Poivre", "Piment"], ["Ail", "Échalote"], ["Menthe", "Basilic"], ["Persil", "Ciboulette"], ["Huile", "Beurre"], ["Farine", "Levure"], ["Eau", "Glaçon"]
    ],
    "SNK": [
        ["Eren", "Sasha"], ["Mikasa", "Connie"], ["Armin", "Historia"], ["Livaï", "Ymir"], ["Erwin", "Floch"], ["Hansi", "Marco"], ["Jean", "Petra"], ["Sasha", "Keith"], ["Connie", "Reiner"], ["Historia", "Bertholdt"], ["Ymir", "Annie"], ["Floch", "Sieg"], ["Marco", "Pieck"], ["Petra", "Porco"], ["Keith", "Gabi"], ["Reiner", "Falco"], ["Bertholdt", "Pixis"], ["Annie", "Hannes"], ["Sieg", "Kenny Ackerman"], ["Pieck", "Grisha Yeager"], ["Porco", "Willy Tybur"], ["Gabi", "Lara"], ["Falco", "Magath"], ["Pixis", "Yelena"], ["Hannes", "Onyankopon"], ["Kenny Ackerman", "Niccolo"], ["Grisha Yeager", "Eren"], ["Willy Tybur", "Mikasa"], ["Lara", "Armin"], ["Magath", "Livaï"], ["Yelena", "Erwin"], ["Onyankopon", "Hansi"], ["Niccolo", "Jean"], ["Eren", "Marco"], ["Mikasa", "Petra"], ["Armin", "Keith"], ["Livaï", "Reiner"], ["Erwin", "Bertholdt"], ["Hansi", "Annie"], ["Jean", "Sieg"], ["Sasha", "Pieck"], ["Connie", "Porco"], ["Historia", "Gabi"], ["Ymir", "Falco"], ["Floch", "Pixis"], ["Marco", "Hannes"], ["Petra", "Kenny Ackerman"], ["Keith", "Grisha Yeager"], ["Reiner", "Willy Tybur"], ["Bertholdt", "Lara"], ["Annie", "Magath"], ["Sieg", "Yelena"], ["Pieck", "Onyankopon"], ["Porco", "Niccolo"], ["Gabi", "Eren"], ["Falco", "Mikasa"], ["Pixis", "Armin"], ["Hannes", "Livaï"], ["Kenny Ackerman", "Erwin"], ["Grisha Yeager", "Hansi"], ["Willy Tybur", "Jean"], ["Lara", "Sasha"], ["Magath", "Connie"], ["Yelena", "Historia"], ["Onyankopon", "Ymir"], ["Niccolo", "Floch"], ["Eren", "Armin"], ["Mikasa", "Livaï"], ["Armin", "Erwin"], ["Livaï", "Hansi"], ["Erwin", "Jean"], ["Hansi", "Sasha"], ["Jean", "Connie"], ["Sasha", "Historia"], ["Connie", "Ymir"], ["Historia", "Floch"], ["Ymir", "Marco"], ["Floch", "Petra"], ["Marco", "Keith"], ["Petra", "Reiner"], ["Keith", "Bertholdt"], ["Reiner", "Annie"], ["Bertholdt", "Sieg"], ["Annie", "Pieck"], ["Sieg", "Porco"], ["Pieck", "Gabi"], ["Porco", "Falco"], ["Gabi", "Pixis"], ["Falco", "Hannes"], ["Pixis", "Kenny Ackerman"], ["Hannes", "Grisha Yeager"], ["Kenny Ackerman", "Willy Tybur"], ["Grisha Yeager", "Lara"], ["Willy Tybur", "Magath"], ["Lara", "Yelena"], 
        ["Magath", "Onyankopon"], ["Yelena", "Niccolo"], ["Onyankopon", "Eren"], ["Niccolo", "Mikasa"], ["Eren", "Reiner"], ["Mikasa", "Bertholdt"], ["Armin", "Annie"], ["Livaï", "Sieg"], ["Erwin", "Pieck"], ["Hansi", "Porco"], ["Jean", "Gabi"], ["Sasha", "Falco"], ["Connie", "Pixis"], ["Historia", "Hannes"], ["Ymir", "Kenny Ackerman"], ["Floch", "Grisha Yeager"], ["Marco", "Willy Tybur"], ["Petra", "Lara"], ["Keith", "Magath"], ["Reiner", "Yelena"], ["Bertholdt", "Onyankopon"], ["Annie", "Niccolo"], ["Sieg", "Eren"], ["Pieck", "Mikasa"], ["Porco", "Armin"], ["Gabi", "Livaï"], ["Falco", "Erwin"], ["Pixis", "Hansi"], ["Hannes", "Jean"], ["Kenny Ackerman", "Sasha"], ["Grisha Yeager", "Connie"], ["Willy Tybur", "Historia"], ["Lara", "Ymir"], ["Magath", "Floch"], ["Yelena", "Marco"], ["Onyankopon", "Petra"], ["Niccolo", "Keith"], ["Eren", "Hansi"], ["Mikasa", "Jean"], ["Armin", "Sasha"], ["Livaï", "Connie"], ["Erwin", "Historia"], ["Hansi", "Ymir"], ["Jean", "Floch"], ["Sasha", "Marco"], ["Connie", "Petra"], ["Historia", "Keith"], ["Ymir", "Reiner"], ["Floch", "Bertholdt"], ["Marco", "Annie"], ["Petra", "Sieg"], ["Keith", "Pieck"], ["Reiner", "Porco"], ["Bertholdt", "Gabi"], ["Annie", "Falco"], ["Sieg", "Pixis"], ["Pieck", "Hannes"], ["Porco", "Kenny Ackerman"], ["Gabi", "Grisha Yeager"], ["Falco", "Willy Tybur"], ["Pixis", "Lara"], ["Hannes", "Magath"], ["Kenny Ackerman", "Yelena"], ["Grisha Yeager", "Onyankopon"], ["Willy Tybur", "Niccolo"], ["Lara", "Eren"], ["Magath", "Mikasa"], ["Yelena", "Armin"], ["Onyankopon", "Livaï"], ["Niccolo", "Erwin"], ["Eren", "Ymir"], ["Mikasa", "Floch"], ["Armin", "Marco"], ["Livaï", "Petra"], ["Erwin", "Keith"], ["Hansi", "Reiner"], ["Jean", "Bertholdt"], ["Sasha", "Annie"], ["Connie", "Sieg"], ["Historia", "Pieck"], ["Ymir", "Porco"], ["Floch", "Gabi"], ["Marco", "Falco"], ["Petra", "Pixis"], ["Keith", "Hannes"], ["Reiner", "Kenny Ackerman"], ["Bertholdt", "Grisha Yeager"], ["Annie", "Willy Tybur"], ["Sieg", "Lara"], ["Pieck", "Magath"], ["Porco", "Yelena"], ["Gabi", "Onyankopon"], ["Falco", "Niccolo"], ["Pixis", "Eren"], ["Hannes", "Mikasa"], 
        ["Kenny Ackerman", "Armin"], ["Grisha Yeager", "Livaï"], ["Willy Tybur", "Erwin"], ["Lara", "Hansi"], ["Magath", "Jean"], ["Yelena", "Sasha"], ["Onyankopon", "Connie"], ["Niccolo", "Historia"], ["Eren", "Connie"], ["Mikasa", "Historia"], ["Armin", "Ymir"], ["Livaï", "Floch"], ["Erwin", "Marco"], ["Hansi", "Petra"], ["Jean", "Keith"], ["Sasha", "Reiner"], ["Connie", "Bertholdt"], ["Historia", "Annie"], ["Ymir", "Sieg"], ["Floch", "Pieck"], ["Marco", "Porco"], ["Petra", "Gabi"], ["Keith", "Falco"], ["Reiner", "Pixis"], ["Bertholdt", "Hannes"], ["Annie", "Kenny Ackerman"], ["Sieg", "Grisha Yeager"], ["Pieck", "Willy Tybur"], ["Porco", "Lara"], ["Gabi", "Magath"], ["Falco", "Yelena"], ["Pixis", "Onyankopon"], ["Hannes", "Niccolo"], ["Kenny Ackerman", "Eren"], ["Grisha Yeager", "Mikasa"], ["Willy Tybur", "Armin"], ["Lara", "Livaï"], ["Magath", "Erwin"], ["Yelena", "Hansi"], ["Onyankopon", "Jean"], ["Niccolo", "Sasha"], ["Eren", "Keith"], ["Mikasa", "Reiner"], ["Armin", "Bertholdt"], ["Livaï", "Annie"], ["Erwin", "Sieg"], ["Hansi", "Pieck"], ["Jean", "Porco"], ["Sasha", "Gabi"], ["Connie", "Falco"], ["Historia", "Pixis"], ["Ymir", "Hannes"], ["Floch", "Kenny Ackerman"], ["Marco", "Grisha Yeager"], ["Petra", "Willy Tybur"], ["Keith", "Lara"], ["Reiner", "Magath"], ["Bertholdt", "Yelena"], ["Annie", "Onyankopon"], ["Sieg", "Niccolo"], ["Pieck", "Eren"], ["Porco", "Mikasa"], ["Gabi", "Armin"], ["Falco", "Livaï"], ["Pixis", "Erwin"], ["Hannes", "Hansi"], ["Kenny Ackerman", "Jean"], ["Grisha Yeager", "Sasha"], 
        ["Willy Tybur", "Connie"], ["Lara", "Historia"], ["Magath", "Ymir"], ["Yelena", "Floch"], ["Onyankopon", "Marco"], ["Niccolo", "Petra"], ["Eren", "Livaï"], ["Mikasa", "Erwin"], ["Armin", "Hansi"], ["Livaï", "Jean"], ["Erwin", "Sasha"], ["Hansi", "Connie"], ["Jean", "Historia"], ["Sasha", "Ymir"], ["Connie", "Floch"], ["Historia", "Marco"], ["Ymir", "Petra"], ["Floch", "Keith"], ["Marco", "Reiner"], ["Petra", "Bertholdt"], ["Keith", "Annie"], ["Reiner", "Sieg"], ["Bertholdt", "Pieck"], ["Annie", "Porco"], ["Sieg", "Gabi"], ["Pieck", "Falco"], ["Porco", "Pixis"], ["Gabi", "Hannes"], ["Falco", "Kenny Ackerman"], ["Pixis", "Grisha Yeager"], ["Hannes", "Willy Tybur"], ["Kenny Ackerman", "Lara"], ["Grisha Yeager", "Magath"], ["Willy Tybur", "Yelena"], ["Lara", "Onyankopon"], ["Magath", "Niccolo"], ["Yelena", "Eren"], ["Onyankopon", "Mikasa"], ["Niccolo", "Armin"], ["Eren", "Floch"], ["Mikasa", "Marco"], ["Armin", "Petra"], ["Livaï", "Keith"], ["Erwin", "Reiner"], ["Hansi", "Bertholdt"], ["Jean", "Annie"], ["Sasha", "Sieg"], 
        ["Connie", "Pieck"], ["Historia", "Porco"], ["Ymir", "Gabi"], ["Floch", "Falco"], ["Marco", "Pixis"], ["Petra", "Hannes"], ["Keith", "Kenny Ackerman"], ["Reiner", "Grisha Yeager"], ["Bertholdt", "Willy Tybur"], ["Annie", "Lara"], ["Sieg", "Magath"], ["Pieck", "Yelena"], ["Porco", "Onyankopon"], ["Gabi", "Niccolo"], ["Falco", "Eren"], ["Pixis", "Mikasa"], ["Hannes", "Armin"], ["Kenny Ackerman", "Livaï"], ["Grisha Yeager", "Erwin"], ["Willy Tybur", "Hansi"], ["Lara", "Jean"], ["Magath", "Sasha"], ["Yelena", "Connie"], ["Onyankopon", "Historia"], ["Niccolo", "Ymir"], ["Eren", "Jean"], ["Mikasa", "Sasha"], ["Armin", "Connie"], ["Livaï", "Historia"], ["Erwin", "Ymir"], ["Hansi", "Floch"], ["Jean", "Marco"], ["Sasha", "Petra"], ["Connie", "Keith"], ["Historia", "Reiner"], ["Ymir", "Bertholdt"], ["Floch", "Annie"], ["Marco", "Sieg"], ["Petra", "Pieck"], ["Keith", "Porco"], ["Reiner", "Gabi"], ["Bertholdt", "Falco"], ["Annie", "Pixis"], ["Sieg", "Hannes"], ["Pieck", "Kenny Ackerman"], ["Porco", "Grisha Yeager"], ["Gabi", "Willy Tybur"], ["Falco", "Lara"], ["Pixis", "Magath"], ["Hannes", "Yelena"], ["Kenny Ackerman", "Onyankopon"], ["Grisha Yeager", "Niccolo"], ["Willy Tybur", "Eren"], ["Lara", "Mikasa"], ["Magath", "Armin"], ["Yelena", "Livaï"], ["Onyankopon", "Erwin"], ["Niccolo", "Hansi"], ["Eren", "Bertholdt"], ["Mikasa", "Annie"], ["Armin", "Sieg"], ["Livaï", "Pieck"], ["Erwin", "Porco"], ["Hansi", "Gabi"], ["Jean", "Falco"], ["Sasha", "Pixis"], ["Connie", "Hannes"], ["Historia", "Kenny Ackerman"], ["Ymir", "Grisha Yeager"], ["Floch", "Willy Tybur"], ["Marco", "Lara"], ["Petra", "Magath"], ["Keith", "Yelena"], 
        ["Reiner", "Onyankopon"], ["Bertholdt", "Niccolo"], ["Annie", "Eren"], ["Sieg", "Mikasa"], ["Pieck", "Armin"], ["Porco", "Livaï"], ["Gabi", "Erwin"], ["Falco", "Hansi"], ["Pixis", "Jean"], ["Hannes", "Sasha"], ["Kenny Ackerman", "Connie"], ["Grisha Yeager", "Historia"], ["Willy Tybur", "Ymir"], ["Lara", "Floch"], ["Magath", "Marco"], ["Yelena", "Petra"], ["Onyankopon", "Keith"], ["Niccolo", "Reiner"], ["Eren", "Erwin"], ["Mikasa", "Hansi"], ["Armin", "Jean"], ["Livaï", "Sasha"], ["Erwin", "Connie"], ["Hansi", "Historia"], ["Jean", "Ymir"], ["Sasha", "Floch"], ["Connie", "Marco"], ["Historia", "Petra"], ["Ymir", "Keith"], ["Floch", "Reiner"], ["Marco", "Bertholdt"], ["Petra", "Annie"], ["Keith", "Sieg"], ["Reiner", "Pieck"], ["Bertholdt", "Porco"], ["Annie", "Gabi"], ["Sieg", "Falco"], ["Pieck", "Pixis"], ["Porco", "Hannes"], ["Gabi", "Kenny Ackerman"], ["Falco", "Grisha Yeager"], ["Pixis", "Willy Tybur"], ["Hannes", "Lara"], ["Kenny Ackerman", "Magath"], ["Grisha Yeager", "Yelena"], ["Willy Tybur", "Onyankopon"], ["Lara", "Niccolo"], ["Magath", "Eren"], ["Yelena", "Mikasa"], ["Onyankopon", "Armin"], ["Niccolo", "Livaï"], ["Eren", "Petra"], ["Mikasa", "Keith"], ["Armin", "Reiner"], ["Livaï", "Bertholdt"], ["Erwin", "Annie"], ["Hansi", "Sieg"], ["Jean", "Pieck"], ["Sasha", "Porco"], ["Connie", "Gabi"], ["Historia", "Falco"], ["Ymir", "Pixis"], ["Floch", "Hannes"], ["Marco", "Kenny Ackerman"], ["Petra", "Grisha Yeager"], ["Keith", "Willy Tybur"], ["Reiner", "Lara"], ["Bertholdt", "Magath"], ["Annie", "Yelena"], ["Sieg", "Onyankopon"], ["Pieck", "Niccolo"], ["Porco", "Eren"], ["Gabi", "Mikasa"], ["Falco", "Armin"], ["Pixis", "Livaï"], ["Hannes", "Erwin"], ["Kenny Ackerman", "Hansi"], ["Grisha Yeager", "Jean"], ["Willy Tybur", "Sasha"], ["Lara", "Connie"], ["Magath", "Historia"], ["Yelena", "Ymir"], ["Onyankopon", "Floch"], ["Niccolo", "Marco"], ["Eren", "Historia"], ["Mikasa", "Ymir"], ["Armin", "Floch"], ["Livaï", "Marco"], ["Erwin", "Petra"], ["Hansi", "Keith"], ["Jean", "Reiner"], ["Sasha", "Bertholdt"], ["Connie", "Annie"], 
        ["Historia", "Sieg"], ["Ymir", "Pieck"], ["Floch", "Porco"], ["Marco", "Gabi"], ["Petra", "Falco"], ["Keith", "Pixis"], ["Reiner", "Hannes"], ["Bertholdt", "Kenny Ackerman"], ["Annie", "Grisha Yeager"], ["Sieg", "Willy Tybur"], ["Pieck", "Lara"], ["Porco", "Magath"], ["Gabi", "Yelena"], ["Falco", "Onyankopon"], ["Pixis", "Niccolo"], ["Hannes", "Eren"], ["Kenny Ackerman", "Mikasa"], ["Grisha Yeager", "Armin"], ["Willy Tybur", "Livaï"], ["Lara", "Erwin"], ["Magath", "Hansi"], ["Yelena", "Jean"], ["Onyankopon", "Sasha"], ["Niccolo", "Connie"], ["Eren", "Mikasa"], ["Mikasa", "Armin"], ["Armin", "Livaï"], ["Livaï", "Erwin"], ["Erwin", "Hansi"]
    ],
    "Naruto": [
        ["Naruto", "Hidan"], ["Sasuke", "Kakuzu"], ["Sakura", "Zetsu"], ["Kakashi", "Yahiko"], ["Yamato", "Gaara"], ["Sai", "Temari"], 
        ["Iruka", "Kankurô"], ["Konohamaru", "Chiyo"], ["Kurama", "Killer Bee"], ["Shikamaru", "Ônoki"], ["Ino", "Mei"], ["Chôji", "Madara"], ["Hinata", "Kaguya"], ["Kiba", "Kabuto"], ["Shino", "Suigetsu"], ["Rock Lee", "Karin"], 
        ["Neji", "Jûgo"], ["Tenten", "Kimimaro"], ["Gaï", "Zabuza"], ["Asuma", "Haku"], ["Kurenai", "Hanzô"], ["Hashirama", "Kidomaru"], ["Tobirama", "Naruto"], ["Hiruzen", "Sasuke"], ["Minato", "Sakura"], ["Tsunade", "Kakashi"], 
        ["Jiraya", "Yamato"], ["Orochimaru", "Sai"], ["Kushina", "Iruka"], ["Shisui", "Konohamaru"], ["Danzô", "Kurama"], ["Itachi", "Shikamaru"], ["Pain", "Ino"], ["Konan", "Chôji"], ["Obito", "Hinata"], ["Kisame", "Kiba"], 
        ["Deidara", "Shino"], ["Sasori", "Rock Lee"], ["Hidan", "Neji"], ["Kakuzu", "Tenten"], ["Zetsu", "Gaï"], ["Yahiko", "Asuma"], ["Gaara", "Kurenai"], ["Temari", "Hashirama"], ["Kankurô", "Tobirama"], ["Chiyo", "Hiruzen"], 
        ["Killer Bee", "Minato"], ["Ônoki", "Tsunade"], ["Mei", "Jiraya"], ["Madara", "Orochimaru"], ["Kaguya", "Kushina"], ["Kabuto", "Shisui"], ["Suigetsu", "Danzô"], ["Karin", "Itachi"], ["Jûgo", "Pain"], ["Kimimaro", "Konan"], 
        ["Zabuza", "Obito"], ["Haku", "Kisame"], ["Hanzô", "Deidara"], ["Kidomaru", "Sasori"], ["Naruto", "Zetsu"], ["Sasuke", "Yahiko"], ["Sakura", "Gaara"], ["Kakashi", "Temari"], ["Yamato", "Kankurô"], ["Sai", "Chiyo"], 
        ["Iruka", "Killer Bee"], ["Konohamaru", "Ônoki"], ["Kurama", "Mei"], ["Shikamaru", "Madara"], ["Ino", "Kaguya"], ["Chôji", "Kabuto"], ["Hinata", "Suigetsu"], ["Kiba", "Karin"], ["Shino", "Jûgo"], ["Rock Lee", "Kimimaro"], 
        ["Neji", "Zabuza"], ["Tenten", "Haku"], ["Gaï", "Hanzô"], ["Asuma", "Kidomaru"], ["Kurenai", "Naruto"], ["Hashirama", "Sasuke"], ["Tobirama", "Sakura"], ["Hiruzen", "Kakashi"], ["Minato", "Yamato"], ["Tsunade", "Sai"], 
        ["Jiraya", "Iruka"], ["Orochimaru", "Konohamaru"], ["Kushina", "Kurama"], ["Shisui", "Shikamaru"], ["Danzô", "Ino"], ["Itachi", "Chôji"], ["Pain", "Hinata"], ["Konan", "Kiba"], ["Obito", "Shino"], ["Kisame", "Rock Lee"], 
        ["Deidara", "Neji"], ["Sasori", "Tenten"], ["Hidan", "Gaï"], ["Kakuzu", "Asuma"], ["Zetsu", "Kurenai"], ["Yahiko", "Hashirama"], ["Gaara", "Tobirama"], ["Temari", "Hiruzen"], ["Kankurô", "Minato"], ["Chiyo", "Tsunade"], 
        ["Killer Bee", "Jiraya"], ["Ônoki", "Orochimaru"], ["Mei", "Kushina"], ["Madara", "Shisui"], ["Kaguya", "Danzô"], ["Kabuto", "Itachi"], ["Suigetsu", "Pain"], ["Karin", "Konan"], ["Jûgo", "Obito"], ["Kimimaro", "Kisame"], ["Zabuza", "Deidara"], ["Haku", "Sasori"], ["Hanzô", "Hidan"], ["Kidomaru", "Kakuzu"], ["Naruto", "Gaara"], ["Sasuke", "Temari"], ["Sakura", "Kankurô"], ["Kakashi", "Chiyo"], ["Yamato", "Killer Bee"], ["Sai", "Ônoki"], ["Iruka", "Mei"], ["Konohamaru", "Madara"], ["Kurama", "Kaguya"], ["Shikamaru", "Kabuto"], ["Ino", "Suigetsu"], ["Chôji", "Karin"], ["Hinata", "Jûgo"], ["Kiba", "Kimimaro"], ["Shino", "Zabuza"], ["Rock Lee", "Haku"], ["Neji", "Hanzô"], ["Tenten", "Kidomaru"], ["Gaï", "Naruto"], ["Asuma", "Sasuke"], ["Kurenai", "Sakura"], ["Hashirama", "Kakashi"], ["Tobirama", "Yamato"], ["Hiruzen", "Sai"], ["Minato", "Iruka"], ["Tsunade", "Konohamaru"], ["Jiraya", "Kurama"], ["Orochimaru", "Shikamaru"], ["Kushina", "Ino"], ["Shisui", "Chôji"], ["Danzô", "Hinata"], ["Itachi", "Kiba"], ["Pain", "Shino"], ["Konan", "Rock Lee"], ["Obito", "Neji"], ["Kisame", "Tenten"], ["Deidara", "Gaï"], ["Sasori", "Asuma"], ["Hidan", "Kurenai"], ["Kakuzu", "Hashirama"], ["Zetsu", "Tobirama"], ["Yahiko", "Hiruzen"], ["Gaara", "Minato"], ["Temari", "Tsunade"], ["Kankurô", "Jiraya"], ["Chiyo", "Orochimaru"], ["Killer Bee", "Kushina"], ["Ônoki", "Shisui"], ["Mei", "Danzô"], ["Madara", "Itachi"], ["Kaguya", "Pain"], ["Kabuto", "Konan"], ["Suigetsu", "Obito"], ["Karin", "Kisame"], ["Jûgo", "Deidara"], ["Kimimaro", "Sasori"], ["Zabuza", "Hidan"], ["Haku", "Kakuzu"], ["Hanzô", "Zetsu"], ["Kidomaru", "Yahiko"], ["Naruto", "Killer Bee"], ["Sasuke", "Ônoki"], ["Sakura", "Mei"], ["Kakashi", "Madara"], ["Yamato", "Kaguya"], ["Sai", "Kabuto"], ["Iruka", "Suigetsu"], ["Konohamaru", "Karin"], ["Kurama", "Jûgo"], ["Shikamaru", "Kimimaro"], ["Ino", "Zabuza"], ["Chôji", "Haku"], ["Hinata", "Hanzô"], ["Kiba", "Kidomaru"], ["Shino", "Naruto"], ["Rock Lee", "Sasuke"], ["Neji", "Sakura"], ["Tenten", "Kakashi"], ["Gaï", "Yamato"], ["Asuma", "Sai"], ["Kurenai", "Iruka"], ["Hashirama", "Konohamaru"], ["Tobirama", "Kurama"], ["Hiruzen", "Shikamaru"], ["Minato", "Ino"], ["Tsunade", "Chôji"], ["Jiraya", "Hinata"], ["Orochimaru", "Kiba"], ["Kushina", "Shino"], ["Shisui", "Rock Lee"], ["Danzô", "Neji"], ["Itachi", "Tenten"], 
        ["Pain", "Gaï"], ["Konan", "Asuma"], ["Obito", "Kurenai"], ["Kisame", "Hashirama"], ["Deidara", "Tobirama"], ["Sasori", "Hiruzen"], ["Hidan", "Minato"], ["Kakuzu", "Tsunade"], ["Zetsu", "Jiraya"], ["Yahiko", "Orochimaru"], 
        ["Gaara", "Kushina"], ["Temari", "Shisui"], ["Kankurô", "Danzô"], ["Chiyo", "Itachi"], ["Killer Bee", "Pain"], ["Ônoki", "Konan"], ["Mei", "Obito"], ["Madara", "Kisame"], ["Kaguya", "Deidara"], ["Kabuto", "Sasori"], 
        ["Suigetsu", "Hidan"], ["Karin", "Kakuzu"], ["Jûgo", "Zetsu"], ["Kimimaro", "Yahiko"], ["Zabuza", "Gaara"], ["Haku", "Temari"], ["Hanzô", "Kankurô"], ["Kidomaru", "Chiyo"], ["Naruto", "Madara"], ["Sasuke", "Kaguya"], 
        ["Sakura", "Kabuto"], ["Kakashi", "Suigetsu"], ["Yamato", "Karin"], ["Sai", "Jûgo"], ["Iruka", "Kimimaro"], ["Konohamaru", "Zabuza"], ["Kurama", "Haku"], ["Shikamaru", "Hanzô"], ["Ino", "Kidomaru"], ["Chôji", "Naruto"], 
        ["Hinata", "Sasuke"], ["Kiba", "Sakura"], ["Shino", "Kakashi"], ["Rock Lee", "Yamato"], ["Neji", "Sai"], ["Tenten", "Iruka"], ["Gaï", "Konohamaru"], ["Asuma", "Kurama"], ["Kurenai", "Shikamaru"], ["Hashirama", "Ino"], 
        ["Tobirama", "Chôji"], ["Hiruzen", "Hinata"], ["Minato", "Kiba"], ["Tsunade", "Shino"], ["Jiraya", "Rock Lee"], ["Orochimaru", "Neji"], ["Kushina", "Tenten"], ["Shisui", "Gaï"], ["Danzô", "Asuma"], ["Itachi", "Kurenai"], 
        ["Pain", "Hashirama"], ["Konan", "Tobirama"], ["Obito", "Hiruzen"], ["Kisame", "Minato"], ["Deidara", "Tsunade"], ["Sasori", "Jiraya"], ["Hidan", "Orochimaru"], ["Kakuzu", "Kushina"], ["Zetsu", "Shisui"], ["Yahiko", "Danzô"],
        ["Gaara", "Itachi"], ["Temari", "Pain"], ["Kankurô", "Konan"], ["Chiyo", "Obito"], ["Killer Bee", "Kisame"], ["Ônoki", "Deidara"], ["Mei", "Sasori"], ["Madara", "Hidan"], ["Kaguya", "Kakuzu"], ["Kabuto", "Zetsu"], 
        ["Suigetsu", "Yahiko"], ["Karin", "Gaara"], ["Jûgo", "Temari"], ["Kimimaro", "Kankurô"], ["Zabuza", "Chiyo"], ["Haku", "Killer Bee"], ["Hanzô", "Ônoki"], ["Kidomaru", "Mei"], ["Naruto", "Kaguya"], ["Sasuke", "Kabuto"], 
        ["Sakura", "Suigetsu"], ["Kakashi", "Karin"], ["Yamato", "Jûgo"], ["Sai", "Kimimaro"], ["Iruka", "Zabuza"], ["Konohamaru", "Haku"], ["Kurama", "Hanzô"], ["Shikamaru", "Kidomaru"], ["Ino", "Naruto"], ["Chôji", "Sasuke"],
        ["Hinata", "Sakura"], ["Kiba", "Kakashi"], ["Shino", "Yamato"], ["Rock Lee", "Sai"], ["Neji", "Iruka"], ["Tenten", "Konohamaru"], ["Gaï", "Kurama"], ["Asuma", "Shikamaru"], ["Kurenai", "Ino"], ["Hashirama", "Chôji"], 
        ["Tobirama", "Hinata"], ["Hiruzen", "Kiba"], ["Minato", "Shino"], ["Tsunade", "Rock Lee"], ["Jiraya", "Neji"], ["Orochimaru", "Tenten"], ["Kushina", "Gaï"], ["Shisui", "Asuma"], ["Danzô", "Kurenai"], ["Itachi", "Hashirama"], 
        ["Pain", "Tobirama"], ["Konan", "Hiruzen"], ["Obito", "Minato"], ["Kisame", "Tsunade"], ["Deidara", "Jiraya"], ["Sasori", "Orochimaru"], ["Hidan", "Kushina"], ["Kakuzu", "Shisui"], ["Zetsu", "Danzô"], ["Yahiko", "Itachi"], 
        ["Gaara", "Pain"], ["Temari", "Konan"], ["Kankurô", "Obito"], ["Chiyo", "Kisame"], ["Killer Bee", "Deidara"], ["Ônoki", "Sasori"], ["Mei", "Hidan"], ["Madara", "Kakuzu"], ["Kaguya", "Zetsu"], ["Kabuto", "Yahiko"], 
        ["Suigetsu", "Gaara"], ["Karin", "Temari"], ["Jûgo", "Kankurô"], ["Kimimaro", "Chiyo"], ["Zabuza", "Killer Bee"], ["Haku", "Ônoki"], ["Hanzô", "Mei"], ["Kidomaru", "Madara"], ["Naruto", "Kabuto"], ["Sasuke", "Suigetsu"], 
        ["Sakura", "Karin"], ["Kakashi", "Jûgo"], ["Yamato", "Kimimaro"], ["Sai", "Zabuza"], ["Iruka", "Haku"], ["Konohamaru", "Hanzô"], ["Kurama", "Kidomaru"], ["Shikamaru", "Naruto"], ["Ino", "Sasuke"], ["Chôji", "Sakura"], 
        ["Hinata", "Kakashi"], ["Kiba", "Yamato"], ["Shino", "Sai"], ["Rock Lee", "Iruka"], ["Neji", "Konohamaru"], ["Tenten", "Kurama"], ["Gaï", "Shikamaru"], ["Asuma", "Ino"], ["Kurenai", "Chôji"], ["Hashirama", "Hinata"], 
        ["Tobirama", "Kiba"], ["Hiruzen", "Shino"], ["Minato", "Rock Lee"], ["Tsunade", "Neji"], ["Jiraya", "Tenten"], ["Orochimaru", "Gaï"], ["Kushina", "Asuma"], ["Shisui", "Kurenai"], ["Danzô", "Hashirama"], 
        ["Itachi", "Tobirama"], ["Pain", "Hiruzen"], ["Konan", "Minato"], ["Obito", "Tsunade"], ["Kisame", "Jiraya"], ["Deidara", "Orochimaru"], ["Sasori", "Kushina"], ["Hidan", "Shisui"], ["Kakuzu", "Danzô"], ["Zetsu", "Itachi"], ["Yahiko", "Pain"], ["Gaara", "Konan"], ["Temari", "Obito"], ["Kankurô", "Kisame"], ["Chiyo", "Deidara"], ["Killer Bee", "Sasori"], ["Ônoki", "Hidan"], ["Mei", "Kakuzu"], ["Madara", "Zetsu"], ["Kaguya", "Yahiko"], ["Kabuto", "Gaara"], ["Suigetsu", "Temari"], ["Karin", "Kankurô"], ["Jûgo", "Chiyo"], ["Kimimaro", "Killer Bee"], ["Zabuza", "Ônoki"], ["Haku", "Mei"], ["Hanzô", "Madara"], ["Kidomaru", "Kaguya"], ["Naruto", "Suigetsu"], ["Sasuke", "Karin"], ["Sakura", "Jûgo"], ["Kakashi", "Kimimaro"], ["Yamato", "Zabuza"], ["Sai", "Haku"], ["Iruka", "Hanzô"], ["Konohamaru", "Kidomaru"], ["Kurama", "Naruto"], ["Shikamaru", "Sasuke"], ["Ino", "Sakura"], ["Chôji", "Kakashi"], ["Hinata", "Yamato"], ["Kiba", "Sai"], ["Shino", "Iruka"], ["Rock Lee", "Konohamaru"], ["Neji", "Kurama"], ["Tenten", "Shikamaru"], ["Gaï", "Ino"], ["Asuma", "Chôji"], ["Kurenai", "Hinata"], ["Hashirama", "Kiba"], ["Tobirama", "Shino"], ["Hiruzen", "Rock Lee"], ["Minato", "Neji"], ["Tsunade", "Tenten"], ["Jiraya", "Gaï"], ["Orochimaru", "Asuma"], ["Kushina", "Kurenai"], ["Shisui", "Hashirama"], ["Danzô", "Tobirama"], ["Itachi", "Hiruzen"], ["Pain", "Minato"], ["Konan", "Tsunade"], ["Obito", "Jiraya"], ["Kisame", "Orochimaru"], ["Deidara", "Kushina"], ["Sasori", "Shisui"], ["Hidan", "Danzô"], ["Kakuzu", "Itachi"], ["Zetsu", "Pain"], ["Yahiko", "Konan"], ["Gaara", "Obito"], ["Temari", "Kisame"], ["Kankurô", "Deidara"], ["Chiyo", "Sasori"], ["Killer Bee", "Hidan"], ["Ônoki", "Kakuzu"], ["Mei", "Zetsu"], ["Madara", "Yahiko"], ["Kaguya", "Gaara"], ["Kabuto", "Temari"], ["Suigetsu", "Kankurô"], ["Karin", "Chiyo"], ["Jûgo", "Killer Bee"], ["Kimimaro", "Ônoki"], ["Zabuza", "Mei"], ["Haku", "Madara"], ["Hanzô", "Kaguya"], ["Kidomaru", "Kabuto"], ["Naruto", "Karin"], ["Sasuke", "Jûgo"], ["Sakura", "Kimimaro"], ["Kakashi", "Zabuza"], ["Yamato", "Haku"], ["Sai", "Hanzô"], ["Iruka", "Kidomaru"], ["Konohamaru", "Naruto"], ["Kurama", "Sasuke"], ["Shikamaru", "Sakura"], ["Ino", "Kakashi"], ["Chôji", "Yamato"], ["Hinata", "Sai"], ["Kiba", "Iruka"], ["Shino", "Konohamaru"], ["Rock Lee", "Kurama"], ["Neji", "Shikamaru"], ["Tenten", "Ino"], ["Gaï", "Chôji"], ["Asuma", "Hinata"]
    ]
};

function broadcastPublicLobbies() {
    const publicLobbies = Object.values(lobbies)
        .filter(l => l.state === 'waiting')
        .map(l => ({ id: l.id, host: l.players[0].name, playersCount: l.players.length }));
    io.emit('updatePublicLobbies', publicLobbies);
}

function checkWinConditions(lobbyId) {
    const lobby = lobbies[lobbyId];
    if (!lobby) return;

    const alive = lobby.players.filter(p => p.isAlive);
    const civils = alive.filter(p => p.role === 'civil').length;
    const undercovers = alive.filter(p => p.role === 'undercover').length;
    const mrWhites = alive.filter(p => p.role === 'mrwhite').length;

    if (undercovers === 0 && mrWhites === 0) return endGame(lobbyId, "Victoire des Civils !");
    if (civils === 1 && undercovers === 1 && mrWhites === 0) return endGame(lobbyId, "Victoire de l'Undercover !");
    if (civils === 0 && undercovers === 1 && mrWhites === 1) return endGame(lobbyId, "Victoire de l'Undercover !");
    if (civils === 1 && mrWhites === 1 && undercovers === 0) {
        lobby.state = 'mrwhite_guess';
        lobby.mrWhiteTries = 2;
        io.to(lobbyId).emit('mrWhiteGuess', { tries: 2, message: "Face à Face ! Mr White a 2 essais pour deviner." });
        return true;
    }
    return false;
}

function endGame(lobbyId, message) {
    const lobby = lobbies[lobbyId];
    if (lobby) {
        clearTimeout(lobby.turnTimer);
        lobby.state = 'ended';
        
        // --- GÉNÉRATION DU RÉCAPITULATIF ---
        const recap = {
            civilWord: lobby.civilWord,
            undercoverWord: lobby.undercoverWord,
            mrWhiteGuesses: lobby.mrWhiteGuesses,
            players: lobby.players.map(p => ({
                name: p.name, role: p.role, words: p.allWrittenWords
            }))
        };

        io.to(lobbyId).emit('gameOver', { message, recap, players: lobby.players });
        broadcastPublicLobbies();
    }
    return true;
}

function advanceTurn(lobbyId) {
    const lobby = lobbies[lobbyId];
    clearTimeout(lobby.turnTimer); 
    
    while (lobby.turnIndex < lobby.playOrder.length) {
        const playerId = lobby.playOrder[lobby.turnIndex];
        const player = lobby.players.find(p => p.id === playerId);
        if (player && player.isAlive) break;
        lobby.turnIndex++;
    }

    if (lobby.turnIndex >= lobby.playOrder.length) {
        lobby.state = 'voting';
        io.to(lobbyId).emit('startVoting', { players: lobby.players, discussTime: lobby.settings.discussTime });
    } else {
        const activePlayerId = lobby.playOrder[lobby.turnIndex];
        io.to(lobbyId).emit('updateTurn', { activePlayerId, writeTime: lobby.settings.writeTime });

        lobby.turnTimer = setTimeout(() => {
            const activePlayer = lobby.players.find(p => p.id === activePlayerId);
            if (activePlayer) {
                activePlayer.writtenWord = "⏱️";
                activePlayer.allWrittenWords.push("⏱️"); // Historique
            }
            io.to(lobbyId).emit('wordWritten', { playerId: activePlayerId, word: "⏱️" });
            lobby.turnIndex++;
            advanceTurn(lobbyId);
        }, lobby.settings.writeTime * 1000);
    }
}

function removePlayerFromLobby(socket) {
    for (const lobbyId in lobbies) {
        const lobby = lobbies[lobbyId];
        const pIndex = lobby.players.findIndex(p => p.id === socket.id);
        
        if (pIndex !== -1) {
            const wasHost = lobby.players[pIndex].isHost;
            lobby.players.splice(pIndex, 1);

            if (lobby.players.length === 0) {
                delete lobbies[lobbyId]; 
            } else {
                if (wasHost) {
                    lobby.players[0].isHost = true; 
                    lobby.host = lobby.players[0].id;
                    io.to(lobby.host).emit('youAreHost');
                }
                io.to(lobbyId).emit('updatePlayers', lobby.players);
            }
            socket.leave(lobbyId);
            broadcastPublicLobbies();
            return;
        }
    }
}

io.on('connection', (socket) => {
    broadcastPublicLobbies(); 

    socket.on('createLobby', (playerName) => {
        const lobbyId = Math.random().toString(36).substring(2, 8).toUpperCase();
        lobbies[lobbyId] = {
            id: lobbyId, host: socket.id, players: [], state: 'waiting', 
            playOrder: [], turnIndex: 0, turnTimer: null, mrWhiteTries: 0,
            mrWhiteGuesses: [], // Historique des guess
            settings: { writeTime: 30, discussTime: 60, theme: Object.keys(gameThemes)[0] } 
        };
        socket.join(lobbyId);
        lobbies[lobbyId].players.push({ id: socket.id, name: playerName, isHost: true, isAlive: true, votes: 0, allWrittenWords: [] });
        socket.emit('lobbyJoined', { lobbyId, isHost: true, players: lobbies[lobbyId].players, themes: Object.keys(gameThemes) });
        broadcastPublicLobbies();
    });

    socket.on('joinLobby', ({ lobbyId, playerName }) => {
        const lobby = lobbies[lobbyId];
        if (lobby && (lobby.state === 'waiting' || lobby.state === 'ended') && lobby.players.length < 10) {
            socket.join(lobbyId);
            lobby.players.push({ id: socket.id, name: playerName, isHost: false, isAlive: true, votes: 0, allWrittenWords: [] });
            io.to(lobbyId).emit('updatePlayers', lobby.players);
            socket.emit('lobbyJoined', { lobbyId, isHost: false, players: lobby.players, themes: Object.keys(gameThemes) });
            broadcastPublicLobbies();
        } else {
            socket.emit('error', "Lobby introuvable, plein ou partie en cours.");
        }
    });

    socket.on('startGame', ({ lobbyId, undercovers, mrWhites, writeTime, discussTime, themeName }) => {
        const lobby = lobbies[lobbyId];
        if (lobby && lobby.host === socket.id) {
            if (undercovers <= 0 && mrWhites <= 0) return socket.emit('error', "Ajoute au moins 1 Undercover ou 1 Mr White !");

            lobby.settings.writeTime = writeTime;
            lobby.settings.discussTime = discussTime;
            lobby.settings.theme = themeName;
            
            const pairs = gameThemes[themeName];
            if (!pairs || pairs.length === 0) return socket.emit('error', "Erreur avec le thème choisi.");
            
            const pair = pairs[Math.floor(Math.random() * pairs.length)];
            lobby.civilWord = pair[0];
            lobby.undercoverWord = pair[1]; // Mémorisé pour le récap
            
            let roles = [];
            for(let i=0; i<undercovers; i++) roles.push('undercover');
            for(let i=0; i<mrWhites; i++) roles.push('mrwhite');
            while(roles.length < lobby.players.length) roles.push('civil');
            roles.sort(() => Math.random() - 0.5);

            lobby.players.forEach((p, i) => {
                p.role = roles[i];
                p.word = p.role === 'civil' ? pair[0] : (p.role === 'undercover' ? pair[1] : "");
                p.isAlive = true;
                p.writtenWord = "";
                p.allWrittenWords = []; // Reset de l'historique
                p.votes = 0;
            });

            let order = [...lobby.players];
            order.sort(() => Math.random() - 0.5);
            
            if (order[0].role === 'mrwhite') {
                const swapIdx = order.findIndex(p => p.role !== 'mrwhite');
                if (swapIdx > 0) [order[0], order[swapIdx]] = [order[swapIdx], order[0]];
            }
            
            lobby.playOrder = order.map(p => p.id);
            lobby.turnIndex = 0;
            lobby.mrWhiteTries = 0;
            lobby.mrWhiteGuesses = []; // Reset
            lobby.state = 'writing';

            io.to(lobbyId).emit('gameStarted', { players: lobby.players });
            advanceTurn(lobbyId);
            broadcastPublicLobbies(); 
        }
    });

    socket.on('submitWord', ({ lobbyId, word }) => {
        const lobby = lobbies[lobbyId];
        if (!lobby) return;
        const player = lobby.players.find(p => p.id === socket.id);
        
        if (player && lobby.playOrder[lobby.turnIndex] === socket.id) {
            clearTimeout(lobby.turnTimer); 
            player.writtenWord = word;
            player.allWrittenWords.push(word); // Ajout à l'historique
            io.to(lobbyId).emit('wordWritten', { playerId: player.id, word });
            lobby.turnIndex++;
            advanceTurn(lobbyId);
        }
    });

    socket.on('submitVote', ({ lobbyId, targetId }) => {
        const lobby = lobbies[lobbyId];
        if (!lobby) return;
        const target = lobby.players.find(p => p.id === targetId);
        if (target) target.votes++;

        const alivePlayers = lobby.players.filter(p => p.isAlive);
        const totalVotes = alivePlayers.reduce((sum, p) => sum + (p.votes || 0), 0);

        if (totalVotes === alivePlayers.length) {
            let eliminated = alivePlayers.sort((a, b) => b.votes - a.votes)[0];
            eliminated.isAlive = false;
            lobby.players.forEach(p => { p.votes = 0; p.writtenWord = ""; });

            // On annonce l'élimination ET le rôle publiquement
            io.to(lobbyId).emit('playerEliminated', { id: eliminated.id, name: eliminated.name, role: eliminated.role });

            // On envoie les infos de Spectateur (TOUS les rôles) uniquement au joueur mort
            io.to(eliminated.id).emit('youAreSpectator', {
                civilWord: lobby.civilWord,
                undercoverWord: lobby.undercoverWord,
                playersRoles: lobby.players.map(p => ({ id: p.id, role: p.role }))
            });

            if (eliminated.role === 'mrwhite') {
                lobby.state = 'mrwhite_guess';
                lobby.mrWhiteTries = 1;
                io.to(lobbyId).emit('mrWhiteGuess', { tries: 1, message: "Mr White est éliminé ! Il a 1 essai." });
            } else {
                if (!checkWinConditions(lobbyId)) {
                    lobby.state = 'writing';
                    lobby.turnIndex = 0;
                    io.to(lobbyId).emit('nextTurn', { players: lobby.players });
                    advanceTurn(lobbyId);
                }
            }
        }
    });

    socket.on('mrWhiteSubmitGuess', ({ lobbyId, guess }) => {
        const lobby = lobbies[lobbyId];
        if (!lobby) return;
        
        lobby.mrWhiteGuesses.push(guess); // Sauvegarde pour le recap
        
        if (guess.toLowerCase() === lobby.civilWord.toLowerCase()) {
            endGame(lobbyId, "Victoire de Mr White ! Il a trouvé le mot.");
        } else {
            lobby.mrWhiteTries--;
            if (lobby.mrWhiteTries > 0) {
                io.to(lobbyId).emit('mrWhiteGuess', { tries: lobby.mrWhiteTries, message: "❌ Mauvais mot ! Il te reste 1 essai." });
            } else {
                const aliveUndercovers = lobby.players.filter(p => p.isAlive && p.role === 'undercover').length;
                if (aliveUndercovers > 0) endGame(lobbyId, "Mauvais mot ! Victoire de l'Undercover.");
                else endGame(lobbyId, "Mauvais mot ! Victoire des Civils.");
            }
        }
    });

    socket.on('returnToLobby', (lobbyId) => {
        const lobby = lobbies[lobbyId];
        if (lobby && lobby.host === socket.id) {
            lobby.state = 'waiting';
            io.to(lobbyId).emit('forceBackToLobby');
            io.to(lobbyId).emit('updatePlayers', lobby.players);
            broadcastPublicLobbies();
        }
    });

    socket.on('leaveLobby', () => {
        removePlayerFromLobby(socket);
        socket.emit('leftLobby');
    });

    socket.on('disconnect', () => removePlayerFromLobby(socket));
});

server.listen(3000, () => console.log('Serveur lancé sur http://localhost:3000'));