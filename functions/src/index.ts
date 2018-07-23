import * as functions from 'firebase-functions';

const admin = require('firebase-admin');
admin.initializeApp();

const express = require('express');
const exphbs = require('express-handlebars');
const app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
  const episodesRef = admin.firestore().collection('episodes');
  
  res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
  
  return episodesRef
      .get()
      .then(querySnapshot => {
          const data = querySnapshot.docs.map(documentSnapshot => documentSnapshot.data());
          return res.render('home', { episodes: data});
      })
      .catch(err => {
          return res.render('home', { episodes: []});
      });
});

export const main = functions.https.onRequest(app);