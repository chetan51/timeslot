/*
 * Class Item
 * 
 * Constructor options:
 *     ID
 *     duration   (optional)
 *     name       (optional)
 *     start_time_restriction_type (optional)
 *     start_time_restriction_time (optional)
 *     end_time_restriction_type   (optional)
 *     end_time_restriction_time   (optional)
 *     wasEditedCallback           (optional)
 *     addWasClickedCallback       (optional)
 *     deleteWasClickedCallback    (optional)
 */

var Item = Class.extend(
{
	init: function(options, element)
	{
		this.options = $.extend({}, options);
		this.element = $(element);
		this._load();
		this._display();
	},
	 
	_load: function()
	{
		// Parse time restriction options
		this.options.times = {
			start: {
				restriction: {
					time: null,
    					type: null
				},
    				time: null
			},
			end: {
				restriction: {
					time: null,
    					type: null
				},
    				time: null
			}
		}
		
		if (this.options.start_time_restriction_time) {
			this.options.times.start.restriction.time = new Time({timeString: this.options.start_time_restriction_time});
		}
		if (this.options.end_time_restriction_time) {
			this.options.times.end.restriction.time = new Time({timeString: this.options.end_time_restriction_time});
		}
		this.options.times.start.restriction.type = this.options.start_time_restriction_type;
		this.options.times.end.restriction.type = this.options.end_time_restriction_type;
	},

	_display: function()
	{
		this.refresh();
		
		// Add event handlers
		this.element.hover($.proxy(this._wasHoveredIn, this), $.proxy(this._wasHoveredOut, this));
		
		this.element.find("> .name").editable({
			onSubmit: $.proxy(this._nameWasEdited, this)
		});
		
		this.element.find("> .info > .duration > .length").editable({
			type: 'select',
			options: {
				15:'(15 m)',
				30:'(30 m)',
				45:'(45 m)',
				60:'(1 h)',
				75:'(1 h, 15 m)',
				90:'(1 h, 30 m)',
				105:'(1 h, 45 m)',
				120:'(2 h)'
			},
			onEdit: $.proxy(this._durationWasClicked, this),
			onSubmit: $.proxy(this._durationWasEdited, this)
		});
		
		this.element.find("> .info > .start-time > .restriction > .type > .fixed > input").change($.proxy(this._startTimeRestrictionTypeFixedWasEdited, this));
		this.element.find("> .info > .start-time > .restriction > .type > .range > input").change($.proxy(this._startTimeRestrictionTypeRangeWasEdited, this));
		this.element.find("> .info > .start-time > .restriction > .time").editable({
			onEdit: $.proxy(this._startTimeRestrictionTimeWasClicked, this),
			onSubmit: $.proxy(this._startTimeRestrictionTimeWasEdited, this)
		});
		
		this.element.find("> .info > .end-time > .restriction > .type > .range > input").change($.proxy(this._endTimeRestrictionTypeRangeWasEdited, this));
		this.element.find("> .info > .end-time > .restriction > .time").editable({
			onEdit: $.proxy(this._endTimeRestrictionTimeWasClicked, this),
			onSubmit: $.proxy(this._endTimeRestrictionTimeWasEdited, this)
		});
		
		this.element.find("> .controls > .add").click($.proxy(this._addWasClicked, this));
		this.element.find("> .controls > .delete").click($.proxy(this._deleteWasClicked, this));
	},
	
	_updateTimeRestriction: function(restriction_type, restriction_time, restriction_div)
	{
		var fixed_input = restriction_div.find("> .type > .fixed > input");
		var range_input = restriction_div.find("> .type > .range > input");
		if (restriction_type) {
			if (restriction_type == "fixed") {
				fixed_input.attr("checked", true);
				range_input.attr("checked", false);
			}
			else if (restriction_type == "range") {
				fixed_input.attr("checked", false);
				range_input.attr("checked", true);
			}
		}
		else {
			fixed_input.attr("checked", false);
			range_input.attr("checked", false);
		}
		
		if (restriction_time && restriction_type) {
			restriction_div.find("> .time").html(restriction_time.format());
		}
		else {
			restriction_div.find("> .time").html("whenever");
		}
	},

	refresh: function()
	{
		if (this.options.conflict) {
			this.element.addClass("conflict");
			this.options.times.start.time = null;
			this.options.times.end.time = null;
		}
		else {
			this.element.removeClass("conflict");
		}
		
		this.element.find("> .name").html(this.options.name);
		
		this.element.find("> .info > .duration > .length").html(durationToText(this.options.duration));
		
		var start_time_div = this.element.find("> .info > .start-time > .time");
		if (this.options.times.start.time) {
			start_time_div.html(this.options.times.start.time.format());
		}
		else {
			start_time_div.html("");
		}
		var end_time_div = this.element.find("> .info > .end-time > .time");
		if (this.options.times.end.time) {
			end_time_div.html(this.options.times.end.time.format());
		}
		else {
			end_time_div.html("");
		}
		
		var height = 60 + (this.options.duration / 15) * 5;
		this.element.css("height", height + "px");
		
		this._updateTimeRestriction(
				this.options.times.start.restriction.type,
				this.options.times.start.restriction.time,
				this.element.find("> .info > .start-time > .restriction")
		);
		this._updateTimeRestriction(
				this.options.times.end.restriction.type,
				this.options.times.end.restriction.time,
				this.element.find("> .info > .end-time > .restriction")
		);
	},
	
	_wasHoveredIn: function()
	{
		this.element.find("> .controls").show();
		this.element.find("> .info > .duration").show();
		var time_div = this.element.find("> .info > .time");
		time_div.find("> .label").show();
		time_div.find("> .time").hide();
		time_div.find("> .restriction").show();
	},
	
	_wasHoveredOut: function()
	{
		this.element.find("> .controls").hide();
		this.element.find("> .info > .duration").hide();
		var time_div = this.element.find("> .info > .time");
		time_div.find("> .label").hide();
		time_div.find("> .time").show();
		time_div.find("> .restriction").hide();
	},
	
	_nameWasEdited: function()
	{
	},
	
	_durationWasClicked: function()
	{
		// this.element.find("> .info > .duration > select").attr('size',6);
	},
	
	_durationWasEdited: function(content)
	{
		var new_duration = durationFromText(content.current);
		
		var sanity_check = this._timeSanityCheck(this.options.times.start.restriction.time, this.options.times.end.restriction.time, new_duration);

		if (sanity_check) {
			this.options.duration = new_duration;
		}
		
		this.refresh();
		
		if (this.options.wasEditedCallback) {
			this.options.wasEditedCallback(this);
		}
	},
	
	_timeRestrictionTypeWasEdited: function(time_type, restriction_type, restriction_input, restriction_time_div)
	{
		var enabled = restriction_input.attr("checked");
		if (enabled) {
			this.options.times[time_type].restriction.type = restriction_type;
		}
		else {
			this.options.times[time_type].restriction.type = null;
			this.options.times[time_type].restriction.time = null;
		}
		
		this.refresh();
		
		if (enabled && !this.options.times[time_type].restriction.time) {
			restriction_time_div.click();
		}
		else {
			// Done editing
			if (this.options.wasEditedCallback) {
				this.options.wasEditedCallback(this);
			}
		}
	},
	
	_startTimeRestrictionTypeFixedWasEdited: function()
	{
		this._timeRestrictionTypeWasEdited(
			"start",
			"fixed",
			this.element.find("> .info > .start-time > .restriction > .type > .fixed > input"),
			this.element.find("> .info > .start-time > .restriction > .time")
		);
	},
	
	_startTimeRestrictionTypeRangeWasEdited: function()
	{
		this._timeRestrictionTypeWasEdited(
			"start",
			"range",
			this.element.find("> .info > .start-time > .restriction > .type > .range > input"),
			this.element.find("> .info > .start-time > .restriction > .time")
		);
	},
	
	_endTimeRestrictionTypeRangeWasEdited: function()
	{
		this._timeRestrictionTypeWasEdited(
			"end",
			"range",
			this.element.find("> .info > .end-time > .restriction > .type > .range > input"),
			this.element.find("> .info > .end-time > .restriction > .time")
		);
	},
	
	_timeSanityCheck: function(start_time, end_time, duration)
	{
		if (start_time && start_time.options.time &&
			end_time && end_time.options.time &&
			duration) {
			return start_time.plusMinutes(this.options.duration).options.time <= end_time.options.time;
		}
		else {
			return true;
		}
	},
	
	_timeRestrictionTimeWasEdited: function(content, time_type)
	{
		var new_time = new Time({timeString: content.current});
		
		var sanity_check = true;
		if (time_type == "start") {
			sanity_check = this._timeSanityCheck(new_time, this.options.times.end.restriction.time, this.options.duration);
		}
		else if (time_type == "end") {
			sanity_check = this._timeSanityCheck(this.options.times.start.restriction.time, new_time, this.options.duration);
		}
		else {
			sanity_check = false;
		}

		if (new_time.options.time &&
			this.options.times[time_type].restriction.type &&
			sanity_check) {
			this.options.times[time_type].restriction.time = new_time;
		}
		
		this.refresh();
		
		if (this.options.wasEditedCallback) {
			this.options.wasEditedCallback(this);
		}
	},
	
	_startTimeRestrictionTimeWasEdited: function(content)
	{
		this._timeRestrictionTimeWasEdited(content, "start");
	},
	
	_endTimeRestrictionTimeWasEdited: function(content)
	{
		this._timeRestrictionTimeWasEdited(content, "end");
	},
	
	_timeRestrictionTimeWasClicked: function(time_type, input)
	{
		var time = this.options.times[time_type].restriction.time;
		if (time) {
			input.val(time.format());
		}
		else {
			input.val("");
		}
	},
	
	_startTimeRestrictionTimeWasClicked: function()
	{
		this._timeRestrictionTimeWasClicked(
			"start",
			this.element.find("> .info > .start-time > .restriction > .time > input")
		);
	},
	
	_endTimeRestrictionTimeWasClicked: function()
	{
		this._timeRestrictionTimeWasClicked(
			"end",
			this.element.find("> .info > .end-time > .restriction > .time > input")
		);
	},

	_addWasClicked: function()
	{
		if (this.options.addWasClickedCallback) {
			this.options.addWasClickedCallback(this);
		}
	},
	
	_deleteWasClicked: function()
	{
		if (this.options.deleteWasClickedCallback) {
			this.options.deleteWasClickedCallback(this);
		}
	}
});

$.plugin('item', Item);
