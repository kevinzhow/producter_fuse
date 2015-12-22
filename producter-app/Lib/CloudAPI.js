var ServerPath = "https://api.apple-cloudkit.com/database/1/";
var CloudIdentifier = "iCloud.kevinzhow.Producter";
var Enviroment = "development"
var DataBase = "public/records"
var DataMethod = "query"
var ckAPIToken= "84df66d97de04cd3ab8fb24d45150d7456ee65d6322c98b67d09985d3c0d9a58"

// Fetch Article data

var articleRequest = {
  query: {
    recordType: "article",
    filterBy: [{
        comparator: "EQUALS",
        fieldName: "type",
        fieldValue:{
            value: "article"
        },
        sortBy: [{
            fieldName: "article_id",
            ascending: false
        }]
    }]
  }
}

var articleQuery = ServerPath+CloudIdentifier+"/"+Enviroment+"/"+DataBase+"/"+DataMethod+"?ckAPIToken="+ckAPIToken


var videoArticleRequest = {
  query: {
    recordType: "article",
    filterBy: [{
        comparator: "EQUALS",
        fieldName: "type",
        fieldValue:{
            value: "video"
        },
        sortBy: [{
            fieldName: "article_id",
            ascending: false
        }]
    }]
  }
}

var videoArticleQuery = ServerPath+CloudIdentifier+"/"+Enviroment+"/"+DataBase+"/"+DataMethod+"?ckAPIToken="+ckAPIToken

exports.articleRequest = articleRequest;
exports.articleQuery = articleQuery;
exports.videoArticleRequest = videoArticleRequest;
exports.videoArticleQuery = videoArticleQuery;
