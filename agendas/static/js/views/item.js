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
		duration_length: ".info .duration .length",
		time: ".time",
		name: ".name",

		edit: ".controls .edit",
		edit_done: ".controls .edit-done",
		
		time_label: ".time .label",
		time_restriction: ".time .restriction",
		display_time: ".time .display-time",
		
		start_display_time: ".start-time .display-time",
		end_display_time: ".end-time .display-time",
	},
	
	element: function(selector)
	{
		return this.$(this.selectors[selector]);
	},

	initialize: function(options)
	{
		this.model.view = this;
		
		_.bindAll(this, 'render', 'refresh', 'hoverIn', 'hoverOut');
		
		this.model.bind('change', this.refresh);
	},

	render: function()
	{
		$(this.el).html(this.template(this.model.toJSON()));
		$(this.el).data('view', this);
		
		this.element('edit_done').hide();
		
		this.makeInteractive();
		
		return this;
	},
	
	refresh: function()
	{
		this.element('name').html(this.model.get('name'));
		
		this.element('start_display_time').html(this.options.start_time);
		this.element('end_display_time').html(this.options.end_time);
	},
	
	makeInteractive: function()
	{
		this.element('name').editable({
			onSubmit: _.bind(function(content) {
				this.model.save({name: content.current});
			}, this)
		});
		
		this.element('duration_length').editable({
			type: 'select',
			options: {
				15:'(15 m)',
				30:'(30 m)',
				45:'(45 m)',
				60:'(1 h)',
				75:'(1 h, 15 m)',
				90:'(1 h, 30 m)',
				105:'(1 h, 45 m)',
				120:'(2 h)',
				135:'(2 h, 15 m)',
				150:'(2 h, 30 m)',
				165:'(2 h, 45 m)',
				180:'(3 h)',
				195:'(3 h, 15 m)',
				210:'(3 h, 30 m)',
				225:'(3 h, 45 m)',
				240:'(4 h)',
				255:'(4 h, 15 m)',
				270:'(4 h, 30 m)',
				285:'(4 h, 45 m)',
				300:'(5 h)'
			},
			onSubmit: _.bind(function(content) {
				this.model.save({duration: durationFromText(content.current)});    
			},this)
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
		this.element('display_time').hide();
		this.element('time_restriction').show();
	},

	editDone: function()
	{
		this.options.being_edited = false;
		this.element('edit').show();
		this.element('edit_done').hide();
		
		this.element('time_label').hide();
		this.element('display_time').show();
		this.element('time_restriction').hide();
		
		$(this.el).find("input").blur();
	},

	delete: function()
	{
		this.model.destroy();
	}
});
