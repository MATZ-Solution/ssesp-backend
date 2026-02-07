const cors = require("cors");
const helmet = require("helmet");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const contactRoutes = require('./routes/contactRoutes')
const userRoutes = require('./routes/userRoutes')
const projectRoutes = require('./routes/projectRoutes')
const formRoutes = require('./routes/formRoutes')

const rateLimiter = require("./middleware/rateLimiter");
const adminRoutes = require('./routes/adminRoutes');
const { getConnectionFromPool } = require("./config/connection");
require("dotenv").config();

const app = express();

app.use(cors({
  origin: [
    "https://ssesp.matzsolutions.com/",
    "https://www.ssesp.matzsolutions.com/",
    "http://localhost:5173"
  ], credentials: true,
}));

app.use(helmet());
app.use(rateLimiter(15 * 60 * 1000, 100)); // 100 requests / 15 min per IP
app.use(bodyParser.json());
app.use(cookieParser());  


app.use((req, res, next) => {
  res.header("Cache-Control", "no-cache, no-store, must-revalidate");
  res.header("Pragma", "no-cache");
  res.header("Expires", "0");
  next();
});

// Swagger UI setup
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile)); // This comes after app is initialized

app.get("/", (req, res) => {
  res.send("Welcome SSESP! 03-10-2025 again 2");
});

getConnectionFromPool();

// Use routes after middlewares
app.use("/api/form", formRoutes);

// app.use("/api/contact", contactRoutes);
// app.use('/api/admin', adminRoutes);
// app.use("/auth", userRoutes);

// app.use("/project", projectRoutes);

// local connection
// server.listen(2300,() => {
//   console.log("Server is running on port 2300");
// });

// live connection
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});


