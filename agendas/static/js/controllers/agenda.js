var AgendaController = Backbone.Controller.extend
({
	routes: {
		"agenda/:date": "loadAgenda" // #agenda/April 23, 2011
	},

	initialize: function(options)
	{
		this.agenda = options.agenda;
		
		_.bindAll(this, 'loadAgenda');
	},

	loadAgenda: function(date)
	{
		this.agenda.set({date: date});
		this.agenda.setUrl(date);
		this.agenda.fetch();
		this.agenda.items.fetch();
	}
});
