const mongoose = require("mongoose");

exports.connectToDB = () => {
  const { DB_HOST, DB_PORT, DB_DATABASE, DB_USER, DB_PASSWORD } = process.env;
  // mongoose.set('debug', true);

  // 检查 DB_USER和DB_PASSWORD or process.env.NODE_ENV是否为production
  let connectionString;
  if (DB_USER && DB_PASSWORD) {
    connectionString = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_DATABASE}`;
  } else {
    connectionString = `mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;
  }

  console.log(`Connecting to ${connectionString}`);
  mongoose.set("useFindAndModify", false);
  return mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useCreateIndex: true
  });
};
