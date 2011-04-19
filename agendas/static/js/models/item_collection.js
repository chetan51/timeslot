window.ItemCollection = Backbone.Collection.extend
({
	model: Item,

	initialize: function(models, options)
	{
		this.options = {};
		this.options.start_time = options.start_time;
	},
	
	setUrl: function(url) {
		this.localStorage = new Store(url);
	},
	
	comparator: function(item)
	{
		return item.get("seq");
	},
});
