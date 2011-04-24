var AgendaController = Backbone.Controller.extend
({
	routes: {
		"":             "loadTodaysAgenda",
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
	},
	
	loadTodaysAgenda: function()
	{
		var m_names = new Array("January", "February", "March", 
		"April", "May", "June", "July", "August", "September", 
		"October", "November", "December");

		var d = new Date();
		var curr_date = d.getDate();
		var curr_month = d.getMonth();
		var curr_year = d.getFullYear();
		var date = (m_names[curr_month] + " " + curr_date + ", " + curr_year);
		
		this.loadAgenda(date);
		this.saveLocation("agenda/" + date);
	}
});
