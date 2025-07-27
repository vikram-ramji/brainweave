import { NextResponse } from "next/server";
import { ApiResponse, ApiDataResponse } from "@/types/ApiResponse";

/**
 * 200‐level success with no `data` field.
 */
export function SuccessResponse(
  message: string,
  status = 200
): NextResponse<ApiResponse> {
  return NextResponse.json({ success: true, message, status });
}

/**
 * 200‐level success *with* a guaranteed payload.
 */
export function SuccessResponseWithData<T>(
  data: T,
  message = "OK",
  status = 200
): NextResponse<ApiDataResponse<T>> {
  return NextResponse.json({ success: true, message, data, status });
}

/**
 * 400/500‐level error (never has `data`)
 */
export function ErrorResponse(
  message: string,
  status = 400
): NextResponse<ApiResponse> {
  return NextResponse.json({ success: false, message, status });
}
