export const EMAIL_NOT_FOUND_ERROR_MESSAGE = "Account not found for email";

/**
 * Interface for validation error returned by backend
 */
export interface ValidationError {
  error: string;
  field: string;
  restriction?: string;
}

/**
 * Type guard to check if response is a Fetch API Response object
 */
function isFetchResponse(response: unknown): response is Response {
  return (
    response !== null &&
    typeof response === 'object' &&
    'json' in response &&
    typeof (response as Response).json === 'function' &&
    'clone' in response &&
    typeof (response as Response).clone === 'function'
  );
}

/**
 * Type guard to check if response has a data property 
 */
function hasDataProperty(response: unknown): response is { data: unknown } {
  return response !== null && typeof response === 'object' && 'data' in response;
}

/**
 * Parse validation errors from API response
 * Expected format: [{"error":"MAX_PRICE","field":"hotelCosts","restriction":"10000"}]
 * 
 * Note: This function is async because it needs to parse the body of Fetch API Response objects
 * using response.json() or response.text(), which are async operations.
 * 
 * @param error - The error object from the API
 * @returns Parsed validation errors or null
 */
export async function parseValidationErrors(error: unknown): Promise<ValidationError[] | null> {
  try {
    // Check if error has a response property (both Fetch API and Axios wrap responses)
    if (error && typeof error === 'object' && 'response' in error) {
      const response = (error as { response?: unknown }).response;
      
      // Fetch API Response object - needs async parsing
      if (isFetchResponse(response)) {
        try {
          const clonedResponse = response.clone();
          const data = await clonedResponse.json();
          if (Array.isArray(data)) {
            return data as ValidationError[];
          }
        } catch {
          // Try text parsing if JSON fails
          try {
            const clonedResponse = response.clone();
            const text = await clonedResponse.text();
            const parsed = JSON.parse(text);
            if (Array.isArray(parsed)) {
              return parsed as ValidationError[];
            }
          } catch {
            // Continue to next check
          }
        }
      }
      
      // Axios response with data property
      if (hasDataProperty(response)) {
        // Data is already an array
        if (Array.isArray(response.data)) {
          return response.data as ValidationError[];
        }
        
        // Data is a JSON string
        if (typeof response.data === 'string') {
          try {
            const parsed = JSON.parse(response.data);
            if (Array.isArray(parsed)) {
              return parsed as ValidationError[];
            }
          } catch {
            // Continue to next check
          }
        }
      }
    }
    
    // Error is directly an array of validation errors
    if (Array.isArray(error)) {
      return error as ValidationError[];
    }
    
    // Error is a JSON string
    if (typeof error === 'string') {
      try {
        const parsed = JSON.parse(error);
        if (Array.isArray(parsed)) {
          return parsed as ValidationError[];
        }
      } catch {
        // Continue to next check
      }
    }
    
    // Error message is a JSON string
    if (error && typeof error === 'object' && 'message' in error) {
      const message = (error as { message?: unknown }).message;
      if (typeof message === 'string') {
        try {
          const parsed = JSON.parse(message);
          if (Array.isArray(parsed)) {
            return parsed as ValidationError[];
          }
        } catch {
          // Not a valid JSON string
        }
      }
    }
    
    return null;
  } catch {
    return null;
  }
}

/**
 * Build i18n error key from validation error
 * This integrates with the existing i18n error system
 * 
 * @param error - Validation error from backend
 * @returns i18n key like "Error: MAX_PRICE"
 */
export function buildErrorKey(error: ValidationError): string {
  return `Error: ${error.error}`;
}