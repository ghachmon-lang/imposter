// Word data for Imposter.
// Each category has easy / medium / hard word lists.
const WORDS = {
  animals: {
    label: "Animals",
    emoji: "🦁",
    easy: [
      "Dog", "Cat", "Elephant", "Lion", "Horse", "Rabbit", "Monkey", "Cow",
      "Penguin", "Duck", "Bear", "Tiger", "Sheep", "Frog", "Chicken", "Fish",
    ],
    medium: [
      "Kangaroo", "Dolphin", "Octopus", "Eagle", "Camel", "Peacock", "Hedgehog",
      "Raccoon", "Flamingo", "Squirrel", "Shark", "Owl", "Crocodile", "Panda",
      "Bat", "Jellyfish",
    ],
    hard: [
      "Platypus", "Axolotl", "Narwhal", "Chameleon", "Armadillo", "Tapir",
      "Mongoose", "Pangolin", "Lemur", "Wolverine", "Anteater", "Capybara",
      "Iguana", "Meerkat", "Sloth", "Otter",
    ],
  },
  food: {
    label: "Food & Drink",
    emoji: "🍕",
    easy: [
      "Pizza", "Apple", "Bread", "Cheese", "Ice cream", "Banana", "Egg",
      "Chocolate", "Rice", "Milk", "Cookie", "Orange juice", "Pasta",
      "Sandwich", "Cake", "Popcorn",
    ],
    medium: [
      "Sushi", "Taco", "Pancake", "Lasagna", "Smoothie", "Meatball", "Waffle",
      "Burrito", "Lemonade", "Dumpling", "Bagel", "Curry", "Milkshake",
      "Pretzel", "Salsa", "Espresso",
    ],
    hard: [
      "Tiramisu", "Hummus", "Paella", "Kimchi", "Croissant", "Gnocchi",
      "Falafel", "Ratatouille", "Baklava", "Ceviche", "Risotto", "Macaron",
      "Guacamole", "Tempura", "Bruschetta", "Chimichurri",
    ],
  },
  places: {
    label: "Places",
    emoji: "🗺️",
    easy: [
      "Beach", "School", "Park", "Hospital", "Supermarket", "Zoo", "Cinema",
      "Airport", "Farm", "Library", "Restaurant", "Playground", "Swimming pool",
      "Museum", "Castle", "Forest",
    ],
    medium: [
      "Desert", "Stadium", "Lighthouse", "Aquarium", "Bakery", "Campsite",
      "Waterfall", "Skyscraper", "Harbor", "Volcano", "Cave", "Vineyard",
      "Ski resort", "Amusement park", "Train station", "Island",
    ],
    hard: [
      "Observatory", "Catacombs", "Monastery", "Oasis", "Fjord", "Bazaar",
      "Glacier", "Amphitheater", "Planetarium", "Greenhouse", "Reef",
      "Courtroom", "Embassy", "Windmill", "Canyon", "Submarine",
    ],
  },
  sports: {
    label: "Sports",
    emoji: "⚽",
    easy: [
      "Soccer", "Basketball", "Swimming", "Tennis", "Running", "Baseball",
      "Golf", "Boxing", "Cycling", "Volleyball", "Skiing", "Bowling",
      "Ping pong", "Wrestling", "Skateboarding", "Fishing",
    ],
    medium: [
      "Surfing", "Archery", "Karate", "Rock climbing", "Ice skating", "Rugby",
      "Fencing", "Snowboarding", "Weightlifting", "Darts", "Gymnastics",
      "Rowing", "Cricket", "Billiards", "Marathon", "Judo",
    ],
    hard: [
      "Curling", "Parkour", "Pentathlon", "Lacrosse", "Polo", "Biathlon",
      "Sumo wrestling", "Falconry", "Orienteering", "Squash", "Bobsled",
      "Handball", "Water polo", "Badminton", "Kendo", "Slacklining",
    ],
  },
  movies: {
    label: "Movies & TV",
    emoji: "🎬",
    easy: [
      "Superhero", "Cartoon", "Popcorn", "Movie theater", "Villain", "Robot",
      "Princess", "Dragon", "Pirate", "Alien", "Wizard", "Dinosaur", "Ghost",
      "Spy", "Zombie", "Cowboy",
    ],
    medium: [
      "Sequel", "Director", "Plot twist", "Soundtrack", "Stunt double",
      "Red carpet", "Blooper", "Trailer", "Sitcom", "Cliffhanger", "Documentary",
      "Audition", "Special effects", "Screenplay", "Reality show", "Premiere",
    ],
    hard: [
      "Cinematographer", "Film noir", "Method acting", "Storyboard",
      "Post-credits scene", "Foley artist", "Mockumentary", "Anti-hero",
      "Fourth wall", "Cameo", "Box office", "Motion capture", "Understudy",
      "Spin-off", "Jump scare", "Montage",
    ],
  },
  music: {
    label: "Music",
    emoji: "🎵",
    easy: [
      "Guitar", "Piano", "Drums", "Singer", "Concert", "Dance", "Microphone",
      "Violin", "Trumpet", "Radio", "Headphones", "Choir", "Flute", "Band",
      "Whistle", "Karaoke",
    ],
    medium: [
      "Orchestra", "Saxophone", "DJ", "Opera", "Harmonica", "Jazz", "Encore",
      "Accordion", "Conductor", "Bagpipes", "Lullaby", "Harp", "Duet",
      "Festival", "Rapper", "Ukulele",
    ],
    hard: [
      "Falsetto", "Metronome", "A cappella", "Synthesizer", "Vibrato",
      "Theremin", "Beatboxing", "Symphony", "Didgeridoo", "Soprano", "Remix",
      "Crescendo", "Mixtape", "Yodeling", "Tambourine", "Serenade",
    ],
  },
  objects: {
    label: "Everyday Objects",
    emoji: "🪑",
    easy: [
      "Chair", "Umbrella", "Toothbrush", "Pillow", "Mirror", "Clock", "Key",
      "Backpack", "Scissors", "Candle", "Ladder", "Wallet", "Blanket", "Soap",
      "Balloon", "Broom",
    ],
    medium: [
      "Stapler", "Compass", "Binoculars", "Thermometer", "Flashlight",
      "Corkscrew", "Magnet", "Padlock", "Sunglasses", "Vacuum cleaner",
      "Calculator", "Hammock", "Whiteboard", "Zipper", "Telescope", "Anchor",
    ],
    hard: [
      "Hourglass", "Abacus", "Typewriter", "Kaleidoscope", "Boomerang",
      "Snow globe", "Tweezers", "Periscope", "Gramophone", "Sundial",
      "Stethoscope", "Mousetrap", "Chandelier", "Pincushion", "Turnstile",
      "Doorbell",
    ],
  },
  professions: {
    label: "Professions",
    emoji: "🧑‍🚒",
    easy: [
      "Doctor", "Teacher", "Firefighter", "Police officer", "Chef", "Farmer",
      "Pilot", "Dentist", "Singer", "Painter", "Nurse", "Astronaut",
      "Bus driver", "Soldier", "Actor", "Baker",
    ],
    medium: [
      "Architect", "Electrician", "Journalist", "Veterinarian", "Plumber",
      "Photographer", "Lifeguard", "Magician", "Translator", "Mechanic",
      "Librarian", "Judge", "Zookeeper", "Tailor", "Detective", "Barber",
    ],
    hard: [
      "Archaeologist", "Sommelier", "Cartographer", "Locksmith", "Beekeeper",
      "Auctioneer", "Choreographer", "Meteorologist", "Blacksmith",
      "Air traffic controller", "Taxidermist", "Puppeteer", "Stunt double",
      "Glassblower", "Chimney sweep", "Food critic",
    ],
  },
  nature: {
    label: "Nature",
    emoji: "🌋",
    easy: [
      "Sun", "Rain", "Tree", "Flower", "Snow", "Mountain", "River", "Cloud",
      "Rainbow", "Moon", "Star", "Wind", "Grass", "Ocean", "Leaf", "Rock",
    ],
    medium: [
      "Thunderstorm", "Earthquake", "Cactus", "Coral", "Fog", "Meteor",
      "Tornado", "Eclipse", "Avalanche", "Quicksand", "Geyser", "Iceberg",
      "Sand dune", "Lightning", "Tide", "Mushroom",
    ],
    hard: [
      "Aurora borealis", "Stalactite", "Tsunami", "Permafrost", "Monsoon",
      "Bioluminescence", "Sinkhole", "Tectonic plate", "Whirlpool", "Sequoia",
      "Supernova", "Delta", "Baobab", "Solstice", "Riptide", "Fossil",
    ],
  },
  games: {
    label: "Games",
    emoji: "🎮",
    easy: [
      "Minecraft", "Mario", "Monopoly", "Hide and seek", "Pac-Man", "Uno",
      "Tetris", "Fortnite", "Chess", "Musical chairs", "Rock paper scissors",
      "Jenga",
    ],
    medium: [
      "Among Us", "Scrabble", "Poker", "Twister", "Candy Crush", "Zelda",
      "Battleship", "Charades", "Dominoes", "Roblox", "Sudoku", "Mario Kart",
    ],
    hard: [
      "Dungeons & Dragons", "Catan", "Backgammon", "Mahjong", "Trivial Pursuit",
      "Escape room", "Laser tag", "Foosball", "Pinball", "Solitaire",
      "Pictionary", "Air hockey",
    ],
  },
  anime: {
    label: "Anime",
    emoji: "🍥",
    easy: [
      "Pokémon", "Naruto", "Dragon Ball", "One Piece", "Pikachu", "Sailor Moon",
      "Totoro", "Goku", "Doraemon", "Attack on Titan", "Demon Slayer",
      "Studio Ghibli",
    ],
    medium: [
      "Death Note", "My Hero Academia", "Spirited Away", "Jujutsu Kaisen",
      "Fullmetal Alchemist", "Hunter x Hunter", "Evangelion", "Luffy",
      "Cosplay", "Manga", "One Punch Man", "Vegeta",
    ],
    hard: [
      "Ghost in the Shell", "Cowboy Bebop", "Akira", "Berserk",
      "JoJo's Bizarre Adventure", "Chainsaw Man", "Steins;Gate", "Bleach",
      "Gundam", "Inuyasha", "Senpai", "Isekai",
    ],
  },
  body: {
    label: "Body & Health",
    emoji: "🫀",
    easy: [
      "Heart", "Brain", "Teeth", "Eyes", "Stomach", "Bones", "Blood",
      "Muscles", "Ears", "Skin", "Hair", "Lungs",
    ],
    medium: [
      "Skeleton", "Vaccine", "X-ray", "Allergy", "Vitamins", "Fever",
      "Hiccups", "Bruise", "Sneeze", "Pulse", "Cavity", "Band-aid",
    ],
    hard: [
      "Appendix", "Adrenaline", "Tonsils", "Immune system", "Metabolism",
      "Kneecap", "Eardrum", "Collarbone", "Goosebumps", "Funny bone",
      "Wisdom teeth", "Achilles heel",
    ],
  },
  school: {
    label: "School & Education",
    emoji: "🎒",
    easy: [
      "Teacher", "Homework", "Blackboard", "Pencil", "Recess", "Classroom",
      "Exam", "School bus", "Eraser", "Notebook", "Math", "Report card",
    ],
    medium: [
      "Detention", "Field trip", "Principal", "Graduation", "Pop quiz",
      "Chemistry", "Locker", "Cafeteria", "Substitute teacher", "Diploma",
      "Spelling bee", "School play",
    ],
    hard: [
      "Valedictorian", "Thesis", "Sabbatical", "Curriculum", "Scholarship",
      "Dormitory", "Plagiarism", "Syllabus", "Alumni", "Tenure",
      "Home schooling", "Detention slip",
    ],
  },
  hobbies: {
    label: "Hobbies & Activities",
    emoji: "🎨",
    easy: [
      "Drawing", "Reading", "Cooking", "Dancing", "Gardening", "Photography",
      "Camping", "Baking", "Painting", "Knitting", "Puzzles", "Karaoke",
    ],
    medium: [
      "Yoga", "Origami", "Scrapbooking", "Bird watching", "Pottery",
      "Journaling", "Magic tricks", "Stamp collecting", "Hiking", "Meditation",
      "Calligraphy", "Skydiving",
    ],
    hard: [
      "Geocaching", "Bonsai", "Metal detecting", "Whittling", "Candle making",
      "Genealogy", "Astrophotography", "Larping", "Soap making",
      "Cross-stitch", "Kite surfing", "Urban sketching",
    ],
  },
  love: {
    label: "Love & Romance",
    emoji: "💘",
    easy: [
      "First kiss", "Wedding", "Valentine's Day", "Heartbreak", "Flowers",
      "Love letter", "Date night", "Honeymoon", "Crush", "Box of chocolates",
      "Proposal", "Holding hands",
    ],
    medium: [
      "Blind date", "Soulmate", "Long-distance relationship", "Anniversary",
      "Love triangle", "Slow dance", "Matchmaker", "Pick-up line", "Jealousy",
      "Butterflies in the stomach", "Eloping", "Speed dating",
    ],
    hard: [
      "Unrequited love", "Love at first sight", "Friend zone", "Situationship",
      "Cupid", "Honeymoon phase", "Ghosting", "Rebound", "Chaperone",
      "Love potion", "Renewing vows", "Puppy love",
    ],
  },
  countries: {
    label: "Countries",
    emoji: "🌍",
    easy: [
      "France", "Japan", "Brazil", "Egypt", "Italy", "USA", "China",
      "Australia", "Mexico", "India", "Canada", "Spain",
    ],
    medium: [
      "Greece", "Iceland", "Argentina", "Morocco", "Thailand", "Switzerland",
      "Turkey", "South Korea", "Netherlands", "Kenya", "Portugal",
      "New Zealand",
    ],
    hard: [
      "Bhutan", "Madagascar", "Uruguay", "Mongolia", "Slovenia", "Fiji",
      "Nepal", "Panama", "Luxembourg", "Tanzania", "Laos", "Ecuador",
    ],
  },
  cities: {
    label: "Cities",
    emoji: "🏙️",
    easy: [
      "Paris", "New York", "London", "Tokyo", "Rome", "Dubai", "Los Angeles",
      "Venice", "Las Vegas", "Sydney", "Berlin", "Amsterdam",
    ],
    medium: [
      "Barcelona", "Istanbul", "Rio de Janeiro", "Cairo", "Bangkok", "Moscow",
      "Singapore", "Vienna", "Prague", "San Francisco", "Athens", "Mumbai",
    ],
    hard: [
      "Reykjavik", "Marrakesh", "Kyoto", "Havana", "Cape Town", "Dubrovnik",
      "Buenos Aires", "Casablanca", "Timbuktu", "Zurich", "Kathmandu",
      "Helsinki",
    ],
  },
  brands: {
    label: "Brands",
    emoji: "🏷️",
    easy: [
      "McDonald's", "Nike", "Coca-Cola", "Apple", "Lego", "Disney", "Google",
      "Adidas", "Samsung", "Netflix", "Toyota", "Amazon",
    ],
    medium: [
      "Ikea", "Starbucks", "Pepsi", "Rolex", "Ferrari", "Gucci", "Spotify",
      "Nutella", "Red Bull", "Visa", "Nintendo", "Zara",
    ],
    hard: [
      "Moleskine", "Leica", "Patek Philippe", "Evian", "Lacoste", "Tupperware",
      "Polaroid", "Zippo", "Michelin", "Vespa", "Fabergé", "Patagonia",
    ],
  },
  tools: {
    label: "Tools",
    emoji: "🔧",
    easy: [
      "Hammer", "Screwdriver", "Saw", "Drill", "Wrench", "Nail",
      "Tape measure", "Paintbrush", "Shovel", "Axe", "Pliers", "Rake",
    ],
    medium: [
      "Chainsaw", "Crowbar", "Chisel", "Clamp", "Hacksaw", "Allen key",
      "Utility knife", "Wheelbarrow", "Sledgehammer", "Toolbox", "Vise",
      "Spirit level",
    ],
    hard: [
      "Soldering iron", "Angle grinder", "Caulking gun", "Lathe",
      "Torque wrench", "Plumb bob", "Jigsaw", "Mallet", "Pipe cutter", "Awl",
      "Trowel", "Pickaxe",
    ],
  },
  vehicles: {
    label: "Vehicles",
    emoji: "🚗",
    easy: [
      "Car", "Bus", "Train", "Airplane", "Bicycle", "Motorcycle", "Boat",
      "Truck", "Helicopter", "Taxi", "Ambulance", "Fire truck",
    ],
    medium: [
      "Yacht", "Tractor", "Hot air balloon", "Jet ski", "Limousine", "Scooter",
      "Ferry", "Cable car", "Golf cart", "Snowmobile", "Sailboat", "Tank",
    ],
    hard: [
      "Zeppelin", "Rickshaw", "Hovercraft", "Gondola", "Segway", "Unicycle",
      "Bulldozer", "Forklift", "Monster truck", "Steamboat", "Dune buggy",
      "Ice cream truck",
    ],
  },
  superpowers: {
    label: "Superpowers",
    emoji: "🦸",
    easy: [
      "Flying", "Invisibility", "Super strength", "Reading minds",
      "Laser eyes", "Super speed", "Time travel", "Talking to animals",
      "X-ray vision", "Freezing things", "Breathing underwater",
      "Shooting fire",
    ],
    medium: [
      "Teleportation", "Shape-shifting", "Telekinesis", "Healing powers",
      "Controlling weather", "Stretching body", "Super hearing",
      "Walking through walls", "Growing giant", "Shrinking", "Night vision",
      "Immortality",
    ],
    hard: [
      "Stopping time", "Controlling gravity", "Erasing memories",
      "Turning things to gold", "Talking to ghosts", "Entering dreams",
      "Force fields", "Absorbing powers", "Summoning lightning",
      "Super intelligence", "Predicting the future", "Cloning yourself",
    ],
  },
  fears: {
    label: "Fears",
    emoji: "😱",
    easy: [
      "Spiders", "The dark", "Heights", "Snakes", "Ghosts", "Clowns",
      "Thunder", "The dentist", "Needles", "Sharks", "Being alone",
      "Public speaking",
    ],
    medium: [
      "Flying", "Small spaces", "Germs", "Failure", "Deep water", "Crowds",
      "Mirrors", "Dolls", "Getting lost", "Insects", "Blood", "Elevators",
    ],
    hard: [
      "Friday the 13th", "Being buried alive", "Long words", "Tiny holes",
      "Being forgotten", "Growing old", "Commitment", "Silence",
      "Running out of battery", "Missing out", "Being watched", "Butterflies",
    ],
  },
  inventions: {
    label: "Inventions",
    emoji: "💡",
    easy: [
      "The wheel", "Telephone", "Light bulb", "Computer", "Television",
      "Camera", "Refrigerator", "Internet", "Microwave", "Washing machine",
      "Robot", "Battery",
    ],
    medium: [
      "Printing press", "Steam engine", "Anesthesia", "Air conditioner",
      "Elevator", "Parachute", "Traffic light", "GPS", "Solar panel",
      "Credit card", "Escalator", "Post-it note",
    ],
    hard: [
      "Seismograph", "Pacemaker", "Barometer", "Morse code", "Telegraph",
      "Phonograph", "Dynamite", "Penicillin", "Barcode", "Hearing aid",
      "3D printer", "Cotton gin",
    ],
  },
  celebrities: {
    label: "Celebrities",
    emoji: "⭐",
    easy: [
      "Taylor Swift", "Lionel Messi", "Beyoncé", "Michael Jackson",
      "Cristiano Ronaldo", "Ariana Grande", "The Rock", "Justin Bieber",
      "Rihanna", "LeBron James", "Ed Sheeran", "Oprah",
    ],
    medium: [
      "Leonardo DiCaprio", "Serena Williams", "Elon Musk", "Lady Gaga",
      "Will Smith", "Adele", "Usain Bolt", "Keanu Reeves", "Billie Eilish",
      "Tom Cruise", "Emma Watson", "Drake",
    ],
    hard: [
      "Meryl Streep", "David Attenborough", "Freddie Mercury",
      "Charlie Chaplin", "Frida Kahlo", "Andy Warhol", "Bob Marley",
      "Bruce Lee", "Marilyn Monroe", "Elvis Presley", "Pelé",
      "Audrey Hepburn",
    ],
  },
};
