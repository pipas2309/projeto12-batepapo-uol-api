export class HttpError extends Error {
    statusCode: number;
    message: string;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
    }
}

// Erros específicos
export class BadRequestError extends HttpError {
    constructor(message = 'Bad Request') {
        super(400, message);
    }
}

export class UnauthorizedError extends HttpError {
    constructor(message = 'Unauthorized') {
        super(401, message);
    }
}

export class ForbiddenError extends HttpError {
    constructor(message = 'Forbidden') {
        super(403, message);
    }
}

export class NotFoundError extends HttpError {
    constructor(message = 'Not Found') {
        super(404, message);
    }
}

export class InternalServerError extends HttpError {
    constructor(message = 'Internal Server Error') {
        super(500, message);
    }
}

export class ConflictError extends HttpError {
    constructor(message = 'ConflictError') {
        super(409, message);
    }
}
