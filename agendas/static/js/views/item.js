window.ItemView = Backbone.View.extend
({
	tagName: "div",
	className: "item",
	template: _.template($('#item-template').html()),
	
	events: {
		"mouseenter": "hoverIn",
		"mouseleave": "hoverOut",
		"click .controls .edit": "edit",
		"click .controls .edit-done": "editDone",
		"click .controls .delete": "delete",
	},

	initialize: function(options)
	{
		_.bindAll(this, 'render', 'hoverIn', 'hoverOut');
		
		this.model.bind('change', this.render);
	},

	render: function()
	{
		$(this.el).html(this.template(this.model.toJSON()));
		
		this.elements = {};
		$.extend(this.elements, {
			controls: this.$(".controls"),
			duration: this.$(".info .duration"),
			time: this.$(".time"),
		});
		$.extend(this.elements, {
			edit: this.elements.controls.find(".edit"),
			edit_done: this.elements.controls.find(".edit-done")
		});
		$.extend(this.elements, {
			time_label: this.elements.time.find(".label"),
			time_restriction: this.elements.time.find(".restriction"),
			display_time: this.elements.time.find(".display-time"),
		});
		
		this.elements.edit_done.hide();
		
		return this;
	},

	hoverIn: function()
	{
		if (!this.options.being_edited) {
			this.elements.controls.show();
			this.elements.duration.show();
		}
	},
	
	hoverOut: function()
	{
		if (!this.options.being_edited) {
			this.elements.controls.hide();
			this.elements.duration.hide();
		}
	},

	edit: function()
	{
		this.options.being_edited = true;
		this.elements.controls.show();
		this.elements.edit.hide();
		this.elements.edit_done.show();
		
		this.elements.duration.show();
		
		this.elements.time_label.show();
		this.elements.display_time.show();
		this.elements.time_restriction.show();
	},

	editDone: function()
	{
		this.options.being_edited = false;
		this.elements.edit.show();
		this.elements.edit_done.hide();
		
		this.elements.time_label.hide();
		this.elements.display_time.hide();
		this.elements.time_restriction.hide();
		
		$(this.el).find("input").blur();
	},

	delete: function()
	{
		this.model.destroy();
		this.remove();
	}
});
