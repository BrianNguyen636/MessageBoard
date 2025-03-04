import express from "express";
import cors from "cors";
import router from "./routes.js";

const port = process.env.PORT || 3000;
const app = express();

// Proper CORS configuration
const corsOptions = {
  origin: "http://localhost:5173", // onlly allow url start with this
  credentials: true, // Enable credentials (cookies, authorization headers, etc.)
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Specify the allowed methods
  preflightContinue: false,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

// Middleware to parse JSON requests
app.use(express.json());

// Connect App routes
app.use("/", router);

// Catch-all route
app.use("*", (_, res) => {
  res.redirect("/api-docs");
});

// Start the server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
