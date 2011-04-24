window.ItemCollection = Backbone.Collection.extend
({
	model: Item,

	loadStorage: function(url) {
		this.localStorage = new Store(url);
	},
	
	comparator: function(item)
	{
		return item.get("seq");
	}
});
