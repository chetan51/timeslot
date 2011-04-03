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
		var ID = this.element.find(".data > .ID").html();
		if (!this.options.ID) {
			this.options.ID = ID;
		}
		var duration = this.element.find(".info > .duration").html();
		if (!this.options.duration) {
			this.options.duration = duration;
		}
		var name = this.element.children(".name").html();
		if (!this.options.name) {
			this.options.name = name;
		}
	},

	_display: function()
	{
		this.element.find(".data > .ID").html(this.options.ID);
		this.element.find(".info > .duration").html(this.options.duration);
		this.element.children(".name").html(this.options.name);
		
		// Add event handlers
		this.element.hover($.proxy(this._wasHoveredIn, this), $.proxy(this._wasHoveredOut, this));
		this.element.find(".info > .duration").click($.proxy(this._durationWasClicked, this));
		this.element.children(".name").click($.proxy(this._nameWasClicked, this));
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
	}
});

$.plugin('item', Item);
