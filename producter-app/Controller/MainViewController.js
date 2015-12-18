var Observable = require('FuseJS/Observable');


function Picture(resource) {
	this.resource = resource;
	this.isSelected = Observable(false);
	this.indicateModeChange = Observable(false);
}



function pageButtonClicked(arg){
	console.log(arg)
}

pictures = Observable();
for (i = 1; i < 21; i++) {
	pictures.add(new Picture('Unsplash' + i));
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

function hello(sender,args) {
	console.log(args)
}

module.exports = {
	pictures: pictures,
	selectionMode : selectionMode,
	goToSelectionMode : goToSelectionMode,
	toggleSelect : toggleSelect,
	title : title,
	hello: hello,
	newX: 100,
	deleteSelected : deleteSelected,
	nullModeChange : nullModeChange
};
