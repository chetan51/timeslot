$(function(){
	$("#content > .agenda").agenda({
		molds: {
			item: $("#molds > .item"),
			chunk: $("#molds > .chunk")
		}
	});
});