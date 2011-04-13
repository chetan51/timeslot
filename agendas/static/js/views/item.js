window.ItemView = Backbone.View.extend
({
	tagName: "div",
	className: "item",

	initialize: function(options)
	{
		_.bindAll(this, 'render');
		
		this.model.bind('change', this.render);
	},

	render: function()
	{
		$(this.el).html(this.model.get('name'));
		return this;
	}
});


window.ItemCollectionView = Backbone.View.extend
({
	initialize: function()
	{
		_.bindAll(this, 'render');
		
		this.collection.bind('all', this.render);
	},

	render: function()
	{
	}
});
