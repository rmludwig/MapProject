/* Component Data */
/* This could come from server or local storage, or anywhere */
var initialComponents = [
        {
            id : 'Flower',
            title : 'Flower Title',
            message : 'This is the flower message detail.',
            imgSrc : 'image/flower.PNG',
            modalName : '#Flower',
            comment : ''
        },
        {
            id : 'App',
            title : 'App Title',
            message : 'This is the app message detail.',
            imgSrc : 'image/app.PNG',
            modalName : '#App',
            comment : ''
        },
        {
            id : 'BOK',
            title : 'Bok Title',
            message : 'This is the bok message detail.',
            imgSrc : 'image/bok.PNG',
            modalName : '#BOK',
            comment : ''
        }
];


/* MODEL */
var Component = function(data) {
    // Attributes OR observables
    this.id = ko.observable(data.id);
    this.title = ko.observable(data.title);
    this.imgSrc = ko.observable(data.imgSrc);
    this.message = ko.observable(data.message);
    this.modalName = ko.observable(data.modalName);
    this.comment = ko.observable(data.comment);
};


/* VIEWMODEL - aka Controller */
var ViewModel = function() {
    // Binding self to the viewmodel to make code below easier to
    // understand. This is optional, but good for keeping the 'this'
    // values sepperate.
    //
    // Keeping track of 'outer this' and 'inner this'.
    var self = this;

    // Create observable array that will be pupulated with model data
    self.componentList = ko.observableArray([]);

    // Populate the OA with cat data via loop
    initialComponents.forEach(function(item) {
        self.componentList.push( new Component(item) )
    });
};


// Pull ViewModel and Model data specifics into KO for 
// interaction. Bind my view and model.
ko.applyBindings(new ViewModel());