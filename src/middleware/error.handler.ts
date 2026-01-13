import { NextRequest, NextResponse } from 'next/server';
import { HttpException } from '@/exceptions/http.exception';

export function handleError(error: any) {
    console.error('Error:', error);

    if (error instanceof HttpException) {
        return NextResponse.json(
            {
                success: false,
                error: error.message,
                ...(error.errors && { errors: error.errors }),
                statusCode: error.statusCode,
                timestamp: new Date(),
            },
            { status: error.statusCode }
        );
    }

    if (error.name === 'ZodError') {
        return NextResponse.json(
            {
                success: false,
                error: 'Validation error',
                errors: error.errors,
                statusCode: 400,
                timestamp: new Date(),
            },
            { status: 400 }
        );
    }

    return NextResponse.json(
        {
            success: false,
            error: 'Internal server error',
            statusCode: 500,
            timestamp: new Date(),
        },
        { status: 500 }
    );
}

export function successResponse<T>(data: T, statusCode: number = 200) {
    return NextResponse.json(
        {
            success: true,
            data,
            statusCode,
            timestamp: new Date(),
        },
        { status: statusCode }
    );
}

export function errorResponse(message: string, statusCode: number = 400, errors?: Record<string, string[]>) {
    return NextResponse.json(
        {
            success: false,
            error: message,
            ...(errors && { errors }),
            statusCode,
            timestamp: new Date(),
        },
        { status: statusCode }
    );
}
