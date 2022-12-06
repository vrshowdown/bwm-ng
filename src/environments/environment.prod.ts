import { env } from 'process';
import data from './json/keys.json';

export const environment = {
  production: true,
  STRIPE_PK: process.env.STRIPE_PK,
  GOOGLE_MAP_PUBLIC_KEY: process.env.GOOGLE_MAP_PUBLIC_KEY
};