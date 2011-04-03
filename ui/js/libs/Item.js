/*
 * Class Item
 * 
 * Constructor options:
 *     ID
 *     parentChunk
 *     duration (optional)
 *     name     (optional)
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
	 
	ID: function()
	{
		return this.options.ID;
	},
    
	_load: function()
	{
		// Convert fixed option to boolean
		this.options.fixed = this.options.fixed == "true" ? true : false;
		// Convert time option to Date object
		if (this.options.time) {
			this.options.time = timeFromText(this.options.time);
		}
	},

	_display: function()
	{
		this.refresh();
		
		// Add event handlers
		this.element.hover($.proxy(this._wasHoveredIn, this), $.proxy(this._wasHoveredOut, this));
		this.element.find(".info > .duration").editable({
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
		this.element.find("> .info > .fixed > .control > input").change($.proxy(this._fixedWasEdited, this));
		this.element.find("> .name").editable({
			onSubmit: $.proxy(this._nameWasEdited, this)
		});
	},

	refresh: function()
	{
		this.element.find("> .info > .duration").html(durationToText(this.options.duration));
		if (this.options.time) {
			this.element.find("> .info > .time").html(timeToText(this.options.time));
		}
		if (this.options.fixed) {
			this.element.find("> .info > .fixed > .control").hide();
			this.element.find("> .info > .fixed").show();
		}
		else {
			this.element.find("> .info > .fixed").hide();
		}
		this.element.children(".name").html(this.options.name);
	},
	
	_wasHoveredIn: function()
	{
		this.element.children(".controls").show();
		if (!this.options.fixed) {
			this.element.find("> .info > .fixed").show();
		}
		else {
			this.element.find("> .info > .fixed > .control").show();
		}
	},
	
	_wasHoveredOut: function()
	{
		this.element.children(".controls").hide();
		if (!this.options.fixed) {
			this.element.find("> .info > .fixed").hide();
		}
		else {
			this.element.find("> .info > .fixed > .control").hide();
		}
	},
	
	_durationWasClicked: function()
	{
		// this.element.find("> .info > .duration > select").attr('size',6);
	},
	
	_durationWasEdited: function(content)
	{
		this.options.duration = durationFromText(content.current);
		this.refresh();
		this.options.parentChunk.refresh();
	},
	
	_fixedWasEdited: function()
	{
		this.options.fixed = this.element.find("> .info > .fixed > .control > input").is(":checked");
		this.refresh();
		this.options.parentChunk.refresh();
		this._wasHoveredIn();
	},

	_nameWasEdited: function()
	{
	},

	setTime: function(time)
	{
		this.options.time = time;
	}
});

$.plugin('item', Item);
