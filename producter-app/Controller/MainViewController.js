var _ = require('underscore');
var Moment = require('Moment');
var FuseStore = require('FuseStore');
var CloudAPI = require('CloudAPI');
var storage = require('FuseJS/Storage');
var Observable = require('FuseJS/Observable');
var videoHTMLTemplate = require("videoHTMLTemplate");
var articleHTMLTemplate = require("articleHTMLTemplate");


FuseStore.makeSubscribe();
// Read Templates
var videoHTMLTemplateString = videoHTMLTemplate.readSync();
var articleHTMLTemplateString = articleHTMLTemplate.readSync();

// Articles
articles = Observable();
ArticlePageSpinEnabled = Observable(false);

// Create bunch of triky binding
ArticleTitle = Observable("");
ArticlePoster = Observable("");
ArticleDesc = Observable("");
ArticleCreatedAt = Observable("");
ArticleGithub = Observable("");
ArticleYouku = Observable("");
ArticleYoutube = Observable("");
ArticleBilibili = Observable("");
// console.log(articleQuery);
ArticlePageSpinEnabled.value = true;

fetch(CloudAPI.articleQuery, {
  method: 'POST',
  headers: { "Content-type": "application/json"},
  body: JSON.stringify(CloudAPI.articleRequest)
})
.then(function(response) {
  status = response.status;
  console.log("Fetch article records " + status);
  return response.json();
 })
.then(function(responseObject) {
  articles.clear()
  ArticlePageSpinEnabled.value = false;
  var records = responseObject.records;

  var tempArticles = _.map(records, function(record) {
   var record_fields = record.fields;
   var article = {
      article_id: record_fields.article_id.value,
      title:record_fields.title.value,
      author: record_fields.author.value,
      short_desc: record_fields.description.value,
      content: record_fields.content.value,
      type: record_fields.type.value,
      created_at: Moment(record.created.timestamp).fromNow()
    }
    article.subtitle = article.author + " " + article.created_at
    var htmlContent = articleHTMLTemplateString.replace(/#{content}/, article.content)
    htmlContent = htmlContent.replace(/#{title}/, article.title)
    htmlContent = htmlContent.replace(/#{author}/, article.subtitle)
    article.contentHTML = htmlContent
    return article;
  })

  tempArticles = _.sortBy(tempArticles, "article_id").reverse()
  _.each(tempArticles, function(record) {
   articles.add(record)
  })

}).catch(function(err) {
    // An error occured parsing Json
    console.log("Fetch Error" + err);
});

// Fetch Video Article data

// console.log(articleQuery);
VideoPageSpinEnabled = Observable(false);
VideoPageSpinEnabled.value = true

fetch(CloudAPI.videoArticleQuery, {
  method: 'POST',
  headers: { "Content-type": "application/json"},
  body: JSON.stringify(CloudAPI.videoArticleRequest)
})
.then(function(response) {
  status = response.status;
  console.log("Fetch video article records " + status);
  return response.json();
 })
.then(function(responseObject) {
    VideoPageSpinEnabled.value = false
    videos.clear()
    var records = responseObject.records

    var tempVideos = _.map(records, function(record) {
      var record_fields = record.fields;
      var video = {
         article_id: record_fields.article_id.value,
         title:record_fields.title.value,
         author: record_fields.author.value,
         short_desc: record_fields.description.value,
         content: record_fields.content.value,
         type: record_fields.type.value,
         poster: record_fields.posterURL.value,
         youtubeURL: record_fields.youtube_url.value,
         youkuURL: record_fields.youku_url.value,
         bilibiliURL: record_fields.bilibili_url.value,
         githubURL: record_fields.github_url.value,
         created_at: Moment(record.created.timestamp).fromNow()
       }
       return video
    })

   tempVideos = _.sortBy(tempVideos, "article_id").reverse()
   _.each(tempVideos, function(record) {
    videos.add(record)
   })
}).catch(function(err) {
    // An error occured parsing Json
    console.log("Fetch Video Error" + err);
});

//Videos
videos = Observable();

var presentedArticle =  Observable({});

presentedArticleHTML = Observable("");

title = Observable(function () {
    titleData = {name: 'iOS With Girl Friend'}
    return titleData;
});

NavigationBarIsEnabled = Observable(false);

TabBarIsEnabled = Observable(true);

ArticlePresented = Observable('Default');

function toggleNavigationBar(enable) {
  if (enable != null) {
    NavigationBarIsEnabled.value = enable
  } else if (NavigationBarIsEnabled.value) {
    NavigationBarIsEnabled.value = false
  } else {
    NavigationBarIsEnabled.value = true
  }
}

function toggleTabBar(enable) {
  if (enable != null) {
    console.log("Navigation Bar " + enable);
    TabBarIsEnabled.value = enable
  } else if (TabBarIsEnabled.value) {
    TabBarIsEnabled.value = false
  } else {
    TabBarIsEnabled.value = true
  }
}

function toggleArticlePresented(args) {
  if (ArticlePresented.value == 'Presented') {
    ArticlePresented.value = 'Default';
    console.log("Article " + ArticlePresented.value);
    if 	(presentedArticle.value.type == "video") {
      toggleNavigationBar(true)
    }
    // Adjust Bars
    toggleTabBar(true)
  } else {
    ArticlePresented.value = 'Presented';
    presentedArticle.value = args.data;
    if 	(args.data.type == "video") {
      // Prepare Data For Video
      ArticleTitle.value = args.data.title;
      ArticlePoster.value = args.data.poster;
      ArticleDesc.value = args.data.short_desc;
      ArticleCreatedAt.value = args.data.created_at;
      ArticleGithub.value = args.data.githubURL;
      ArticleYouku.value = args.data.youkuURL;
      ArticleYoutube.value = args.data.youtubeURL;
      ArticleBilibili.value = args.data.bilibiliURL;

    } else {
      presentedArticleHTML.value = args.data.contentHTML;
    }
    // Adjust Bars
    toggleNavigationBar(false)
    toggleTabBar(false)
  }
}

function makeSubscribe() {
  FuseStore.makeSubscribe();
}

module.exports = {
  title : title,
  articles: articles,
  videos: videos,
  ArticleTitle: ArticleTitle,
  ArticlePoster: ArticlePoster,
  ArticleDesc: ArticleDesc,
  ArticleCreatedAt: ArticleCreatedAt,
  ArticleGithub: ArticleGithub,
  ArticleYouku: ArticleYouku,
  ArticleYoutube: ArticleYoutube,
  ArticleBilibili: ArticleBilibili,
  ArticlePresented: ArticlePresented,
  TabBarIsEnabled: TabBarIsEnabled,
  presentedArticle: presentedArticle,
  toggleNavigationBar: toggleNavigationBar,
  ArticlePageSpinEnabled: ArticlePageSpinEnabled,
  VideoPageSpinEnabled: VideoPageSpinEnabled,
  NavigationBarIsEnabled: NavigationBarIsEnabled,
  presentedArticleHTML: presentedArticleHTML,
  makeSubscribe: makeSubscribe,
  toggleArticlePresented: toggleArticlePresented,
};
