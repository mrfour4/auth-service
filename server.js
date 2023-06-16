require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");
const { connectRD } = require("./config/redisConn");
const PORT = process.env.PORT || 3500;

const resHandler = require("./middleware/resHandler");

require("eckey-utils");

// Connect to MongoDB
connectDB();

// Connect to Redis
connectRD();


// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors());

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

//serve static files

// routes
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));

app.use(verifyJWT);

// custom middleware response
app.use(resHandler);

app.use("/users", require("./routes/api/users"));

mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
