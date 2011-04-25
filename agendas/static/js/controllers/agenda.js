var AgendaController = Backbone.Controller.extend
({
	routes: {
		"":          "loadTodaysAgenda",
		"day/:date": "loadAgenda" // #agenda/April 23, 2011
	},

	initialize: function(options)
	{
		_.bindAll(this, 'loadAgenda');
	},

	loadAgenda: function(date)
	{
		this.agenda = new Agenda({
			date: date
		});
		this.agendaView = new AgendaView({
			model: this.agenda
		});
		
		if (typeof(Store) != "undefined") {
			this.agenda.loadStorage(this.agenda.url + "/" + date);
		}
		this.agenda.fetch();
		this.agenda.items.fetch();
	},
	
	loadTodaysAgenda: function()
	{
		var d = new Date();
		var curr_day = d.getDate();
		var curr_month = d.getMonth() + 1;
		var curr_year = d.getFullYear();
		var date = curr_year + "-" + curr_month + "-" + curr_day;
		
		this.loadAgenda(date);
		this.saveLocation("day/" + date);
	}
});
