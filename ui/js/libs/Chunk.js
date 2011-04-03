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
		// Convert time option to Date object
		if (this.options.time) {
			this.options.time = timeFromText(this.options.time);
		}
		
		// Initialize all children items
		this.element.find(".body > .item").item();
	},

	_display: function()
	{
		this.element.children(".time").html(timeToText(this.options.time));
		
		var current_time = this.options.time;
		this.element.find(".body > .item").each(function() {
			var item = $(this).data('item');
			item.setTime(current_time);
			item.refresh();
			current_time = new Date(current_time.getTime() + item.options.duration * 60 * 1000);
		});
		
		// Add event handlers
		this.element.children(".time").click($.proxy(this._timeWasClicked, this));
	},
	
	_timeWasClicked: function()
	{
		alert("time was clicked");
	}
});

$.plugin('chunk', Chunk);
