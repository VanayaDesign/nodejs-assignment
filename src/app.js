const SchemaValidator = require("./schema_validator");
const JSONFileWriter = require('./json_writer');
const Aggregator = require("./aggregator");
const log = require('./logging');
const Requester = require("./requester")
const fs = require('fs');
const csv = require('fast-csv');
(async function(){
  const config = {
      api_host: "https://s3.eu-north-1.amazonaws.com/",
      content_type: "application/json"
  }
  const requester = new Requester(config)
  const resp1 = await requester.get_csv()
  const resp2 = await requester.get_rate_per_minute()
  // console.log("RESP 1 === ",resp1)
  // console.log("RESP 2 === ",resp2)

})()
log.info('Running ...');
const fileReadStream = fs.createReadStream('./scooter_1337.csv', 'utf8');
const csvParser = csv({headers: true, trim: true});

fileReadStream.pipe(csvParser)
  .pipe(new SchemaValidator())
  .pipe(new Aggregator())
  .pipe(new JSONFileWriter({prefix: 'output_'}));
