declare namespace NodeJS {
    interface ProcessEnv {
        PORT?: string;
        URL_CONNECT_MONGO: string;
        LOGOUT_TIME: string;
        ACTIVITY_CHECKER_TIME: string;
    }
}
