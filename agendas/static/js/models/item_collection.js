window.ItemCollection = Backbone.Collection.extend
({
	model: Item,

	setUrl: function(url) {
		this.localStorage = new Store(url);
	},
	
	comparator: function(item)
	{
		return item.get("seq");
	},
});
