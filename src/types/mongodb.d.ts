/* eslint-disable no-underscore-dangle */
/* eslint-disable no-var */
/* eslint-disable vars-on-top */
import { MongoClient } from "mongodb";

declare global {
  var _mongoClientPromise: Promise<MongoClient>;
}
