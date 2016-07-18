var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// MONGOOSE
var MongoStore = require('connect-mongo/es5')(session);
var mongoose = require('mongoose');

// MODELS
var models = require('./backend/models');
var Pokemon = models.Pokemon;
var PokemonList = models.PokemonList;

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

app.get('/pokemons', function(req, res, next) {
  Pokemon.find(function(err, pokemons) {
    if (err) return next(err);
    console.log(pokemons[0].rarity)
  });
});

app.get('/pokemon', function(req, res, next) {
  Pokemon.find(function(err, pokemons) {
    if (err) return next(err);
    for (var i = 1; i < pokemons.length + 1; i ++) {
      var rarity = '';
      if(i === 10 ||
         i === 13 ||
         i === 16 ||
         i === 19 ||
         i === 21 ||
         i === 41 ||
         i === 54 ||
         i === 60 ||
         i === 79 ||
         i === 84 ||
         i === 90 ||
         i === 98 ||
         i === 118 ||
         i === 120 ||
         i === 129) {
        rarity = "common";
      }

      if(i === 1 ||
         i === 4 ||
         i === 7 ||
         i === 11 ||
         i === 14 ||
         i === 17 ||
         i === 20 ||
         i === 22 ||
         i === 23 ||
         i === 27 ||
         i === 29 ||
         i === 32 ||
         i === 35 ||
         i === 39 ||
         i === 42 ||
         i === 43 ||
         i === 46 ||
         i === 48 ||
         i === 50 ||
         i === 52 ||
         i === 55 ||
         i === 56 ||
         i === 61 ||
         i === 63 ||
         i === 66 ||
         i === 69 ||
         i === 72 ||
         i === 74 ||
         i === 77 ||
         i === 80 ||
         i === 81 ||
         i === 85 ||
         i === 86 ||
         i === 88 ||
         i === 91 ||
         i === 92 ||
         i === 96 ||
         i === 99 ||
         i === 100 ||
         i === 102 ||
         i === 104 ||
         i === 109 ||
         i === 111 ||
         i === 114 ||
         i === 116 ||
         i === 119 ||
         i === 121 ||
         i === 127 ||
         i === 128 ||
         i === 133 ||
         i === 138 ||
         i === 140 ||
         i === 147) {
        rarity = "uncommon"
      }

      if(i === 2 ||
         i === 5 ||
         i === 8 ||
         i === 12 ||
         i === 15 ||
         i === 18 ||
         i === 24 ||
         i === 25 ||
         i === 28 ||
         i === 30 ||
         i === 33 ||
         i === 36 ||
         i === 37 ||
         i === 40 ||
         i === 44 ||
         i === 47 ||
         i === 49 ||
         i === 51 ||
         i === 53 ||
         i === 57 ||
         i === 58 ||
         i === 62 ||
         i === 64 ||
         i === 67 ||
         i === 70 ||
         i === 73 ||
         i === 75 ||
         i === 78 ||
         i === 82 ||
         i === 87 ||
         i === 89 ||
         i === 93 ||
         i === 95 ||
         i === 97 ||
         i === 101 ||
         i === 103 ||
         i === 105 ||
         i === 106 ||
         i === 107 ||
         i === 108 ||
         i === 110 ||
         i === 112 ||
         i === 113 ||
         i === 117 ||
         i === 123 ||
         i === 124 ||
         i === 125 ||
         i === 126 ||
         i === 130 ||
         i === 134 ||
         i === 135 ||
         i === 136 ||
         i === 137 ||
         i === 139 ||
         i === 141 ||
         i === 143 ||
         i === 148) {
        rarity = "rare"
      }

      if(i === 3 ||
         i === 6 ||
         i === 9 ||
         i === 26 ||
         i === 31 ||
         i === 34 ||
         i === 38 ||
         i === 45 ||
         i === 59 ||
         i === 65 ||
         i === 68 ||
         i === 71 ||
         i === 76 ||
         i === 83 ||
         i === 94 ||
         i === 115 ||
         i === 122 ||
         i === 131 ||
         i === 142 ||
         i === 149) {
        rarity = "super rare"
      }

      if(i === 132 ||
         i === 144 ||
         i === 145 ||
         i === 146 ||
         i === 150 ||
         i === 151) {
        rarity = "event only"
      }
      var p = new PokemonList({
        name: pokemons[i-1].name,
        number: pokemons[i-1].number,
        types: pokemons[i-1].types,
        rarity: rarity
      });
      p.save(function(err, pokemon) {
        if (err) return next(err);
      });
      res.redirect('/')
      // pokemons[i-1].save(function(err, pokemon) {
      //   if (err) return next(err);
      //   res.json(pokemons)
      // });
    }
    // res.json(pokemon);
  })
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
