window.Item = Backbone.Model.extend
({
	//template: _.template($('#item-template').html()),
});


window.ItemCollection = Backbone.Collection.extend
({
	model: Item,

	initialize: function(models, options)
	{
		this.options = {};
		this.options.start_time = options.start_time;
	}
});
