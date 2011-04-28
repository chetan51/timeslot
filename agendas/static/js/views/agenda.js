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
		_.bindAll(this, 'addItem', 'refresh');
		
		this.items = new ItemCollectionView({
			el: this.$(".items"),
			collection: this.model.items,
			start_time: this.model.get('start_time'),
		});
		
		this.model.bind('change', _.bind(function() {
			this.refresh();
			this.items.options.start_time = this.model.get('start_time');
			this.items.refresh();
		}, this));
		
		this.render();
	},
	
	render: function()
	{
		this.makeInteractive();
		this.refresh();
	},

	addItem: function()
	{
		this.model.items.create();
	},

	refresh: function()
	{
		var m_names = new Array("January", "February", "March", 
		"April", "May", "June", "July", "August", "September", 
		"October", "November", "December");

		var m = /(\d+)-(\d+)-(\d+)/.exec(this.model.get('date'));
		var curr_date = m[3];
		var curr_month = parseInt(m[2]) - 1;
		var curr_year = m[1];
		var date = (m_names[curr_month] + " " + curr_date + ", " + curr_year);
		
		this.element('date').html(date);
		this.element('start_time').html(new Time({timeString: this.model.get('start_time')}).format());
	},
	
	makeInteractive: function()
	{
		this.element('start_time').editable({
			onSubmit: _.bind(function(content) {
				var new_time = new Time({timeString: content.current});
				if (new_time.isValid()) {
					this.model.save({start_time: new_time.format24Hour()});
				}
			}, this)
		});
		
		this.element('date').editable({
			alsoSubmitBy: null,
			onEdit: _.bind(function() {
				var input = this.element('date').find("input");
				input.datepicker({
					dateFormat: "MM d, yy",
					onClose: _.bind(function(dateText, inst) {
						var date = this.element('date');
						var editable_options = date.data('editable.options');
						editable_options.toNonEditable(date, true);
					}, this)
				});
				input.datepicker("show");
			}, this),
			onSubmit: _.bind(function(content) {
				var d = new Date(content.current);
				var curr_day = d.getDate();
				var curr_month = d.getMonth() + 1;
				var curr_year = d.getFullYear();
				var date = curr_year + "-" + curr_month + "-" + curr_day;
				window.location.hash = "day/" + date;
			}, this)
		});
	},
});
