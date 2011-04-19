window.AgendaView = Backbone.View.extend
({
	el: $("#agenda"),

	events: {
		"click .add-item": "addItem"
	},

	selectors: {
		date: ".date",
		start_time: ".start-time .time",
	},
	
	element: function(selector)
	{
		return this.$(this.selectors[selector]);
	},
	
	initialize: function()
	{
		_.bindAll(this, 'addItem', 'render');
		
		this.items = new ItemCollectionView({
			el: this.$(".items"),
			collection: this.model.items
		});
		
		this.model.bind('change', _.bind(function() {
			this.render();
			this.items.refresh();
		}, this));
		
		this.render();
		this.makeInteractive();
	},

	addItem: function()
	{
		this.model.items.create();
	},

	render: function()
	{
		this.element('date').html(this.model.get('date'));
		this.element('start_time').html(this.model.get('start_time'));
	},
	
	makeInteractive: function()
	{
		var self = this;

		this.element('start_time').editable({
			onSubmit: function(content) {
				var new_time = new Time({timeString: content.current});
				if (new_time.isValid()) {
					self.model.save({start_time: new_time.format()});
				}
			},
		});
	},
});
