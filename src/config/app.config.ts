export default () => ({
  app: {
    name: process.env.APP_NAME || 'whering-test',
    port: parseInt(process.env.PORT, 10) || 3000,
    env: process.env.NODE_ENV || 'development',
  },
  database: {
    // Add database configuration here when needed
    // url: process.env.DATABASE_URL,
  },
});
