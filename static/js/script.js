$(function(){
	$("#content > .agenda").agenda({
		molds: {
			item: $("#molds > .item"),
			free_time: $("#molds > .free-time")
		}
	});
});