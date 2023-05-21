import Redis from "ioredis";

// 2023.01 tls対応開始
const redisConfiguration = {
  host: process.env.redis_server,
  port: 6380,
  password: process.env.redis_password,
  tle: {
    servername: process.env.redis_server,
  },
};

const redis_server = process.env.redis_server as string;
const resis_password = process.env.redis_password as string;

//const redis = new Redis(redisConfiguration);
// 2023.01 tls対応終了

const redis = new Redis(
  //  "redis://:sARf8oPnrDLn6n8c6jTOSWKSKjArPmfzTAzCaLxFSqw=@vchackathon.redis.cache.windows.net:6379"
  //"redis://:y8sdANN3Z8E9Dfk8UgqX4D6nbXr5ckDeSAzCaMjWkyw=@vc-cache.redis.cache.windows.net:6379"
  "redis://:" + resis_password + "@" + redis_server + ":6379"
  //vc-cache.redis.cache.windows.net:6380,password=y8sdANN3Z8E9Dfk8UgqX4D6nbXr5ckDeSAzCaMjWkyw=,ssl=True,abortConnect=False
);

export default redis;
