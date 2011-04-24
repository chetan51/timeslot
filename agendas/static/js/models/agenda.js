window.Agenda = Backbone.Model.extend
({
	defaults: {
		start_time: "7:00 am"
	},
	
	url: "/agenda",

	initialize: function()
	{
		this.items = new ItemCollection();
		
		this.id = this.get('date');
	},
	
	loadStorage: function(url)
	{
		this.localStorage = new Store(url);
		this.items.loadStorage(url + "/items");
	}
});
