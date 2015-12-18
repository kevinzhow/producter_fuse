var Observable = require('FuseJS/Observable');

// Fetch data

// var Observable = require("FuseJS/Observable");
//
// var data = Observable();
//
// fetch('https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&q=http://www.digg.com/rss/index.xml')
// .then(function(response) { return response.json(); })
// .then(function(responseObject) { data.value = responseObject; });
//
// module.exports = {
// 	dataSource: data
// };
//

// Articles

function Article(resource) {
	this.resource = resource;
	this.isSelected = Observable(false);
	this.indicateModeChange = Observable(false);
}

articles = Observable();
for (i = 1; i < 21; i++) {
	var article = {title:"iOS With Girlfriend " + i,
	author: "Kevin",
	short_desc: 'Learn how to adjust your layout by adding or removing a view to allow for the best use of space in your layout.',
	created_at: (i+1) +' days ago'}

	article.subtitle = article.author + " " + article.created_at
	articles.add(new Article(article));
}

//Videos

function Video(resource) {
	this.resource = resource;
	this.isSelected = Observable(false);
	this.indicateModeChange = Observable(false);
}

videos = Observable();
for (i = 0; i < 21; i++) {
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
		TabBarIsEnabled.value = enable
	} else if (TabBarIsEnabled.value) {
		TabBarIsEnabled.value = false
	} else {
		TabBarIsEnabled.value = true
	}
}

function toggleArticlePresented() {
	if (ArticlePresented.value == 'Presented') {
		ArticlePresented.value = 'Default';
		console.log("Article " + ArticlePresented.value);
		toggleNavigationBar(true)
		toggleTabBar(true)
	} else {
		ArticlePresented.value = 'Presented';
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
	NavigationBarIsEnabled: NavigationBarIsEnabled,
	toggleArticlePresented: toggleArticlePresented,
	title : title,
};
