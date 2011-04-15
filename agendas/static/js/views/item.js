window.ItemView = Backbone.View.extend
({
	tagName: "div",
	className: "item",
	template: _.template($('#item-template').html()),
	
	events: {
		"mouseenter": "hoverIn",
		"mouseleave": "hoverOut",
	},

	initialize: function(options)
	{
		_.bindAll(this, 'render', 'hoverIn', 'hoverOut');
		
		this.model.bind('change', this.render);
	},

	render: function()
	{
		$(this.el).html(this.template(this.model.toJSON()));
		return this;
	},

	hoverIn: function()
	{
		if (!this.options.being_edited) {
			this.$(".controls").show();
			this.$(".duration").show();
		}
	},
	
	hoverOut: function()
	{
		if (!this.options.being_edited) {
			this.$(".controls").hide();
			this.$(".duration").hide();
		}
	}
});


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
