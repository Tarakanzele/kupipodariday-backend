export default () => ({
  port: parseInt(process.env.PORT || '3001', 10),
  database: {
    type: process.env.DATABASE_TYPE || 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    username: process.env.DATABASE_USER || 'student',
    password: process.env.DATABASE_PASSWORD || 'student',
    name: process.env.DATABASE_NAME || 'kupipodariday',
  },
  jwt: {
    secret: process.env.JWT_KEY || 'supersecretkey',
  },
});
