export type NormalizedError = {
  message: string;
  data?: unknown;
  statusCode?: number;
  error: unknown; // keep original for debugging
};

type AxiosLikeError = {
  response?: {
    data?: { message?: string; [key: string]: unknown };
    status?: number;
  };
};

export function normalizeError(error: unknown): NormalizedError {
  // Axios or custom API errors often have response
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as Record<string, unknown>)['response'] === 'object'
  ) {
    const err = error as AxiosLikeError;
    return {
      message: err.response?.data?.message ?? 'Request failed',
      data: err.response?.data,
      statusCode: err.response?.status,
      error,
    };
  }

  // Native JS Error
  if (error instanceof Error) {
    return {
      message: error.message,
      error,
    };
  }

  // Custom object with message
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return {
      message: String((error as { message: unknown }).message),
      error,
    };
  }

  // Fallback for strings, numbers, etc.
  return {
    message: String(error),
    error,
  };
}
