window.FreeTimeView = Backbone.View.extend
({
	tagName: "div",
	className: "free-time",
	template: _.template($('#free-time-template').html()),

	selectors: {
		duration: ".info .duration",
		duration_length: ".info .duration .length"
	},
	
	element: function(selector)
	{
		return this.$(this.selectors[selector]);
	},

	render: function()
	{
		$(this.el).html(this.template(this.options));
		$(this.el).data('view', this);
		
		this.refresh();
		return this;
	},
	
	refresh: function()
	{
		var height = 50 + (this.options.duration / 15) * 5;
		$(this.el).css("height", height + "px");
	},
});
