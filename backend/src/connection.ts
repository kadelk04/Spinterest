import mongoose from 'mongoose';
let dbConnection: mongoose.Connection | null = null;
export const getDbConnection = (): mongoose.Connection => {
  if (dbConnection === null) {
    dbConnection = mongoose.createConnection(
      `mongodb+srv://spinterest_admin:${process.env.MONGO_DB_PASSWORD}@spinterestdb.tw3jz.mongodb.net/?retryWrites=true&w=majority&appName=SpinterestDB`,
      {}
    );
  }
  return dbConnection;
};
