// server.js
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

// route imports
import adminroute from "./routes/AdminLogin.js";
import cars from "./routes/carroute.js";
import paymentsRouter from "./routes/Pay.js";
import normaluserslogin from "./routes/UserLogin.js";
import addtocart from "./routes/UsersCart.js";
import orderRoutes from "./routes/orderRoutes.js";
import getuser from "./routes/UserDetails.js";
import change from "./routes/ResetPassword.js";
import confirm from "./routes/Confirmed.js";
import deleting from "./routes/delete.js";

dotenv.config();

const app = express();

/**
 * Basic middleware
 */
app.use(express.json());

// Allow all origins (simple)
app.use(cors());
app.options("*", cors());

/**
 * Small helper to safely mount routers. If mounting a router throws
 * (for example because the router exported invalid paths), we catch and log it
 * instead of letting the entire process crash immediately.
 */
function safeUse(path, router, name = "unknown") {
  if (!router) {
    console.warn(`[safeUse] No router for '${path}' (imported as ${name}) — skipping mount.`);
    return;
  }

  try {
    app.use(path, router);
    console.log(`[safeUse] Mounted ${name} at ${path}`);
  } catch (err) {
    console.error(
      `[safeUse] Failed to mount ${name} at ${path}. This usually means the router contains an invalid route path.`,
      err && err.stack ? err.stack : err
    );
  }
}

/**
 * Mount routers with safeUse so we can surface which one fails
 */
safeUse("/api/auth", change, "ResetPassword");
safeUse("/delete", deleting, "delete");
safeUse("/api/confirm", confirm, "Confirmed");
safeUse("/me", getuser, "UserDetails");
safeUse("/api/orders", orderRoutes, "orderRoutes");
safeUse("/admin", adminroute, "AdminLogin");
safeUse("/add", cars, "carroute");
safeUse("/payments", paymentsRouter, "Pay");
safeUse("/normal", normaluserslogin, "UserLogin");
safeUse("/addtocart", addtocart, "UsersCart");

/**
 * Debug / health endpoints
 */
app.get("/health", (req, res) => {
  res.json({ ok: true, time: new Date().toISOString(), origin: req.headers.origin || null });
});

app.get("/debug-headers", (req, res) => {
  res.json({
    headers: req.headers,
    origin: req.headers.origin || null,
    method: req.method,
  });
});

/**
 * Basic error handler (will log uncaught route mount errors too)
 */
app.use((err, req, res, next) => {
  console.error("[Express error handler] ", err && (err.stack || err));
  if (err && err.message && err.message.includes("CORS")) {
    return res.status(403).json({ error: "CORS error: origin not allowed" });
  }
  res.status(500).json({ error: "Internal server error" });
});

/**
 * Uncaught exception / rejection handlers (log for debugging)
 */
process.on("uncaughtException", (err) => {
  console.error("[uncaughtException] ", err && (err.stack || err));
  // Do not exit immediately in production if you want to inspect logs;
  // however it's recommended to exit and restart for safety in many cases.
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("[unhandledRejection] promise:", promise, "reason:", reason);
});


/**
 * MongoDB connection + server start
 */
const PORT = process.env.PORT || 5000;

const connectdb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("====================================");
    console.log("database connected successfully");
    console.log("====================================");
    return conn;
  } catch (error) {
    console.error("[MongoDB] connection error:", error && (error.stack || error));
    throw error;
  }
};

connectdb()
  .then(() => {
    app.listen(PORT, () => {
      console.log("====================================");
      console.log(`server running on http://localhost:${PORT}`);
      console.log("====================================");
    });
  })
  .catch((err) => {
    console.error("[start] Failed to start server due to DB connect error:", err && (err.stack || err));
    // Optionally process.exit(1);
  });



