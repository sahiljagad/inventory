import express from "express";

import db from "../db/connection.js"; //connected db

import { ObjectId } from "mongodb";

const router = express.Router();

router.get("/", async (req, res) => {
  let collection = await db.collection("items");
  let results = await collection.find({}).toArray();
  res.send(results).status(200);
});

router.get("/:id", async (req, res) => {
  let collection = await db.collection("items");
  let query = { _id: new ObjectId(req.params.id) };
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

router.post("/", async (req, res) => {
  try {
    let newDocument = {
      name: req.body.name,
      quantity: req.body.quantity,
    };
    let collection = await db.collection("items");
    let result = await collection.insertOne(newDocument);
    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding item");
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        name: req.body.name,
        quantity: req.body.quantity,
      },
    };
    let collection = await db.collection("items");
    let result = collection.updateOne(query, updates);
    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating item");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };

    const collection = db.collection("items");
    let result = await collection.deleteOne(query);
    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting record");
  }
});

export default router;
