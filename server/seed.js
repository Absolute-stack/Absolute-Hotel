import "dotenv/config";
import mongoose from "mongoose";
import { Room } from "./models/roomModel.js";

const MONGO_URI = process.env.DB;

// ─── Real Unsplash images per room type ──────────────────────────────────────
const images = {
  single: [
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
    "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800",
    "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800",
    "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800",
    "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800",
    "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800",
  ],
  double: [
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
    "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
    "https://images.unsplash.com/photo-1560185007-5f0bb1866cab?w=800",
    "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800",
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800",
  ],
  suite: [
    "https://images.unsplash.com/photo-1631049421450-348ccd7f8949?w=800",
    "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800",
    "https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=800",
    "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800",
    "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800",
    "https://images.unsplash.com/photo-1559599189-fe84dea4eb79?w=800",
  ],
  penthouse: [
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
    "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800",
    "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
    "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800",
  ],
};

// ─── Room config per type ─────────────────────────────────────────────────────
const config = {
  single: {
    capacity: 1,
    priceRange: [200, 450],
    floors: [1, 2, 3],
    names: [
      "Classic Single Room",
      "Cozy Single Room",
      "Standard Single Room",
      "Comfort Single Room",
      "Economy Single Room",
    ],
    descriptions: [
      "A well-appointed single room with contemporary furnishings, ideal for the solo business traveller seeking comfort and convenience.",
      "A cosy single room with modern amenities and a warm atmosphere, perfect for solo travellers looking for a relaxing stay.",
      "A classic single room with elegant decor, providing all the essentials for a pleasant and productive stay.",
      "A bright and thoughtfully designed single room offering city views and all the comforts of home.",
    ],
    amenities: [
      ["wifi", "ac", "tv", "safe", "desk"],
      ["wifi", "ac", "tv", "minibar", "safe"],
      ["wifi", "ac", "tv", "desk", "wardrobe"],
      ["wifi", "ac", "tv", "minibar", "iron"],
    ],
  },
  double: {
    capacity: 2,
    priceRange: [400, 750],
    floors: [2, 3, 4, 5],
    names: [
      "Deluxe Double Room",
      "Superior Double Room",
      "Standard Double Room",
      "Comfort Double Room",
      "Classic Double Room",
    ],
    descriptions: [
      "A spacious double room with a king-size bed and premium bedding, perfect for couples seeking a romantic getaway.",
      "A superior double room featuring stunning city views, plush furnishings and a modern en-suite bathroom.",
      "A well-furnished double room with all modern amenities, great for couples or friends travelling together.",
      "A classic double room with elegant furnishings and a tranquil atmosphere designed for a restful stay.",
    ],
    amenities: [
      ["wifi", "ac", "tv", "minibar", "safe", "bathtub"],
      ["wifi", "ac", "tv", "minibar", "balcony", "safe"],
      ["wifi", "ac", "tv", "safe", "desk", "sofa"],
      ["wifi", "ac", "tv", "minibar", "safe", "pool access"],
    ],
  },
  suite: {
    capacity: 3,
    priceRange: [900, 1800],
    floors: [5, 6, 7, 8],
    names: [
      "Junior Suite",
      "Executive Suite",
      "Luxury Suite",
      "Premium Suite",
      "Grand Suite",
    ],
    descriptions: [
      "An elegant suite with a separate living area and premium amenities, offering the perfect blend of space and luxury.",
      "A premium suite featuring a spacious living room, a fully stocked minibar and breathtaking panoramic views.",
      "A luxurious suite with top-of-the-line amenities, exquisite decor and exclusive access to our butler service.",
      "A grand suite with a private balcony, a marble bathroom and sweeping city views for the ultimate indulgence.",
    ],
    amenities: [
      [
        "wifi",
        "ac",
        "tv",
        "minibar",
        "safe",
        "bathtub",
        "living room",
        "balcony",
      ],
      [
        "wifi",
        "ac",
        "tv",
        "minibar",
        "jacuzzi",
        "living room",
        "kitchenette",
        "butler service",
      ],
      [
        "wifi",
        "ac",
        "tv",
        "minibar",
        "safe",
        "dining area",
        "pool access",
        "butler service",
      ],
      [
        "wifi",
        "ac",
        "tv",
        "minibar",
        "safe",
        "sofa",
        "living room",
        "ocean view",
      ],
    ],
  },
  penthouse: {
    capacity: 4,
    priceRange: [2500, 6000],
    floors: [9, 10, 11, 12],
    names: [
      "Sky Penthouse",
      "Royal Penthouse",
      "Presidential Penthouse",
      "Imperial Penthouse",
      "Signature Penthouse",
    ],
    descriptions: [
      "The ultimate in luxury living — this penthouse offers unparalleled 360-degree views, a private pool and bespoke butler service.",
      "A royal penthouse experience with a private rooftop terrace, jacuzzi, personal butler and world-class amenities.",
      "Our presidential penthouse sets the standard for opulence with its private pool, chef's kitchen and panoramic city views.",
      "An iconic penthouse residence featuring the finest furnishings, a private cinema room and exclusive concierge access.",
    ],
    amenities: [
      [
        "wifi",
        "ac",
        "tv",
        "minibar",
        "jacuzzi",
        "private pool",
        "terrace",
        "butler service",
        "kitchen",
      ],
      [
        "wifi",
        "ac",
        "tv",
        "minibar",
        "jacuzzi",
        "private terrace",
        "butler service",
        "dining room",
        "gym",
      ],
      [
        "wifi",
        "ac",
        "tv",
        "minibar",
        "sauna",
        "private pool",
        "butler service",
        "kitchen",
        "cinema",
      ],
      [
        "wifi",
        "ac",
        "tv",
        "minibar",
        "jacuzzi",
        "rooftop access",
        "butler service",
        "kitchen",
        "bar",
      ],
    ],
  },
};

// ─── Distribution: 50 rooms ───────────────────────────────────────────────────
const distribution = [
  { type: "single", count: 15 },
  { type: "double", count: 20 },
  { type: "suite", count: 10 },
  { type: "penthouse", count: 5 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomPrice = ([min, max]) =>
  Math.round(getRandomInt(min, max) / 50) * 50;
const getRandomImages = (type) => {
  const pool = [...images[type]];
  const count = getRandomInt(2, 4);
  const result = [];
  for (let i = 0; i < count && pool.length > 0; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    result.push(pool.splice(idx, 1)[0]);
  }
  return result;
};

// ─── Generate rooms ───────────────────────────────────────────────────────────
function generateRooms() {
  const rooms = [];
  const usedRoomNumbers = new Set();

  for (const { type, count } of distribution) {
    const cfg = config[type];

    for (let i = 0; i < count; i++) {
      // Generate unique room number
      let roomNumber;
      do {
        const floor = getRandom(cfg.floors);
        const num = String(getRandomInt(1, 20)).padStart(2, "0");
        roomNumber = `${floor}${num}`;
      } while (usedRoomNumbers.has(roomNumber));
      usedRoomNumbers.add(roomNumber);

      const floor = Number(roomNumber[0]);

      rooms.push({
        name: getRandom(cfg.names),
        roomNumber,
        type,
        price: getRandomPrice(cfg.priceRange),
        capacity: cfg.capacity,
        description: getRandom(cfg.descriptions),
        images: getRandomImages(type),
        amenities: getRandom(cfg.amenities),
        isAvailable: Math.random() > 0.1, // 90% available
        floor,
        avgRating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)), // 3.5 - 5.0
        totalReviews: getRandomInt(0, 80),
      });
    }
  }

  return rooms;
}

// ─── Seed ─────────────────────────────────────────────────────────────────────
async function seed() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected\n");

    console.log("🗑️  Clearing existing rooms...");
    await Room.deleteMany({});
    console.log("✅ Cleared\n");

    console.log("🌱 Generating 50 rooms...");
    const rooms = generateRooms();

    console.log("💾 Inserting into MongoDB...");
    await Room.insertMany(rooms);

    const counts = distribution.map(({ type, count }) => `  ${type}: ${count}`);
    console.log("\n✅ Seeded successfully!");
    console.log("🏨 Room breakdown:");
    console.log(counts.join("\n"));
    console.log(`\n  Total: ${rooms.length} rooms`);
  } catch (error) {
    console.error("❌ Seed failed:", error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from MongoDB");
  }
}

seed();
