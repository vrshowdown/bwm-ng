
const config = require('../../server/config');
export const environment = {
  production: true,
  STRIPE_PK: config.STRIPE_PK,
  GOOGLE_MAP_PUBLIC_KEY: config.GOOGLE_MAP_PUBLIC_KEY
};
