const express = require('express');
const bcrypt = require('bcrypt');
const admin = require('firebase-admin');
const { db } = require('../services/firebase');
const { and } = require('firebase/firestore');

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || username.length < 3 || username.length > 20) {
    return res.status(400).send("Username must be between 3 and 20 characters.");
  }

  if (!password || password.length < 6 && password.length > 10) {
    return res.status(400).send("Password must be at least 6 characters long and max 10.");
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: username
    });

    await db.collection("users").doc(userRecord.uid).set({
      username,
      email,
      creationDate: admin.firestore.FieldValue.serverTimestamp(),
      password: hashedPassword
    });

    res.status(201).send("User created successfully!");
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.delete('/deleteUser', async (req, res) => {
  const { uid } = req.body;

  try {
    await admin.auth().deleteUser(uid);
    await db.collection("users").doc(uid).delete();

    res.status(200).send("User deleted successfully!");
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
