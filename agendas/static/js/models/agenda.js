window.Agenda = Backbone.Model.extend
({
	defaults: {
		start_time: "7:00"
	},
	
	url: "/agendas/api/agenda",

	initialize: function()
	{
		_.bindAll(this, 'updateUrl');
		
		this.bind('change', this.updateUrl);
		
		this.items = new ItemCollection();
		this.url += "/date/" + this.get('date');
	},

	updateUrl: function()
	{
		if (this.id) {
			this.url = "/agendas/api/agenda/" + this.id;
		}
	},
	
	loadStorage: function(url)
	{
		this.id = this.get('date');
		this.localStorage = new Store(url);
		this.items.loadStorage(url + "/items");
	},
	
/*
	sync: function(method, model, success, error)
	{
		alert(method + " " + JSON.stringify(model));
		success = function(model) {
			alert("success" + " " + JSON.stringify(model));
		};
		error = function(model) {
			alert("error" + " " + JSON.stringify(model));
		};
		
		Backbone.sync(method, model, success, error);
	}
	*/
});
