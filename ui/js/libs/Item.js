/*
 * Class Item
 * 
 * Constructor options:
 *     ID
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
	},

	_display: function()
	{
		this.refresh();
		
		// Add event handlers
		this.element.hover($.proxy(this._wasHoveredIn, this), $.proxy(this._wasHoveredOut, this));
		this.element.find(".info > .duration").click($.proxy(this._durationWasClicked, this));
		this.element.children(".name").click($.proxy(this._nameWasClicked, this));
	},

	refresh: function()
	{
		this.element.find(".info > .duration").html(durationToText(this.options.duration));
		if (this.options.time) {
			this.element.find(".info > .time").html(timeToText(this.options.time));
		}
		this.element.children(".name").html(this.options.name);
	},
	
	_wasHoveredIn: function()
	{
		this.element.children(".controls").show();
	},
	
	_wasHoveredOut: function()
	{
		this.element.children(".controls").hide();
	},
	
	_durationWasClicked: function()
	{
		alert("duration was clicked");
	},

	_nameWasClicked: function()
	{
		alert("name was clicked");
	},

	setTime: function(time)
	{
		this.options.time = time;
	}
});

$.plugin('item', Item);
