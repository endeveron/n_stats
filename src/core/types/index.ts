export type APIResponseData = {
  message: string;
  success: boolean;
};

// export type PageParams = Promise<{ slug: string }>;

export type SearchParams = Promise<{
  [key: string]: string | string[] | undefined;
}>;

export type ErrorWithCode = { code?: number; message: string };

export type ServerActionError = {
  success: false;
  error: Error | ErrorWithCode;
};

export type ServerActionResult<T = unknown> =
  | {
      success: true;
      data?: T;
    }
  | ServerActionError;

export type APIResult<T> = {
  data: T | null;
  error?: string;
};
