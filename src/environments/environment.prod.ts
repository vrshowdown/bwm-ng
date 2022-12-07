import data from './json/keys.json';
export const environment = {
  production: true,
  STRIPE_PK: data.STRIPE_PK,
  GOOGLE_MAP_PUBLIC_KEY:data.GOOGLE_MAP_PUBLIC_KEY 
};
