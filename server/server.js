require("dotenv").config();

const app = require("./app");
const helmet = require("helmet");
const connectDB = require("./config/db");
const logger = require("./utils/logger");

const PORT = process.env.PORT || 5000;


connectDB();


app.use(helmet());


app.listen(PORT, () => {

  logger.info(`Server running on port ${PORT}`);

});