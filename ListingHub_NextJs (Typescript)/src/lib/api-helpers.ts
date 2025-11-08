import { NextRequest } from 'next/server';
import { adminAuth } from './firebase-admin';
import { ApiResponse } from '@/types';

/**
 * Verify Firebase Auth token from request headers
 */
export async function verifyAuthToken(request: NextRequest): Promise<string | null> {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    
    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    
    return decodedToken.uid;
  } catch (error) {
    console.error('Error verifying auth token:', error);
    return null;
  }
}

/**
 * Create an error response
 */
export function errorResponse(message: string, status: number = 400): Response {
  const response: ApiResponse<null> = {
    success: false,
    error: message,
  };
  
  return Response.json(response, { status });
}

/**
 * Create a success response
 */
export function successResponse<T>(data: T, message?: string): Response {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
  };
  
  return Response.json(response);
}

/**
 * Validate request body
 */
export function validateRequestBody<T>(body: any, requiredFields: (keyof T)[]): { valid: boolean; missing?: string[] } {
  const missing: string[] = [];
  
  for (const field of requiredFields) {
    if (body[field] === undefined || body[field] === null || body[field] === '') {
      missing.push(String(field));
    }
  }
  
  return {
    valid: missing.length === 0,
    missing: missing.length > 0 ? missing : undefined,
  };
}

