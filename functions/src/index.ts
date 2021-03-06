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
          const data = querySnapshot.docs.map(documentSnapshot => documentSnapshot.data()).sort((a,b) => a.release_id > b.release_id);
          return res.render('home', { episodes: data});
      })
      .catch(err => {
          return res.render('home', { episodes: []});
      });
});

app.get('/episodes/:episodeId', (req, res) => {
    const episodeId = req.params.episodeId;
    const publicToken = req.query.t;
    res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    res.redirect(
        `https://firebasestorage.googleapis.com/v0/b/devcast-7b66e.appspot.com/o/episodes%2Fdevcast-${episodeId}.mp3?alt=media&token=${publicToken}`
    );

});


export const main = functions.https.onRequest(app);