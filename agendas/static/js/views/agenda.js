window.AgendaView = Backbone.View.extend
({
	el: $("#agenda"),

	events: {
		"click .add-item": "addItem"
	},

	initialize: function()
	{
		_.bindAll(this, 'addItem');
		
		this.items = new ItemCollectionView({
			el: this.$(".items"),
			collection: this.model.items
		})
	},

	addItem: function()
	{
		var item = new Item;
		this.items.add(item);
	}
});
