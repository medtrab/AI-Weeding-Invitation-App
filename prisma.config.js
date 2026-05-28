// Plain JS fallback for Prisma 7 config
// Prisma will use this if the .ts version fails to load

module.exports = {
  earlyAccess: true,
  datasource: {
    url: process.env.DATABASE_URL,
  },
};
