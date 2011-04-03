/*
 * Class Chunk
 * 
 * Constructor options:
 *     ID
 *     time
 */

var Chunk = Class.extend(
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
		var time = this.element.children(".time").html();
		if (!this.options.time) {
			this.options.time = time;
		}
		
		// Initialize all children items
		this.element.find(".body > .item").item();
	},

	_display: function()
	{
		this.element.find(".data > .ID").html(this.options.ID);
		this.element.children(".time").html(this.options.time);
		
		// Add event handlers
		this.element.children(".time").click($.proxy(this._timeWasClicked, this));
	},
	
	_timeWasClicked: function()
	{
		alert("time was clicked");
	}
});

$.plugin('chunk', Chunk);
