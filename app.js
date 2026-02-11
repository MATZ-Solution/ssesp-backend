const cors = require("cors");
const helmet = require("helmet");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const contactRoutes = require('./routes/contactRoutes')
const userRoutes = require('./routes/userRoutes')
const projectRoutes = require('./routes/projectRoutes')
const applicantRoutes = require('./routes/applicantRoutes')

const rateLimiter = require("./middleware/rateLimiter");
const adminRoutes = require('./routes/adminRoutes');
const { getConnectionFromPool } = require("./config/connection");
require("dotenv").config();

const app = express();

// app.use(cors({
//   origin: [
//     "https://ssesp.matzsolutions.com/",
//     "https://www.ssesp.matzsolutions.com/",
//     "http://localhost:5173"
//   ], credentials: true,
// }));

app.use(cors());

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
  res.send("Welcome SSESP! 07-2-2025 again 5");
});

getConnectionFromPool();

// Use routes after middlewares
app.use("/api/user", userRoutes);
app.use("/api/applicant", applicantRoutes);

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


