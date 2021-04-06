const express = require('express');
const router = express.Router();
const getCollection = require('../helpers/MongoConnection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const emailRegex = /^\S+@\S+\.\S+$/;
const passwordRegex = /(?=.*[a-z])(?=.*[0-9]).{5,}/;
const displayNameRegex= /^[A-Za-z0-9]{5,}$/

getCollection('users').then( collection => {

    router.use(async (req, res, next) => {
        if (!req.body.email || !req.body.password) return res.sendStatus(400);
        const user = await collection.findOne({ $or: [ { email: req.body.email }, { displayName: req.body.displayName } ] });
        req.user = user;
        next();
    });

    router.post('/login', async (req, res) => {
        if (!req.user) return res.status(404).json({ invalidEmail: '* Email not registered' });
        const passwordsMatch = await bcrypt.compare(req.body.password, req.user.password);
        if (!passwordsMatch) return res.status(404).json({ invalidPassword: '* Incorrect password' });

        signToken(req.user, res);
    });

    router.post('/register', async (req, res) => {
        // Meaning they altered the fronend code to pass the validation
        if (!emailRegex.test(req.body.email)
            || !passwordRegex.test(req.body.password)
            || !displayNameRegex.test(req.body.displayName)) return res.sendStatus(400);
        // If user already exists
        if (req.user) res.status(400).json({
            invalidEmail: req.user.email === req.body.email ? '* Email is already taken' : '',
            invalidDisplayName: req.user.displayName === req.body.displayName ? '* Display name is already taken' : '',
        });

        const password = await bcrypt.hash(req.body.password, 10);

        const result = await collection.insertOne({
            displayName: req.body.displayName,
            email: req.body.email,
            password,
        });
        if (!result) res.sendStatus(500);
        signToken(result.ops[0], res);
    });

}).catch(err => router.use((req, res) => res.sendStatus(500)));

function signToken(user, res) {
    delete user.password;
    jwt.sign({ user }, process.env.JWT_KEY, (err, token) => {
        if (err) return res.sendStatus(500);
        res.json({ user, token, expiresIn: '1h' });
    });
}

function verifyToken(req, res, next) {
    const bearerHeader = req.headers.authorization;
    if (!bearerHeader) return res.sendStatus(400);
    const token = bearerHeader.replace('bearer ', '');

    jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
        if (err) return res.sendStatus(400);
        req.tokenPayload = payload;
        next();
    });
}

module.exports = { router, verifyToken };
