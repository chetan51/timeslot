window.ItemCollectionView = Backbone.View.extend
({
	initialize: function()
	{
		_.bindAll(this, 'add', 'render');
		
		this.collection.bind('refresh', this.render);
		this.collection.bind('add', this.add);
	},
	
	add: function(item)
	{
		this.addAfter(item);
	},
	
	addAfter: function(item, after)
	{
		var item_view = new ItemView({model: item});
		if (after) {
			$(item_view.render().el).insertAfter($(after.el));
		}
		else {
			$(this.el).append($(item_view.render().el));
		}
	},
	
	addAll: function()
	{
		this.collection.each(this.add);
	},

	render: function()
	{
		$(this.el).html('');
		this.addAll();
	}
});
