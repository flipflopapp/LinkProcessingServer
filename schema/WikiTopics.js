'use strict';

exports = module.exports = function(db, mongoose) {
  var wikiTopicSchema = new mongoose.Schema({
    name: { type: String, unique: true }, // contains underscores or concatenated phrases
    search: { type: String }, // each word of the phrase are separated, stopwords removed by mongodb indexing

    dbpediaUrl: { type: String, unique: true }, // dbpedia link
    wikiUrl: { type: String, unique: true },    // wikipedia link

    // disambiguation datastructure

    disamb: [
      {
          relation: {type: String},
          ontology: {type: String}
      }
    ],

    // is this topic disabled for some reason
    isActive: { type: String, default: 'no' },

    // if this topic is already created
    isCreated: { type: String, default: 'no' },

    // reference to created topic
    topic: { type: mongoose.Schema.Types.ObjectId },
    
    timeCreated: { type: Date, default: Date.now },
    lastUpdate: { type: Date, default: Date.now }
  });
  wikiTopicSchema.plugin(require('./plugins/pagedFind'));
  wikiTopicSchema.index({ name: "text", search: "text", wikiUrl: "text", dbpediaUrl: "text" });
  db.model('WikiTopic', wikiTopicSchema);
};
