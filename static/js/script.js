$(function(){
	/*
	$("#content > .agenda").agenda({
		molds: {
			item: $("#molds > .item"),
			free_time: $("#molds > .free-time")
		}
	});
	*/
	
	var agenda = new Agenda({
		date: "April 12, 2011"
	});
	var agendaView = new AgendaView({
		model: agenda
	});
	
	agenda.items.refresh([
		{name: "Running"},
		{name: "Breakfast"},
		{name: "Shower"}
	]);
});