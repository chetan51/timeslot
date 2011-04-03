/*
 * Class Chunk
 * 
 * Constructor options:
 *     ID
 *     time
 *     molds
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
		$.each(this.element.find("> .body > .item"), $.proxy(function(i, item) {
			this._initItem($(item));
		}, this));
	},

	_initItem: function(item_div, options) {
		var options = $.extend({
			wasEditedCallback: $.proxy(this._itemWasEdited, this),
			addWasClickedCallback: $.proxy(this._itemAddWasClicked, this)
		}, options);
		item_div.item(options);
	},

	_display: function()
	{
		this.refresh();
		
		// Add event handlers
		this.element.find("> .header").hover($.proxy(this._headerWasHoveredIn, this), $.proxy(this._headerWasHoveredOut, this));
		this.element.find("> .header > .time").editable({
			onSubmit: $.proxy(this._timeWasEdited, this)
		});
		this.element.find("> .header > .controls > .add").click($.proxy(this._addWasClicked, this));
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
	
	addItem: function(after_div)
	{
		var item_div = this.options.molds.item.clone();
		this._initItem(item_div, {
			time: timeToText(this.options.time),
			duration: 60
		});
		
		if (after_div) {
			item_div.insertAfter(after_div);
		}
		else {
			this.element.find("> .body").prepend(item_div);
		}
		
		var item = item_div.data('item');
		item.refresh();
		item.edit();
		
		this.refresh();
	},
	
	_addWasClicked: function()
	{
		this.addItem();
	},

	_itemAddWasClicked: function(item)
	{
		this.addItem(item.element);
	},
	
	_itemWasEdited: function(item)
	{
		this.refresh();
	}
});

$.plugin('chunk', Chunk);
