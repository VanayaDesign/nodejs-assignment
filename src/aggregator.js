const { Transform } = require('stream')
const moment = require('moment');

class Aggregator extends Transform {
  constructor(options) {
    super(Object.assign({}, { objectMode: true }, options));
    this.aggregates = [];
  }
  
  _transform(data, encoding, done) {
    const dateFormat = 'YYYY-MM-DD HH:mm:ss';
    const start = moment(data.startTime, dateFormat);
    const end = moment(data.endTime, dateFormat);
    const minutes = moment.duration(end.diff(start)).asMinutes();
    let record = this.aggregates.find((record => record.customerId === data.customerId));
    if (record) {
      record.totalRides += 1;
      record.durationMinutes += Math.ceil(minutes);
    }
    else {
      record = {
        customerId: data.customerId,
        totalRides: 1,
        durationMinutes: Math.ceil(minutes)
      };
      this.aggregates.push(record);
    }
    done();
  }
  _flush(done) {
    this.push(this.aggregates);
    done();
  }
}

module.exports = Aggregator;
