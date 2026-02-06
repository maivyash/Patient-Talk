const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const { connectDB } = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const logoRoutes = require("./src/routes/logoRoutes");
const feedbackCreateRoutes = require("./src/routes/feedback.routes");
const feedbackGetRoutes = require("./src/routes/feedback");
const hospitalFeedbackRoutes = require("./src/routes/hospitalfeedback");
const { notFoundHandler, errorHandler } = require("./src/middleware/errorHandler");

const app = express();


app.use(
  cors({
    origin: process.env.FRONTEND_URL  ,
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));

app.get("/health", (req, res) => {
  res.json({ ok: true, service: "backend", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/logo", logoRoutes);
app.use("/api", feedbackCreateRoutes);
app.use("/api", feedbackGetRoutes);
app.use("/api", hospitalFeedbackRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error("Failed to start server:", err);
    process.exit(1);
  });

