const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
//----------------------------------------------
// ----    TO RUN : npx prisma db seed ---------
//----------------------------------------------
// const additionalEmojis = [
//   // Travel & Places
//   { unicode: '🏠', name: 'House', category: 'Lieux' },
//   { unicode: '🏢', name: 'Office Building', category: 'Lieux' },
//   { unicode: '🏫', name: 'School', category: 'Lieux' },
//   { unicode: '🏛️', name: 'Classical Building', category: 'Lieux' },
//   { unicode: '⛪', name: 'Church', category: 'Lieux' },
//   { unicode: '🕌', name: 'Mosque', category: 'Lieux' },
//   { unicode: '🏕️', name: 'Camping', category: 'Lieux' },
//   { unicode: '🌁', name: 'Foggy', category: 'Lieux' },
//   { unicode: '🌃', name: 'Night with Stars', category: 'Lieux' },
//   { unicode: '🌆', name: 'Cityscape at Dusk', category: 'Lieux' },
//   { unicode: '🏝️', name: 'Desert Island', category: 'Lieux' },
  
//   // Transportation
//   { unicode: '🚗', name: 'Car', category: 'Transport' },
//   { unicode: '🚕', name: 'Taxi', category: 'Transport' },
//   { unicode: '🚌', name: 'Bus', category: 'Transport' },
//   { unicode: '🚅', name: 'Bullet Train', category: 'Transport' },
//   { unicode: '✈️', name: 'Airplane', category: 'Transport' },
//   { unicode: '🚁', name: 'Helicopter', category: 'Transport' },
//   { unicode: '⛵', name: 'Sailboat', category: 'Transport' },
//   { unicode: '🚲', name: 'Bicycle', category: 'Transport' },
//   { unicode: '🛵', name: 'Motor Scooter', category: 'Transport' },
//   { unicode: '🚇', name: 'Metro', category: 'Transport' },
  
//   // Weather & Nature
//   { unicode: '☀️', name: 'Sun', category: 'Nature' },
//   { unicode: '🌙', name: 'Crescent Moon', category: 'Nature' },
//   { unicode: '⭐', name: 'Star', category: 'Nature' },
//   { unicode: '☁️', name: 'Cloud', category: 'Nature' },
//   { unicode: '🌧️', name: 'Cloud with Rain', category: 'Nature' },
//   { unicode: '⛈️', name: 'Cloud with Lightning and Rain', category: 'Nature' },
//   { unicode: '❄️', name: 'Snowflake', category: 'Nature' },
//   { unicode: '🌈', name: 'Rainbow', category: 'Nature' },
//   { unicode: '🌊', name: 'Ocean Wave', category: 'Nature' },
//   { unicode: '🌋', name: 'Volcano', category: 'Nature' },
//   { unicode: '🏜️', name: 'Desert', category: 'Nature' },
  
//   // Celebration
//   { unicode: '🎉', name: 'Party Popper', category: 'Celebration' },
//   { unicode: '🎊', name: 'Confetti Ball', category: 'Celebration' },
//   { unicode: '🎈', name: 'Balloon', category: 'Celebration' },
//   { unicode: '🎂', name: 'Birthday Cake', category: 'Celebration' },
//   { unicode: '🎁', name: 'Wrapped Gift', category: 'Celebration' },
//   { unicode: '🎄', name: 'Christmas Tree', category: 'Celebration' },
//   { unicode: '🎇', name: 'Sparkler', category: 'Celebration' },
//   { unicode: '🎆', name: 'Fireworks', category: 'Celebration' },
//   { unicode: '🕯️', name: 'Candle', category: 'Celebration' },
//   { unicode: '🧨', name: 'Firecracker', category: 'Celebration' },
  
//   // Additional Emotions
//   { unicode: '🥰', name: 'Smiling Face with Hearts', category: 'Emotion' },
//   { unicode: '🤩', name: 'Star-Struck', category: 'Emotion' },
//   { unicode: '🫥', name: 'Dotted Line Face', category: 'Emotion' },
//   { unicode: '🥹', name: 'Face Holding Back Tears', category: 'Emotion' },
//   { unicode: '😶‍🌫️', name: 'Face in Clouds', category: 'Emotion' },
//   { unicode: '🤥', name: 'Lying Face', category: 'Emotion' },
//   { unicode: '🫨', name: 'Shaking Face', category: 'Emotion' },
//   { unicode: '🫡', name: 'Saluting Face', category: 'Emotion' },
//   { unicode: '🫶', name: 'Heart Hands', category: 'Emotion' },
  
//   // Symbols
//   { unicode: '❤️', name: 'Red Heart', category: 'Symboles' },
//   { unicode: '💔', name: 'Broken Heart', category: 'Symboles' },
//   { unicode: '💯', name: 'Hundred Points', category: 'Symboles' },
//   { unicode: '⚠️', name: 'Warning', category: 'Symboles' },
//   { unicode: '🚫', name: 'Prohibited', category: 'Symboles' },
//   { unicode: '✅', name: 'Check Mark Button', category: 'Symboles' },
//   { unicode: '❌', name: 'Cross Mark', category: 'Symboles' },
//   { unicode: '💤', name: 'Zzz', category: 'Symboles' },
//   { unicode: '💭', name: 'Thought Balloon', category: 'Symboles' },
//   { unicode: '🔄', name: 'Counterclockwise Arrows Button', category: 'Symboles' },
  
//   // Technology & Office
//   { unicode: '⌨️', name: 'Keyboard', category: 'Tech' },
//   { unicode: '🖥️', name: 'Desktop Computer', category: 'Tech' },
//   { unicode: '🖨️', name: 'Printer', category: 'Tech' },
//   { unicode: '📊', name: 'Bar Chart', category: 'Tech' },
//   { unicode: '📈', name: 'Chart Increasing', category: 'Tech' },
//   { unicode: '📉', name: 'Chart Decreasing', category: 'Tech' },
//   { unicode: '📋', name: 'Clipboard', category: 'Tech' },
//   { unicode: '📁', name: 'File Folder', category: 'Tech' },
//   { unicode: '✉️', name: 'Envelope', category: 'Tech' },
//   { unicode: '🔒', name: 'Locked', category: 'Tech' },
  
//   // Plants
//   { unicode: '🌵', name: 'Cactus', category: 'Plantes' },
//   { unicode: '🌲', name: 'Evergreen Tree', category: 'Plantes' },
//   { unicode: '🌳', name: 'Deciduous Tree', category: 'Plantes' },
//   { unicode: '🌴', name: 'Palm Tree', category: 'Plantes' },
//   { unicode: '🌱', name: 'Seedling', category: 'Plantes' },
//   { unicode: '🌿', name: 'Herb', category: 'Plantes' },
//   { unicode: '🍀', name: 'Four Leaf Clover', category: 'Plantes' },
//   { unicode: '🪴', name: 'Potted Plant', category: 'Plantes' },
//   { unicode: '🌷', name: 'Tulip', category: 'Plantes' },
//   { unicode: '🌹', name: 'Rose', category: 'Plantes' }
// ];

// const emojis = [
//   { unicode: '😊', name: 'Smile', category: 'Emotion' },
//   { unicode: '😁', name: 'Grin', category: 'Emotion' },
//   { unicode: '😂', name: 'Laugh', category: 'Emotion' },
//   { unicode: '😍', name: 'Heart Eyes', category: 'Emotion' },
//   { unicode: '🥺', name: 'Pleading Face', category: 'Emotion' },
//   { unicode: '😎', name: 'Cool', category: 'Emotion' },
//   { unicode: '😢', name: 'Cry', category: 'Emotion' },
//   { unicode: '😡', name: 'Angry', category: 'Emotion' },
//   { unicode: '🤔', name: 'Thinking', category: 'Emotion' },
//   { unicode: '🤯', name: 'Exploding Head', category: 'Emotion' },
//   { unicode: '😴', name: 'Sleep', category: 'Emotion' },
//   { unicode: '🫠', name: 'Melting Face', category: 'Emotion' },

//   { unicode: '👍', name: 'Thumbs Up', category: 'Gestes' },
//   { unicode: '👎', name: 'Thumbs Down', category: 'Gestes' },
//   { unicode: '👌', name: 'OK', category: 'Gestes' },
//   { unicode: '✌️', name: 'Victory', category: 'Gestes' },
//   { unicode: '🤞', name: 'Crossed Fingers', category: 'Gestes' },
//   { unicode: '🙌', name: 'Raising Hands', category: 'Gestes' },
//   { unicode: '👋', name: 'Wave', category: 'Gestes' },
//   { unicode: '🖐️', name: 'Hand', category: 'Gestes' },
//   { unicode: '🤙', name: 'Call Me', category: 'Gestes' },
//   { unicode: '🤜', name: 'Fist Bump', category: 'Gestes' },
//   { unicode: '🤛', name: 'Left Fist', category: 'Gestes' },

//   { unicode: '💻', name: 'Laptop', category: 'Objets' },
//   { unicode: '📱', name: 'Mobile Phone', category: 'Objets' },
//   { unicode: '🎧', name: 'Headphones', category: 'Objets' },
//   { unicode: '📷', name: 'Camera', category: 'Objets' },
//   { unicode: '🎥', name: 'Video Camera', category: 'Objets' },
//   { unicode: '⌚', name: 'Watch', category: 'Objets' },
//   { unicode: '🔋', name: 'Battery', category: 'Objets' },
//   { unicode: '🔑', name: 'Key', category: 'Objets' },
//   { unicode: '💡', name: 'Light Bulb', category: 'Objets' },
//   { unicode: '🪙', name: 'Coin', category: 'Objets' },
//   { unicode: '🔥', name: 'Fire', category: 'Objets' },

//   { unicode: '🐶', name: 'Dog', category: 'Animaux' },
//   { unicode: '🐱', name: 'Cat', category: 'Animaux' },
//   { unicode: '🐭', name: 'Mouse', category: 'Animaux' },
//   { unicode: '🐰', name: 'Rabbit', category: 'Animaux' },
//   { unicode: '🦊', name: 'Fox', category: 'Animaux' },
//   { unicode: '🐻', name: 'Bear', category: 'Animaux' },
//   { unicode: '🦁', name: 'Lion', category: 'Animaux' },
//   { unicode: '🐯', name: 'Tiger', category: 'Animaux' },
//   { unicode: '🐵', name: 'Monkey', category: 'Animaux' },
//   { unicode: '🐸', name: 'Frog', category: 'Animaux' },
//   { unicode: '🐷', name: 'Pig', category: 'Animaux' },

//   { unicode: '🍕', name: 'Pizza', category: 'Nourriture' },
//   { unicode: '🍔', name: 'Burger', category: 'Nourriture' },
//   { unicode: '🍎', name: 'Apple', category: 'Nourriture' },
//   { unicode: '🍇', name: 'Grapes', category: 'Nourriture' },
//   { unicode: '🍉', name: 'Watermelon', category: 'Nourriture' },
//   { unicode: '🍞', name: 'Bread', category: 'Nourriture' },
//   { unicode: '🥩', name: 'Steak', category: 'Nourriture' },
//   { unicode: '🍰', name: 'Cake', category: 'Nourriture' },
//   { unicode: '🍩', name: 'Donut', category: 'Nourriture' },
//   { unicode: '☕', name: 'Coffee', category: 'Nourriture' },
//   { unicode: '🍺', name: 'Beer', category: 'Nourriture' },

//   { unicode: '⚽', name: 'Football', category: 'Sports/Loisirs' },
//   { unicode: '🏀', name: 'Basketball', category: 'Sports/Loisirs' },
//   { unicode: '🏈', name: 'American Football', category: 'Sports/Loisirs' },
//   { unicode: '🎮', name: 'Video Game', category: 'Sports/Loisirs' },
//   { unicode: '🎯', name: 'Dart', category: 'Sports/Loisirs' },
//   { unicode: '🏄', name: 'Surfer', category: 'Sports/Loisirs' },
//   { unicode: '🚴', name: 'Cyclist', category: 'Sports/Loisirs' },
//   { unicode: '⛹️', name: 'Bouncing Ball', category: 'Sports/Loisirs' },
//   { unicode: '🏋️', name: 'Weight Lifter', category: 'Sports/Loisirs' },
//   { unicode: '🏆', name: 'Trophy', category: 'Sports/Loisirs' },
// ];

// Sample data for Technologie model
// const technologies = [
//   // Programming Languages
//   { id_technologie: 1, nom: "PHP" },
//   { id_technologie: 2, nom: "JavaScript" },
//   { id_technologie: 3, nom: "Python" },
//   { id_technologie: 4, nom: "Java" },
//   { id_technologie: 5, nom: "C#" },
//   { id_technologie: 6, nom: "Ruby" },
//   { id_technologie: 7, nom: "Go" },
//   { id_technologie: 8, nom: "Swift" },
//   { id_technologie: 9, nom: "Kotlin" },
//   { id_technologie: 10, nom: "TypeScript" },
//   { id_technologie: 11, nom: "Rust" },
//   { id_technologie: 12, nom: "C++" },
  
//   // Frameworks & Libraries
//   { id_technologie: 13, nom: "Laravel" },
//   { id_technologie: 14, nom: "Symfony" },
//   { id_technologie: 15, nom: "React" },
//   { id_technologie: 16, nom: "Angular" },
//   { id_technologie: 17, nom: "Vue.js" },
//   { id_technologie: 18, nom: "Node.js" },
//   { id_technologie: 19, nom: "Django" },
//   { id_technologie: 20, nom: "Flask" },
//   { id_technologie: 21, nom: "Spring Boot" },
//   { id_technologie: 22, nom: "ASP.NET" },
//   { id_technologie: 23, nom: "Ruby on Rails" },
//   { id_technologie: 24, nom: "Express.js" },
  
//   // Databases
//   { id_technologie: 25, nom: "MySQL" },
//   { id_technologie: 26, nom: "PostgreSQL" },
//   { id_technologie: 27, nom: "MongoDB" },
//   { id_technologie: 28, nom: "SQLite" },
//   { id_technologie: 29, nom: "Redis" },
//   { id_technologie: 30, nom: "Cassandra" },
  
//   // Other Technologies
//   { id_technologie: 31, nom: "Docker" },
//   { id_technologie: 32, nom: "Kubernetes" },
//   { id_technologie: 33, nom: "GraphQL" },
//   { id_technologie: 34, nom: "RESTful API" },
//   { id_technologie: 35, nom: "WebSockets" },
//   { id_technologie: 36, nom: "Microservices" },
//   { id_technologie: 37, nom: "Serverless" },
//   { id_technologie: 38, nom: "PWA" },
//   { id_technologie: 39, nom: "DevOps" },
//   { id_technologie: 40, nom: "CI/CD" },

  
//   { id_technologie: 41, nom: "Next.js" },
//   { id_technologie: 42, nom: "Nest.js"} ,

//   // Sample data
//   { id_technologie: 43, nom: "Artificial Intelligence" },
//   { id_technologie: 44, nom: "Machine Learning" },
//   { id_technologie: 45, nom: "Blockchain" },
//   { id_technologie: 46, nom: "Cloud Computing" },
//   { id_technologie: 47, nom: "Internet of Things" },
//   { id_technologie: 48, nom: "Big Data" },
//   { id_technologie: 49, nom: "Cybersecurity" },
//   { id_technologie: 50, nom: "Virtual Reality" },
//   { id_technologie: 51, nom: "Augmented Reality" },
//   { id_technologie: 52, nom: "Quantum Computing" }
// ]

// Create fake club data
// const clubsData = [
//   { nom: "BDE EHEI", ville: "Casablanca" },
//   { nom: "Club Sportif EHEI", ville: "Casablanca" },
//   { nom: "New Tech & AI", ville: "Rabat" },
//   { nom: "Real Madrid", ville: "Madrid" },
//   { nom: "Raja Casablanca", ville: "Casablanca" },
//   { nom: "Man United", ville: "Manchester" },
//   { nom: "Club Robotique EHEI", ville: "Casablanca" },
//   { nom: "Club Entrepreneuriat", ville: "Marrakech" },
//   { nom: "Barcelona FC Fan Club", ville: "Barcelona" },
//   { nom: "Chess Masters", ville: "Paris" },
//   { nom: "Coding Club", ville: "Tanger" },
//   { nom: "Juventus", ville: "Turin" },
//   { nom: "Liverpool FC", ville: "Liverpool" },
//   { nom: "Club de Débat", ville: "Rabat" },
//   { nom: "Association des Étudiants en Informatique", ville: "Casablanca" }
// ]

async function main() {
  // Insert clubs data
  console.log('Starting to seed clubs data...')

  // await prisma.clubs.deleteMany(); // Nettoyage des données avant insertion
  // await prisma.$executeRaw`ALTER TABLE Clubs AUTO_INCREMENT = 1;`; // Réinitialise l'auto-incrémentation

  for (const club of clubsData) {
    const createdClub = await prisma.clubs.create({
      data: club
    })
    console.log(`Created club with ID: ${createdClub.id_club}`)
  }
  
  console.log('Clubs seeding finished.')
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
