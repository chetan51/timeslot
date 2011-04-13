window.Agenda = Backbone.Model.extend
({
	defaults: {
		'start_time': new Time({timeString: "7:00 pm"})
	},

	initialize: function()
	{
		this.items = new ItemCollection(null, {start_time: this.get('start_time')});
	}
});
