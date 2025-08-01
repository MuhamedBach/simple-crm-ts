import express from "express";
import cors from "cors";
import type { Customer } from "./data.js";
import { getCustomers, getCustomerById, addCustomer, updateCustomer, deleteCustomer } from "./data.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (_, res) => {
  res.json({ status: "ok" });
});

// Kundenliste holen
app.get("/api/customers", (_, res) => {
  res.json(getCustomers());
});

// Kunden nach ID holen
app.get("/api/customers/:id", (req, res) => {
  const id = Number(req.params.id);
  const customer = getCustomerById(id);
  if (customer) {
    res.json(customer);
  } else {
    res.status(404).json({ message: "Kunde nicht gefunden" });
  }
});

// Kunden anlegen
app.post("/api/customers", (req, res) => {
  const newCustomer: Customer = {
    id: Date.now(),
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    notes: req.body.notes,
  };
  addCustomer(newCustomer);
  res.status(201).json(newCustomer);
});

// Kunden aktualisieren
app.put("/api/customers/:id", (req, res) => {
  const id = Number(req.params.id);
  const updatedData = req.body;
  const existing = getCustomerById(id);
  if (existing) {
    updateCustomer(id, updatedData);
    res.json({ message: "Kunde aktualisiert" });
  } else {
    res.status(404).json({ message: "Kunde nicht gefunden" });
  }
});

// Kunden löschen
app.delete("/api/customers/:id", (req, res) => {
  const id = Number(req.params.id);
  const existing = getCustomerById(id);
  if (existing) {
    deleteCustomer(id);
    res.json({ message: "Kunde gelöscht" });
  } else {
    res.status(404).json({ message: "Kunde nicht gefunden" });
  }
});

app.listen(4000, () => console.log("Server läuft auf Port 4000"));
