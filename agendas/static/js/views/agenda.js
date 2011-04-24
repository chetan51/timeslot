window.AgendaView = Backbone.View.extend
({
	el: $("#agenda"),

	events: {
		"click .add-item": "addItem"
	},

	selectors: {
		date: ".date",
		start_time: ".start-time .display-time",
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
			collection: this.model.items,
			start_time: this.model.get('start_time'),
		});
		
		this.model.bind('change', _.bind(function() {
			this.render();
			this.items.options.start_time = this.model.get('start_time');
			this.items.refresh();
		}, this));
		
		this.render();
	},

	addItem: function()
	{
		this.model.items.create();
	},

	render: function()
	{
		this.element('date').html(this.model.get('date'));
		this.element('start_time').html(this.model.get('start_time'));
		
		this.makeInteractive();
	},
	
	makeInteractive: function()
	{
		this.element('start_time').editable({
			onSubmit: _.bind(function(content) {
				var new_time = new Time({timeString: content.current});
				if (new_time.isValid()) {
					this.model.save({start_time: new_time.format()});
				}
			}, this)
		});
		
		this.element('date').editable({
			submit: "Load",
			onEdit: _.bind(function() {
				var input = this.element('date').find("input");
				input.datepicker({
					dateFormat: "MM d, yy"
				});
				input.datepicker("show");
			}, this),
			onSubmit: _.bind(function(content) {
				this.model.setUrl(content.current);
				this.model.fetch();
				this.model.items.fetch();
			}, this)
		});
	},
});
