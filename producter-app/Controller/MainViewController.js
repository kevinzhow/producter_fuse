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
	articles.add(new Article('Article' + i));
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
	poster: 'assets/images/demo.png',
	created_at: (i+1) +' days ago'}));
}

selectionMode = Observable(false);
numberOfSelected = Observable(0);

title = Observable(function () {
		titleData = {name: 'iOS With Girl Friend'}
		return titleData;
});

function goToSelectionMode(args) {
	if (selectionMode.value === true) return;
	selectionMode.value = true;
	args.data.indicateModeChange.value = true;
	args.data.isSelected.value = true;
	numberOfSelected.value = 1;
}

function toggleSelect(args) {
	if (selectionMode.value === false) return;
	if (args.data.isSelected.value === false) {
		numberOfSelected.value = numberOfSelected.value + 1;
	} else {
		numberOfSelected.value = numberOfSelected.value - 1;
		if (numberOfSelected.value === 0) {
			selectionMode.value = false;
		}
	}
	args.data.isSelected.value = !args.data.isSelected.value;
}

function deleteSelected(args) {
	pictures.removeWhere(function (p) {
		return p.isSelected.value === true;
	});
	numberOfSelected.value = 0;
	selectionMode.value = false;
}

function nullModeChange(args) {
	args.data.indicateModeChange.value = false;
}

module.exports = {
	articles: articles,
	videos: videos,
	selectionMode : selectionMode,
	goToSelectionMode : goToSelectionMode,
	toggleSelect : toggleSelect,
	title : title,
	deleteSelected : deleteSelected,
	nullModeChange : nullModeChange
};
