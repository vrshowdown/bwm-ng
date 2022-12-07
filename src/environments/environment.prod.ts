import { env } from 'process';
export const environment = {
  production: true,
  STRIPE_PK: env.STRIPE_PK,
  GOOGLE_MAP_PUBLIC_KEY: env.GOOGLE_MAP_PUBLIC_KEY
};
