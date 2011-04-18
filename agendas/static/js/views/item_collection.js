window.ItemCollectionView = Backbone.View.extend
({
	initialize: function()
	{
		_.bindAll(this, 'add', 'render', 'saveOrder');
		
		this.collection.bind('refresh', this.render);
		this.collection.bind('add', this.add);
		
		this.views = [];
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
		
		this.loadElements();
		
		this.makeInteractive();
	},
	
	loadElements: function()
	{
		this.elements = {};
		$.extend(this.elements, {
			items: this.$(".item"),
		});
	},

	makeInteractive: function()
	{
		var self = this;
		
		$(this.el).sortable({
			update: function() {
				self.loadElements();
				self.saveOrder();
				self.collection.sort({silent: true});
			},
			items: ".item"
		});
	},
	
	saveOrder: function()
	{
		this.elements.items.each(function(seq, item_div) {
			var item = $(item_div).data('model');
			item.save({seq: seq});
		});
	},
});
