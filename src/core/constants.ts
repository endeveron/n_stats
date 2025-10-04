const APP_ID = process.env.NEXT_PUBLIC_APP_ID as string;

const API_BASE_URL = process.env.API_BASE_URL as string;
const API_ACCESS_TOKEN = process.env.API_ACCESS_TOKEN as string;
const EMAIL_WHITELIST = process.env.EMAIL_WHITELIST as string;

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL as string;
const ASSET_URL = process.env.NEXT_PUBLIC_ASSET_URL as string;

const STATE_KEY = process.env.NEXT_PUBLIC_STATE_KEY as string;
const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING as string;
const NOTIFICATIONS_WEBHOOK = process.env.NOTIFICATIONS_WEBHOOK as string;

const AUTH_SECRET = process.env.DB_CONNECTION_STRING as string;
const ENCRYPTION_PASSPHRASE = process.env.ENCRYPTION_PASSPHRASE as string;

const EMAIL_JWT = process.env.EMAIL_JWT as string;
const NODEMAILER_USER = process.env.NODEMAILER_USER as string;
const NODEMAILER_PASSWORD = process.env.NODEMAILER_PASSWORD as string;

const APP_NAME = 'Stats';

// Routes
const SIGNIN_REDIRECT = '/signin';
const SIGNUP_REDIRECT = '/signup';
const DEFAULT_REDIRECT = '/dashboard'; // after user signed in.

export {
  APP_ID,
  API_BASE_URL,
  API_ACCESS_TOKEN,
  EMAIL_WHITELIST,
  BASE_URL,
  ASSET_URL,
  STATE_KEY,
  DB_CONNECTION_STRING,
  NOTIFICATIONS_WEBHOOK,
  AUTH_SECRET,
  ENCRYPTION_PASSPHRASE,
  EMAIL_JWT,
  NODEMAILER_USER,
  NODEMAILER_PASSWORD,
  APP_NAME,
  SIGNIN_REDIRECT,
  SIGNUP_REDIRECT,
  DEFAULT_REDIRECT,
};
