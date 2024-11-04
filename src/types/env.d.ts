declare namespace NodeJS {
    interface ProcessEnv {
        PORT?: string;
        NODE_ENV: string;
        URL_CONNECT_MONGO: string;
        URL_CONNECT_MONGO_TEST: string;
        LOGOUT_TIME: string;
        ACTIVITY_CHECKER_TIME: string;
    }
}
