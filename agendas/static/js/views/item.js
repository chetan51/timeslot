window.ItemView = Backbone.View.extend
({
	tagName: "div",
	className: "item",
	template: _.template($('#item-template').html()),
	
	events: {
		"mouseenter": "hoverIn",
		"mouseleave": "hoverOut",

		"click .controls .delete": "destroy",
	},

	selectors: {
		controls: ".controls",
		duration: ".info .duration",
		duration_length: ".info .duration .length",
		time: ".time",
		body: ".body",
		name: ".name",

		time_label: ".time .label",
		time_restriction: ".time .restriction",
		display_time: ".time .display-time",
		
		start_time: ".start-time",
		start_time_label: ".start-time .label",
		end_time: ".end-time",
		end_time_label: ".end-time .label",
		
		start_display_time: ".start-time .display-time",
		end_display_time: ".end-time .display-time",
		
		start_restriction: ".start-time .restriction",
		start_restriction_fixed: ".start-time .restriction .fixed input",
		start_restriction_range: ".start-time .restriction .range input",
		start_restriction_time: ".start-time .restriction .restriction-time",
		end_restriction: ".end-time .restriction",
		end_restriction_range: ".end-time .restriction .range input",
		end_restriction_time: ".end-time .restriction .restriction-time",
	},
	
	element: function(selector)
	{
		return this.$(this.selectors[selector]);
	},

	initialize: function(options)
	{
		this.model.view = this;
		
		_.bindAll(this, 'render', 'refresh', 'hoverIn', 'hoverOut', 'destroy');
		
		this.model.bind('change', this.refresh);
	},

	render: function()
	{
		$(this.el).html(this.template(this.model.toJSON()));
		$(this.el).data('view', this);
		
		this.refresh();
		this.makeInteractive();
		return this;
	},
	
	refresh: function()
	{
		if (!this.element('name').data('editable.editing')) {
			this.element('name').html(this.model.get('name'));
		}
		
		if (this.options.conflict) {
			$(this.el).addClass("conflict");
			this.options.start_time = null;
			this.options.end_time = null;
		}
		else {
			$(this.el).removeClass("conflict");
		}
		
		this.element('start_display_time').html(new Time({timeString: this.options.start_time, military: true}).format());
		this.element('end_display_time').html(new Time({timeString: this.options.end_time, military: true}).format());
		
		this.refreshTimeRestrictions("start");
		this.refreshTimeRestrictions("end");
		
		var height = 75 + (this.model.get('duration') / 15) * 5;
		$(this.el).css("height", height + "px");
		
		if (this.model.get('start_restriction_type') == "fixed" &&
			new Time({timeString: this.model.get('start_restriction_time'), military: true}).isValid()) {
			$(this.el).addClass("fixed");
		}
		else {
			$(this.el).removeClass("fixed");
		}
	},
	
	refreshTimeRestrictions: function(type)
	{
		var restriction_type = this.model.get(type + '_restriction_type');
		var restriction_time = this.model.get(type + '_restriction_time');
		
		var restriction_fixed_element = this.element(type + '_restriction_fixed');
		var restriction_range_element = this.element(type + '_restriction_range');
		var restriction_time_element = this.element(type + '_restriction_time');
		
		if (restriction_type && restriction_time) {
			if (restriction_type == "fixed") {
				restriction_fixed_element.attr("checked", true);
				restriction_range_element.attr("checked", false);
			}
			else if (restriction_type == "range") {
				restriction_fixed_element.attr("checked", false);
				restriction_range_element.attr("checked", true);
			}
			
			if (!restriction_time_element.data('editable.editing')) {
				restriction_time_element.html(new Time({timeString: restriction_time, military: true}).format());
			}
		}
		else {
			if (!restriction_time_element.data('editable.editing')) {
				restriction_fixed_element.attr("checked", false);
				restriction_range_element.attr("checked", false);
			}
			
			if (!restriction_time_element.data('editable.editing')) {
				restriction_time_element.html("");
			}
		}
	},
	
	makeInteractive: function()
	{
		var self = this;
		
		this.element('name').editable({
			onSubmit: _.bind(function(content) {
				if (content.current != content.previous) {
					this.model.save({name: content.current});
				}
			}, this)
		});
		
		var duration_options = {};
		var duration;
		for (duration = 15; duration <= 1440; duration += 15) {
			var hours = Math.floor(duration / 60);
			var mins = duration % 60;
			var duration_text = "(";
			if (hours) {
				duration_text += hours + " h";
			}
			if (hours && mins) {
				duration_text += ", ";
			}
			if (mins) {
				duration_text += mins + " m";
			}
			duration_text += ")";
			
			duration_options[duration] = duration_text;
		}
		
		this.element('duration_length').editable({
			type: 'select',
			options: duration_options,
			onSubmit: _.bind(function(content) {
				if (content.current != content.previous) {
					this.model.save({duration: durationFromText(content.current)});    
				}
			},this)
		});
		
		this.makeInteractiveRestrictionTime("start");
		this.makeInteractiveRestrictionType("start", "fixed");
		this.makeInteractiveRestrictionType("start", "range");
		
		this.makeInteractiveRestrictionTime("end");
		this.makeInteractiveRestrictionType("end", "range");
		
		this.makeInteractiveDisplayTime("start");
		this.makeInteractiveDisplayTime("end");
	},
	
	makeInteractiveRestrictionTime: function(time_type)
	{
		this.element(time_type + '_restriction_time').editable({
			onEdit: _.bind(function() {
				if (!this.model.get(time_type + '_restriction_time')) {
					this.element(time_type + '_restriction_time').find("input").val("");
				}
			}, this),
			onSubmit: _.bind(function(content) {
				var time_attribute = {};
				var time = new Time({timeString: content.current});
				if (time.isValid()) {
					time_attribute[time_type + '_restriction_time'] = time.format24Hour();
				
					if (!this.model.get(time_type + '_restriction_type')) {
						var type_attribute = {};
						type_attribute[time_type + '_restriction_type'] = "fixed";
						this.model.save(type_attribute);
					}
				}
				else {
					time_attribute[time_type + '_restriction_time'] = null;
				}
				this.model.save(time_attribute);
				
				this.refresh();
			}, this)
		});
	},
	
	makeInteractiveRestrictionType: function(time_type, restriction_type)
	{
		var self = this;
		
		this.element(time_type + '_restriction_' + restriction_type).unbind("change").change(function() {
			var type;
			if ($(this).attr("checked")) {
				type = restriction_type;
				if (!self.model.get(time_type + '_restriction_time')) {
					self.element(time_type + '_restriction_time').click();
				}
			}
			else {
				type = null;
			}
			var attribute = {};
			attribute[time_type + '_restriction_type'] = type;
			self.model.save(attribute);
			self.refresh();
		});
	},
	
	makeInteractiveDisplayTime: function(time_type)
	{
		this.element(time_type + '_time').hover(_.bind(function() {
			this.element(time_type + '_restriction').show();
			this.element(time_type + '_display_time').hide();
			this.element(time_type + '_time_label').show();
		}, this), _.bind(function() {
			if (!this.element(time_type + '_restriction_time').data('editable.editing')) {
				this.element(time_type + '_restriction').hide();
				this.element(time_type + '_display_time').show();
				this.element(time_type + '_time_label').hide();
			}
		}, this));
	},

	hoverIn: function()
	{
		this.element('controls').show();
		this.element('duration').show();
	},
	
	hoverOut: function()
	{
		this.element('controls').hide();
		this.element('duration').hide();
	},

	editName: function()
	{
		this.element('name').click();
	},

	destroy: function()
	{
		this.model.destroy();
	}
});
