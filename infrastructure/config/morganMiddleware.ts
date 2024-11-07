import morgan, { StreamOptions } from "morgan";
import { IncomingMessage } from "http";
import { logger } from "./logger";

interface Request extends IncomingMessage {
    body: {
        query?: string;
    };
}

const stream: StreamOptions = {
    write: (message) => logger.http(message.trim()),
};

const skip = () => {
    const env = process.env.NODE_ENV || "development";
    return env !== "development";
};

const registerGraphQLToken = () => {
    morgan.token("graphql-query", (req: Request) => {
        if (req.body && req.body.query) {
            return `GraphQL ${req.body.query}`;
        }
        return "";
    });
};

registerGraphQLToken();

const morganMiddleware = morgan(
    ":method :url :status :res[content-length] - :response-time ms\n:graphql-query",
    { stream, skip }
);

export default morganMiddleware;
