const SchemaValidator = require("./schema_validator");
const JSONFileWriter = require('./json_writer');
const Aggregator = require("./aggregator");
const log = require('./logging');

const fs = require('fs');
const csv = require('fast-csv');

log.info('Running ...');
const fileReadStream = fs.createReadStream('./scooter_1337.csv', 'utf8');
const csvParser = csv({headers: true, trim: true});

fileReadStream.pipe(csvParser)
  .pipe(new SchemaValidator())
  .pipe(new Aggregator())
  .pipe(new JSONFileWriter({prefix: 'output_'}));
