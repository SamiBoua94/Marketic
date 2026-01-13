export class HttpException extends Error {
    constructor(
        public message: string,
        public statusCode: number = 500,
        public errors?: Record<string, string[]>
    ) {
        super(message);
        this.name = 'HttpException';
        Object.setPrototypeOf(this, HttpException.prototype);
    }
}

export class BadRequestException extends HttpException {
    constructor(message: string, errors?: Record<string, string[]>) {
        super(message, 400, errors);
        this.name = 'BadRequestException';
    }
}

export class UnauthorizedException extends HttpException {
    constructor(message: string = 'Unauthorized') {
        super(message, 401);
        this.name = 'UnauthorizedException';
    }
}

export class ForbiddenException extends HttpException {
    constructor(message: string = 'Forbidden') {
        super(message, 403);
        this.name = 'ForbiddenException';
    }
}

export class NotFoundException extends HttpException {
    constructor(message: string = 'Not Found') {
        super(message, 404);
        this.name = 'NotFoundException';
    }
}

export class ConflictException extends HttpException {
    constructor(message: string = 'Conflict') {
        super(message, 409);
        this.name = 'ConflictException';
    }
}

export class InternalServerException extends HttpException {
    constructor(message: string = 'Internal Server Error') {
        super(message, 500);
        this.name = 'InternalServerException';
    }
}
