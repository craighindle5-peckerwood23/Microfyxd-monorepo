import express from "express";
import dotenv from "dotenv";
import { supabase } from "./supabase.js";

dotenv.config();
const app = express();
app.use(express.json());

// Simple test endpoint
app.get("/api/test", (req, res) => {
  res.json({ ok: true });
});

// Save ECU logs
app.post("/api/ecu", async (req, res) => {
  const { data, error } = await supabase
    .from("ecu_logs")
    .insert(req.body);

  res.json({ data, error });
});

// Save agent state
app.post("/api/state", async (req, res) => {
  const { data, error } = await supabase
    .from("agent_state")
    .insert(req.body);

  res.json({ data, error });
});

app.listen(3000, () => console.log("Backend running on 3000"));
