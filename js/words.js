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
    label: "Sports & Games",
    emoji: "⚽",
    easy: [
      "Soccer", "Basketball", "Swimming", "Tennis", "Running", "Baseball",
      "Golf", "Boxing", "Cycling", "Volleyball", "Chess", "Bowling",
      "Ping pong", "Hide and seek", "Skateboarding", "Fishing",
    ],
    medium: [
      "Surfing", "Archery", "Karate", "Rock climbing", "Ice skating", "Rugby",
      "Fencing", "Snowboarding", "Poker", "Darts", "Gymnastics", "Rowing",
      "Cricket", "Billiards", "Marathon", "Judo",
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
};
