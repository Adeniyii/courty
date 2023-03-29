export default () => ({
  environment: process.env.NODE_ENV || 'development',
  databaseUrl:
    process.env.DATABASE_URL ||
    'postgresql://postgres:postgres@localhost:5432/courty',
  user: process.env.MAIL_USERNAME,
  pass: process.env.MAIL_PASSWORD,
  clientId: process.env.OAUTH_CLIENTID,
  clientSecret: process.env.OAUTH_CLIENT_SECRET,
  refreshToken: process.env.OAUTH_REFRESH_TOKEN,
});
