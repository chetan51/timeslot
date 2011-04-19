window.Agenda = Backbone.Model.extend
({
	defaults: {
		start_time: "7:00 am"
	},

	initialize: function()
	{
		var url = "/agenda/" + this.get('date');
		this.setUrl(url);
		this.id = this.cid;

		this.items = new ItemCollection;
		this.items.setUrl(url + "/items");
	},
	
	setUrl: function(url) {
		this.localStorage = new Store(url);
	},
});
