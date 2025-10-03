import { ServerActionResult } from '@/core/types';
import { type ClassValue, clsx } from 'clsx';
import crypto from 'crypto';
import { twMerge } from 'tailwind-merge';

const alphanumCharset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

// Custom error class for timeout scenarios
export class TimeoutError extends Error {
  constructor(message: string, public readonly timeoutMs: number) {
    super(message);
    this.name = 'TimeoutError';
  }
}
// Configuration interface for the timeout function
interface TimeoutConfig {
  timeoutMs: number;
  errorMessage?: string;
}
// Generic utility function that works with any async operation
export async function runWithTimeoutAsync<T>(
  operation: () => Promise<T>,
  config: TimeoutConfig
): Promise<T> {
  const { timeoutMs, errorMessage } = config;

  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(
      () =>
        reject(
          new TimeoutError(
            errorMessage ?? `Operation timed out after ${timeoutMs}ms`,
            timeoutMs
          )
        ),
      timeoutMs
    );
  });

  try {
    return await Promise.race([operation(), timeoutPromise]);
  } catch (error) {
    // Re-throw the error to let the caller handle it
    throw error;
  }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a cryptographically secure random code of a specified length using alphanumeric characters.
 * @param [length=8] - The code length. Default is 8 characters.
 * @returns A randomly generated code.
 */
export function generateCode(length = 8) {
  const bytes = crypto.randomBytes(length);
  let code = '';

  for (let i = 0; i < length; i++) {
    const index = bytes[i] % alphanumCharset.length;
    code += alphanumCharset[index];
  }
  return code;
}

/**
 * Delays execution for a specified amount of time.
 * @param {number} delay - the delay in milliseconds.
 */
export async function wait(delay: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, delay));
}

/**
 * Scales a number by a given factor and rounds it to a specified number of decimal places.
 *
 * @param value - The original number to be scaled and rounded.
 * @param scaleFactor - The factor by which to divide the original number (default is 1000).
 * @param decimals - The number of decimal places to round to (default is 1).
 * @returns The scaled and rounded number.
 *
 * @example
 * scaleAndRound(6200.000286102295); // Returns 6.2
 */
export function scaleAndRound(
  value: number,
  scaleFactor: number = 1000,
  decimals: number = 1
): number {
  const scaled = value / scaleFactor;
  const rounded = parseFloat(scaled.toFixed(decimals));
  return rounded;
}

/**
 * Rounds a value to a specified number of decimal places.
 *
 * @param value - The original number to be scaled and rounded.
 * @param decimals - The number of decimal places to round to (default is 2).
 * @returns The scaled and rounded number.
 *
 * @example
 * round(6200.000286102295); // Returns 6200
 */
export function round(value: number, decimals: number = 2): number {
  const rounded = parseFloat(value.toFixed(decimals));
  return rounded;
}

/**
 * Returns a random element from that array.
 * @param {T[]} array - An array of type `T`.
 * @param {number} length - The length of the array.
 * @returns A random element from the input array is being returned.
 */
export const getRandom = <T>(array: T[], length?: number) => {
  return array[Math.floor(Math.random() * (length ?? array.length))];
};

/**
 * Converts a camelCase or lowercase string into a properly formatted title.
 * - Splits camelCase into separate words.
 * - Converts all words to lowercase.
 * - Capitalizes only the first word.
 * @param input - The input string to convert (e.g., "someCollection", "collection").
 * @returns A properly formatted title string (e.g., "Some collection", "Collection").
 */
export const toProperTitle = (input: string): string => {
  // Split camelCase into words
  const words = input
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .toLowerCase()
    .split(' ');
  // Capitalize the first word
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return words.join(' ');
};

/**
 * Processes server action results and handles errors with fallback data.
 * @returns an object with two properties: `error` and `data`.
 * The `error` property contains a string message if there was an error during the server
 * action result handling, otherwise it is undefined.
 * The `data` property contains the data returned from the server action result.
 */
export const handleServerActionResult = <T>({
  res,
  fileName,
  errMsg,
  fallbackData,
}: {
  res: ServerActionResult<T> | undefined;
  fileName: string;
  errMsg: string;
  fallbackData: T;
}): { error?: string; data: T } => {
  const fullErrMsg = `[${fileName}] ${errMsg}`;

  if (!res) {
    console.error(`${fullErrMsg}: No response`);
    return { error: `${fullErrMsg}: No response`, data: fallbackData };
  }

  if (res.success === false) {
    console.error(`${fullErrMsg}: ${res.error.message}`);
    return { error: `${fullErrMsg}: ${res.error.message}`, data: fallbackData };
  }

  if (!res.data) {
    console.error(`${fullErrMsg}: Invalid or missing data`);
    return {
      error: `${fullErrMsg}: Invalid or missing data`,
      data: fallbackData,
    };
  }

  return { data: res.data };
};

/**
 * Checks if a given string value is a numeric value.
 * @param {string} value - a string, then attempts to parse it as a float.
 * @returns a boolean value, which indicates whether the input value is numeric or not.
 */
export function isNumeric(value: string): boolean {
  if (typeof value !== 'string') return false;
  const num = parseFloat(value);
  return !isNaN(num) && isFinite(num) && value.trim() !== '';
}
