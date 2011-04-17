window.ItemCollection = Backbone.Collection.extend
({
	model: Item,
	url: "/items",
	localStorage: new Store("items"),

	initialize: function(models, options)
	{
		this.options = {};
		this.options.start_time = options.start_time;
	},
});
