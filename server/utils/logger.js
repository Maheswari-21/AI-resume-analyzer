const { createLogger, format, transports } = require("winston");
const fs = require("fs");

if (!fs.existsSync("log")) {
    fs.mkdirSync("log");
}
const logger = createLogger({
    level: process.env.LOG_LEVEL || "info",

    format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.printf(({ level, message, timestamp, stack }) => {
            return stack
                ? `${timestamp} [${level}] ${message}-${stack}`
                : `${timestamp} [${level}] $${message}`;
        })
    ),
    transports: [

        new transports.Console({
            level: process.env.NODE_ENV === "production" ? "warn" : "debug"
        }),
        new transports.File({
            filename: "logs/error.log",
            level: "error",
            maxsize: 5000000,
            maxfiles: 3
        }),
        new transports.File({
            filename: "logs/error.log",
            maxsize: 5000000,
            maxfiles: 3
        }),
    ]
});
module.exports = logger;