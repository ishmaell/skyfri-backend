const mongoose = require('mongoose');
const dbConfig = require('./db.config').dbConfig();

let count = 0;

const options = {
  autoIndex: false, // Don't build indexes
  // If not connected, return errors immediately rather than waiting for reconnect
  // all other approaches are now deprecated by MongoDB:
  useNewUrlParser: true,
  useUnifiedTopology: true

};
const connectWithRetry = () => {
  console.log('MongoDB connection with retry');
  mongoose.connect(dbConfig, options)
    .then(() => {
      console.log('MongoDB is connected')
    })
    .catch(error => {
      console.log('MongoDB connection unsuccessful, retry after 5 seconds. ', ++count);
      console.log(error);
      setTimeout(connectWithRetry, 5000)
    })
};

connectWithRetry();

exports.mongoose = mongoose;