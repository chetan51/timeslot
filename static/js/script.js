$(function(){
	window.agenda = new Agenda();
	window.agendaView = new AgendaView({
		model: agenda
	});
	window.agendaController = new AgendaController({agenda: agenda});
	
	Backbone.history.start();
});