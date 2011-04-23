window.Agenda = Backbone.Model.extend
({
	defaults: {
		start_time: "7:00 am"
	},
	
	baseUrl: "/agenda",

	initialize: function()
	{
		this.items = new ItemCollection();
		
		this.setUrl(this.get('date'));
		this.id = this.cid;
	},
	
	setUrl: function(url)
	{
		this.url = this.baseUrl + "/" + url;
		this.localStorage = new Store(this.url);
		
		this.items.setUrl(this.url + "/items");
	}
});
