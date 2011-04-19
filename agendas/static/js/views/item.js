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

	selectors: {
		controls: ".controls",
		duration: ".info .duration",
		time: ".time",
		name: ".name",

		edit: ".controls .edit",
		edit_done: ".controls .edit-done",
		
		time_label: ".time .label",
		time_restriction: ".time .restriction",
		display_time: ".time .display-time",
	},
	
	element: function(selector)
	{
		return this.$(this.selectors[selector]);
	},

	initialize: function(options)
	{
		_.bindAll(this, 'render', 'hoverIn', 'hoverOut');
		
		this.model.bind('change', this.render);
	},

	render: function()
	{
		$(this.el).html(this.template(this.model.toJSON()));
		$(this.el).data('model', this.model);
		
		this.element('edit_done').hide();
		
		this.makeInteractive();
		
		return this;
	},
	
	makeInteractive: function()
	{
		var self = this;
		
		this.element('name').editable({
			onSubmit: function(content) {
				self.model.save({name: content.current});
			}
		});
	},

	hoverIn: function()
	{
		if (!this.options.being_edited) {
			this.element('controls').show();
			this.element('duration').show();
		}
	},
	
	hoverOut: function()
	{
		if (!this.options.being_edited) {
			this.element('controls').hide();
			this.element('duration').hide();
		}
	},

	edit: function()
	{
		this.options.being_edited = true;
		this.element('controls').show();
		this.element('edit').hide();
		this.element('edit_done').show();
		
		this.element('duration').show();
		
		this.element('time_label').show();
		this.element('display_time').show();
		this.element('time_restriction').show();
	},

	editDone: function()
	{
		this.options.being_edited = false;
		this.element('edit').show();
		this.element('edit_done').hide();
		
		this.element('time_label').hide();
		this.element('display_time').hide();
		this.element('time_restriction').hide();
		
		$(this.el).find("input").blur();
	},

	delete: function()
	{
		this.model.destroy();
		this.remove();
	}
});
