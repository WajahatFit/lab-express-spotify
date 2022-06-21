require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();
// app.js

// 1. require the body-parser
const bodyParser = require('body-parser');
// 2. let know your app you will be using it
app.use(bodyParser.urlencoded({ extended: true }));


app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));
// Our routes go here:

app.get('/', (req, res, next) => {
    res.render('home');
})

app.get('/artists-search', (req, res) => {
  const {artistName} = req.query;
  spotifyApi
  .searchArtists(artistName)
  .then(data => {
    const artists = data.body.artists;
    res.render("artist-search-results",artists)
    //console.log({artists})
  })
  
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistId', (req, res) => {
  const { artistId } = req.params; 
  spotifyApi
  .getArtistAlbums(artistId) 
  .then((data) => {
      res.render('albums', { albums:data.body.items })
      console.log(data)
    },
    (err) => {
      console.error(err);
      next(err)
    }
  );
});

app.get('/tracks/:albumId', (req, res) => {
  const { albumId } = req.params;
  spotifyApi.getAlbumTracks(albumId)
  .then(function(data) {
    res.render('tracks', {track: data.body.items } );
  }, function(err) {
    console.log('Something went wrong!', err);
  });
})





app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
