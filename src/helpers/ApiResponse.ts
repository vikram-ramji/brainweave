import { ApiSuccessResponse, ApiErrorResponse } from "@/types/ApiResponse";
import { NextResponse } from "next/server";

/**
 * Helper function to send a consistent success API response.
 * @param message A descriptive success message.
 * @param data Optional data payload.
 * @param status The HTTP status code (default: 200).
 * @returns NextResponse object.
 */
export function SuccessResponse<T>(
  message: string,
  status: number = 200,
  data?: T
): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json({ success: true, message, data }, { status });
}

/**
 * Helper function to send a consistent error API response.
 * @param message A descriptive error message.
 * @param status The HTTP status code (default: 400).
 * @returns NextResponse object.
 */
export function ErrorResponse(
  message: string,
  status: number = 400
): NextResponse<ApiErrorResponse> {
  return NextResponse.json({ success: false, message }, { status });
}
