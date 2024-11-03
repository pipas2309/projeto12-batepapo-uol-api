/** Classe base de erros HTTP. */
export class HttpError extends Error {
    statusCode: number;
    message: string;

    /**
     * Cria uma instância de HttpError.
     * @param statusCode - HTTP status code.
     * @param message - Mensagem de erro.
     */
    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
    }
}

/** Representa o erro 400 - Bad Request. */
export class BadRequestError extends HttpError {
    constructor(message = 'Bad Request') {
        super(400, message);
    }
}

/** Representa o erro 401 - Unauthorized Request. */
export class UnauthorizedError extends HttpError {
    constructor(message = 'Unauthorized') {
        super(401, message);
    }
}

/** Representa o erro 403 - Forbidden Request. */
export class ForbiddenError extends HttpError {
    constructor(message = 'Forbidden') {
        super(403, message);
    }
}

/** Representa o erro 404 - Not Found Request. */
export class NotFoundError extends HttpError {
    constructor(message = 'Not Found') {
        super(404, message);
    }
}

/** Representa o erro 409 - Conflict Error Request. */
export class ConflictError extends HttpError {
    constructor(message = 'ConflictError') {
        super(409, message);
    }
}
