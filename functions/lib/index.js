"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
const admin = require('firebase-admin');
admin.initializeApp();
const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
// const firebaseUser = require('./firebaseUser');
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
// app.use(firebaseUser.validateFirebaseIdToken);
app.get('/', (req, res) => {
    const episodesRef = admin.firestore().collection('episodes');
    return episodesRef
        .get()
        .then(querySnapshot => {
        const data = querySnapshot.docs.map(documentSnapshot => documentSnapshot.data());
        return res.render('home', { episodes: data });
    })
        .catch(err => {
        return res.render('home', { episodes: [] });
    });
});
// This HTTPS endpoint can only be accessed by your Firebase Users.
// Requests need to be authorized by providing an `Authorization` HTTP header
// with value `Bearer <Firebase ID Token>`.
exports.main = functions.https.onRequest(app);
//# sourceMappingURL=index.js.map