const redis = require('redis');
const Service = require("@Core/service");
const env = process.env.NODE_ENV || 'development';
const config = require(`../../config.js`)[env];

const client = redis.createClient(config.redis);

class Redis extends Service{
  constructor(ctx) {
    super(ctx);
  }

  async delete(key) {
    return new Promise((resolve, reject) => {
      client.del(key, (error) => {
        if (error) {
          return reject(error);
        }
        return resolve(true);
      })
    });
  }

  async get(key) {
    return new Promise((resolve, reject) => {
      client.get(key, (error, data) => {
        if (error) {
          return reject(error);
        }
        return resolve(data);
      });
    });
  }

  async set(key, value, time) {
    return new Promise((resolve, reject) => {
      const callback = (error) => {
        if (error) {
          return reject(error);
        }
        return resolve(true);
      };
      if (time) {
        client.set(key, value, 'EX', time,  callback);
      } else {
        client.set(key, value, callback);
      }
    });
  }
}

module.exports = Redis
