import { NextResponse } from "next/server";
import { handleApiError } from "./errors";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode: number;
}

export function createApiResponse<T>(
  data: T,
  message?: string,
  statusCode: number = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
      statusCode,
    },
    { status: statusCode }
  );
}

export function createErrorResponse(
  error: unknown,
  statusCode?: number
): NextResponse<ApiResponse> {
  const { message, statusCode: errorStatusCode } = handleApiError(error);
  const finalStatusCode = statusCode || errorStatusCode;

  return NextResponse.json(
    {
      success: false,
      error: message,
      statusCode: finalStatusCode,
    },
    { status: finalStatusCode }
  );
}

export function createValidationErrorResponse(
  errors: any[],
  message: string = "Validation failed"
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: message,
      details: errors,
      statusCode: 400,
    },
    { status: 400 }
  );
}

export function createNotFoundResponse(
  message: string = "Resource not found"
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: message,
      statusCode: 404,
    },
    { status: 404 }
  );
}

export function createUnauthorizedResponse(
  message: string = "Unauthorized"
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: message,
      statusCode: 401,
    },
    { status: 401 }
  );
}

export function createConflictResponse(
  message: string = "Resource conflict"
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: message,
      statusCode: 409,
    },
    { status: 409 }
  );
}
