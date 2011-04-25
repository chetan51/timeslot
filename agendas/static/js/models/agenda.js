window.Agenda = Backbone.Model.extend
({
	defaults: {
		start_time: "7:00"
	},
	
	initialize: function()
	{
		_.bindAll(this, 'updateUrl');
		
		this.bind('change', this.updateUrl);
		
		this.items = new ItemCollection();
		this.updateUrl();
	},

	updateUrl: function()
	{
		if (this.id) {
			this.url = "/agendas/api/agenda/" + this.id;
		}
		else {
			this.url = "agendas/api/agenda/date/" + this.get('date');
		}
		this.items.url = "/agendas/api/item/date/" + this.get('date');
	},
	
	loadStorage: function(url)
	{
		this.id = this.get('date');
		this.localStorage = new Store(url);
		this.items.loadStorage(url + "/items");
	}
});
