import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (_, res) => {
  res.json({ status: "ok" });
});

app.listen(4000, () => console.log("Server läuft auf Port 4000"));
