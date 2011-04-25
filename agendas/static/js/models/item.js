window.Item = Backbone.Model.extend
({
	defaults: {
		"duration": 60
	},

	initialize: function()
	{
		_.bindAll(this, 'updateUrl');
		
		this.bind('change', this.updateUrl);
		
		this.updateUrl();
	},
	
	updateUrl: function()
	{
		if (this.id) {
			this.url = "/agendas/api/item/" + this.id;
		}
	}
});
