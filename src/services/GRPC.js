const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const Service = require("@Core/service");

var PROTO_PATH = __dirname + '/../protobuf/search.proto';
var packageDefinition = protoLoader.loadSync(
  PROTO_PATH,
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  }
);
var search_proto = grpc.loadPackageDefinition(packageDefinition).search;
const searchClient = new search_proto.Searcher('localhost:50051', grpc.credentials.createInsecure());

const Star_PROTO = __dirname + '/../protobuf/star.proto';
var starDefinition = protoLoader.loadSync(
  Star_PROTO,
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  }
);
const star_proto = grpc.loadPackageDefinition(starDefinition).star;
const starClient = new star_proto.Starer('localhost:50051', grpc.credentials.createInsecure());

class GRPC extends Service {
  constructor(ctx) {
    super(ctx);
  }

  async search(word, sort, page) {
    return new Promise((resolve, reject)=> {
      searchClient.Search({word, sort, page}, function(err, response) {
        if (err) {
          return reject(err);
        }

        resolve(response);
      });
    });
  }

  // 根据id数组获取doc详情列表
  async details(ids) {
    return new Promise((resolve, reject)=> {
      searchClient.Details({ids}, function(err, response){
        if (err) {
          return reject(err);
        }

        resolve(response);
      });
    });
  }

  // 根据id获取单个doc详情
  async detail(id) {
    return new Promise((resolve, reject)=> {
      searchClient.Detail({id}, function(err, reponse){
        if (err) {
          return reject(err);
        }

        resolve(reponse);
      });
    });
  }

  async star(word, type, docId) {
    type = type * 1;
    return new Promise((resolve, reject)=> {
      starClient.Star({word, type, docId}, function(err, response) {
        if (err) {
          return reject(err);
        }
        resolve(response);
      });
    })
  }
}

module.exports = GRPC;
