import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  console.log("Seeding themes...");

  const themes = [
    {
      name: "Al-Andalus Gold",
      slug: "al-andalus-gold",
      tags: ["arabic", "luxury", "animated", "wedding"],
      eventTypes: ["wedding", "engagement"],
      isPremium: false,
      previewImageUrl: "/themes/al-andalus-gold.jpg",
      colorPalette: {
        primary: "#C9A84C",
        secondary: "#1A0E0A",
        accent: "#8B2020",
        background: "#0D0B08",
        text: "#F5E4B0",
      },
      fontPrimary: "Cormorant Garamond",
      fontSecondary: "Jost",
      animationStyle: "floating_petals",
      musicSuggestion: "Fairuz — Li Beirut",
      language: "ar",
    },
    {
      name: "Celestial Blue",
      slug: "celestial-blue",
      tags: ["european", "minimal", "elegant", "wedding"],
      eventTypes: ["wedding", "engagement"],
      isPremium: false,
      previewImageUrl: "/themes/celestial-blue.jpg",
      colorPalette: {
        primary: "#7A9ACC",
        secondary: "#0F1520",
        accent: "#4A7ACC",
        background: "#08101A",
        text: "#E8F0FA",
      },
      fontPrimary: "Playfair Display",
      fontSecondary: "DM Sans",
      animationStyle: "elegant_fade",
      musicSuggestion: "Debussy — Clair de Lune",
      language: "en",
    },
    {
      name: "Rosa Eterna",
      slug: "rosa-eterna",
      tags: ["italian", "romantic", "floral", "wedding"],
      eventTypes: ["wedding", "engagement"],
      isPremium: true,
      previewImageUrl: "/themes/rosa-eterna.jpg",
      colorPalette: {
        primary: "#CC6666",
        secondary: "#1A0808",
        accent: "#E8A0A0",
        background: "#0D0808",
        text: "#FAE8E8",
      },
      fontPrimary: "EB Garamond",
      fontSecondary: "Raleway",
      animationStyle: "botanical",
      musicSuggestion: "Satie — Gymnopédie No.1",
      language: "en",
    },
    {
      name: "Jardin Secret",
      slug: "jardin-secret",
      tags: ["garden", "botanical", "spring", "birthday"],
      eventTypes: ["wedding", "birthday", "engagement"],
      isPremium: false,
      previewImageUrl: "/themes/jardin-secret.jpg",
      colorPalette: {
        primary: "#4A9468",
        secondary: "#060A08",
        accent: "#80C4A0",
        background: "#0C1510",
        text: "#E8F5EE",
      },
      fontPrimary: "Cormorant Garamond",
      fontSecondary: "Jost",
      animationStyle: "botanical",
      musicSuggestion: "Acoustic Guitar · Birdsong Ambient",
      language: "fr",
    },
    {
      name: "Midnight Gala",
      slug: "midnight-gala",
      tags: ["corporate", "formal", "luxury", "modern"],
      eventTypes: ["corporate", "vip", "graduation"],
      isPremium: true,
      previewImageUrl: "/themes/midnight-gala.jpg",
      colorPalette: {
        primary: "#7A9ACC",
        secondary: "#0F1520",
        accent: "#4A7ACC",
        background: "#08101A",
        text: "#E8F0FA",
      },
      fontPrimary: "Playfair Display",
      fontSecondary: "Outfit",
      animationStyle: "shimmer",
      musicSuggestion: "Jazz Quartet · Elegant Lounge",
      language: "en",
    },
  ];

  for (const theme of themes) {
    await db.theme.upsert({
      where: { slug: theme.slug },
      update: theme,
      create: theme,
    });
    console.log(`  ✓ ${theme.name}`);
  }

  console.log("Seeding complete.");
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
