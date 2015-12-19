var Observable = require('FuseJS/Observable');
var Moment = require('Moment');
var ServerPath = "https://api.apple-cloudkit.com/database/1/";
var CloudIdentifier = "iCloud.kevinzhow.Producter";
var Enviroment = "development"
var DataBase = "public/records"
var DataMethod = "query"
var ckAPIToken= "84df66d97de04cd3ab8fb24d45150d7456ee65d6322c98b67d09985d3c0d9a58"

// Fetch data

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

var articleQuery = ServerPath+CloudIdentifier+"/"+Enviroment+"/"+DataBase+"/"+DataMethod+"?ckAPIToken="+ckAPIToken
// console.log(articleQuery);
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
			console.log("Add Article");
		 	articles.add(new Article(article));
	 }
}).catch(function(err) {
    // An error occured parsing Json
		console.log("Fetch Error" + err);
});

//Videos

function Video(resource) {
	this.resource = resource;
}

videos = Observable();
for (i = 0; i < 10; i++) {
	videos.add(new Video({title:"iOS With Girlfriend " + i,
	poster: 'assets/images/demo.jpg',
	created_at: (i+1) +' days ago'}));
}

title = Observable(function () {
		titleData = {name: 'iOS With Girl Friend'}
		return titleData;
});

NavigationBarIsEnabled = Observable(true);

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
		toggleNavigationBar(true)
		toggleTabBar(true)
	} else {
		ArticlePresented.value = 'Presented';

		console.log("Article " + args.data.resource.title )

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
  ss: "<h1>Hello world</h1>",
	NavigationBarIsEnabled: NavigationBarIsEnabled,
	toggleArticlePresented: toggleArticlePresented,
	title : title,
};
