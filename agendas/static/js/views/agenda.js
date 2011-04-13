window.AgendaView = Backbone.View.extend
({
	el: $("#agenda"),

	initialize: function()
	{
		//_.bindAll(this, 'render');
		
		this.items = new ItemCollectionView({
			el: this.$(".items"),
			collection: this.model.items
		})
	}
});
