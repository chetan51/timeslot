$(function(){
	window.agenda = new Agenda({
		date: "April 14, 2011"
	});
	window.agendaView = new AgendaView({
		model: agenda
	});
	window.agendaController = new AgendaController({agenda: agenda});
	
	window.agenda.fetch();
	window.agenda.items.fetch();
	
	Backbone.history.start();
});