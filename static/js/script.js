$(function(){
	var agenda = new Agenda({
		date: "April 14, 2011"
	});
	var agendaView = new AgendaView({
		model: agenda
	});
	
	agenda.fetch();
	agenda.items.fetch();
});