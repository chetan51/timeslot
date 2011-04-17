window.Item = Backbone.Model.extend
({
	defaults: {
		"duration": 60
	},
});


window.ItemCollection = Backbone.Collection.extend
({
	model: Item,
	url: "/items",

	initialize: function(models, options)
	{
		this.options = {};
		this.options.start_time = options.start_time;
	},
});
