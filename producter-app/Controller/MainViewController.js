var Observable = require('FuseJS/Observable');
var videoHTMLTemplate = require("videoHTMLTemplate");
var articleHTMLTemplate = require("articleHTMLTemplate");
var storage = require('FuseJS/Storage');
var Moment = require('Moment');
var ServerPath = "https://api.apple-cloudkit.com/database/1/";
var CloudIdentifier = "iCloud.kevinzhow.Producter";
var Enviroment = "development"
var DataBase = "public/records"
var DataMethod = "query"
var ckAPIToken= "84df66d97de04cd3ab8fb24d45150d7456ee65d6322c98b67d09985d3c0d9a58"

var videoHTMLTemplateString = videoHTMLTemplate.readSync();
var articleHTMLTemplateString = articleHTMLTemplate.readSync();
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

// Articles

function Article(resource) {
	this.resource = resource;
}

articles = Observable();
ArticlePageSpinEnabled = Observable(false);

var articleQuery = ServerPath+CloudIdentifier+"/"+Enviroment+"/"+DataBase+"/"+DataMethod+"?ckAPIToken="+ckAPIToken
// console.log(articleQuery);
ArticlePageSpinEnabled.value = true;
fetch(articleQuery, {
	method: 'POST',
  headers: { "Content-type": "application/json"},
  body: JSON.stringify(articleRequest)
})
.then(function(response) {
	status = response.status;
	console.log("Fetch article records " + status);
	return response.json();
 })
.then(function(responseObject) {
	articles.clear()
	ArticlePageSpinEnabled.value = false;
	 var records = responseObject.records.reverse();
	 for (var i = 0; i < records.length; i++) {
		 var record = records[i];
		 var record_fields = records[i].fields;
		 var article = {
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
			console.log("Add Article");
		 	articles.add(new Article(article));
	 }
}).catch(function(err) {
    // An error occured parsing Json
		console.log("Fetch Error" + err);
});

// Fetch Video Article data

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
// console.log(articleQuery);
VideoPageSpinEnabled = Observable(false);
VideoPageSpinEnabled.value = true

fetch(videoArticleQuery, {
	method: 'POST',
  headers: { "Content-type": "application/json"},
  body: JSON.stringify(videoArticleRequest)
})
.then(function(response) {
	status = response.status;
	console.log("Fetch video article records " + status);
	return response.json();
 })
.then(function(responseObject) {
	  VideoPageSpinEnabled.value = false
		videos.clear()
		var records = responseObject.records;
		for (var i = 0; i < records.length; i++) {
		 var record = records[i];
		 var record_fields = records[i].fields;
		 var video = {
				title:record_fields.title.value,
				author: record_fields.author.value,
				short_desc: record_fields.description.value,
				content: record_fields.content.value,
				type: record_fields.type.value,
				poster: record_fields.posterURL.value,
				mediaURL: record_fields.mediaURL.value,
				mediaHTML: videoHTMLTemplateString.replace(/#{VideoSrc}/, record_fields.mediaURL.value),
				created_at: Moment(record.created.timestamp).fromNow()
			}
			console.log(video.mediaHTML);
			console.log("Add Video Article");
		 	videos.add(new Article(video));
	 }
}).catch(function(err) {
    // An error occured parsing Json
		console.log("Fetch Video Error" + err);
});

//Videos
videos = Observable();

presentedArticle =  Observable(new Article());

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
		if 	(presentedArticle.value.resource.type == "video") {
			console.log("Add NavigationBar Back");
			toggleNavigationBar(true)
		}
		toggleTabBar(true)
	} else {
		ArticlePresented.value = 'Presented';
		presentedArticle.value = args.data;
		console.log("Article " + args.data.resource.title )
		console.log(args.data.resource.mediaURL);
		console.log("Article " +  ArticlePresented.value);
		toggleNavigationBar(false)
		toggleTabBar(false)
	}
}

module.exports = {
	articles: articles,
	videos: videos,
	toggleNavigationBar: toggleNavigationBar,
	ArticlePresented: ArticlePresented,
	TabBarIsEnabled: TabBarIsEnabled,
	presentedArticle: presentedArticle,
  ArticlePageSpinEnabled: ArticlePageSpinEnabled,
	VideoPageSpinEnabled: VideoPageSpinEnabled,
	NavigationBarIsEnabled: NavigationBarIsEnabled,
	toggleArticlePresented: toggleArticlePresented,
	title : title,
};
