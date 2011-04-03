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
	 
	_load: function()
	{
		// Convert time option to Date object
		if (this.options.time) {
			this.options.time = timeFromText(this.options.time);
		}
		
		// Initialize all children items
		this.element.find("> .body > .item").item({
			wasEditedCallback: $.proxy(this._itemWasEdited, this)
		});
	},

	_display: function()
	{
		this.refresh();
		
		// Add event handlers
		this.element.find("> .header").hover($.proxy(this._headerWasHoveredIn, this), $.proxy(this._headerWasHoveredOut, this));
		this.element.find("> .header > .time").editable({
			onSubmit: $.proxy(this._timeWasEdited, this)
		});
	},
	
	refresh: function()
	{
		this.element.find("> .header > .time").html(timeToText(this.options.time));
		var refresh_again = false;
		
		var current_time = this.options.time;
		this.element.find("> .body > .item").each(function() {
			var item = $(this).data('item');
			var next_item = $(this).next().data('item');
			
			if (item.options.fixed) {
				current_time = item.options.time;
			}

			var next_time = new Date(current_time.getTime() + item.options.duration * 60 * 1000);
			
			if (!item.options.fixed &&
				next_item &&
				next_item.options.fixed) {
				if (next_time > next_item.options.time) {
					// Move this item to after the next item and refresh again
					item.element.insertAfter(next_item.element);
					refresh_again = true;
				}
			}
			
			if (!item.options.fixed) {
				item.setTime(current_time);
				item.refresh();
			}
			
			current_time = next_time;
		});
		
		if (refresh_again) {
			this.refresh();
		}
	},
	
	_headerWasHoveredIn: function()
	{
		this.element.find("> .header > .controls").show();
	},
	
	_headerWasHoveredOut: function()
	{
		this.element.find("> .header > .controls").hide();
	},
	
	_timeWasEdited: function()
	{
		this.options.time = timeFromText(this.element.find("> .header > .time").text());
		this.refresh();
	},

	_itemWasEdited: function(item)
	{
		this.refresh();
	}
});

$.plugin('chunk', Chunk);
