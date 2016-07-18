var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);

var pokemonSchema = mongoose.Schema({
  name: {
  	type: String,
 	required: true
  },
  number: {
  	type: Number,
  	required: true
  },
  types: [{
  	type: String,
  	required: true
  }]
});

var pokemonListSchema = mongoose.Schema({
  name: {
    type: String,
  required: true
  },
  number: {
    type: Number,
    required: true
  },
  types: [{
    type: String,
    required: true
  }],
  rarity: {
    type: String,
    required: true
  }
});

module.exports = {
  Pokemon: mongoose.model('Pokemon', pokemonSchema),
  PokemonList: mongoose.model('PokemonList', pokemonListSchema)
};
