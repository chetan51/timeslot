/*
 * Class Chunk
 * 
 * Constructor options:
 *     ID
 *     time
 *     molds
 *     prev_chunk (optional)
 *     next_chunk (optional)
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
		$.each(this.element.find("> .body > .item"), $.proxy(function(i, item_div) {
			this._initItemDiv($(item_div));
		}, this));
	},

	_initItemDiv: function(item_div, options) {
		var options = $.extend({
			wasEditedCallback: $.proxy(this._itemWasEdited, this),
			addWasClickedCallback: $.proxy(this._itemAddWasClicked, this),
			deleteWasClickedCallback: $.proxy(this._itemDeleteWasClicked, this),
			addChunkWasClickedCallback: $.proxy(this._itemAddChunkWasClicked, this)
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
	
	_sortFixed: function()
	{
		var start_time = this.options.time;
		var prev_chunk = this.options.prev_chunk;
		var next_chunk = this.options.next_chunk;
		var prev_fixed = null;
		this.element.find("> .body > .item").each(function() {
			var item = $(this).data('item');
			
			if (item.options.fixed) {
				if (prev_chunk &&
					item.options.time < start_time) {
					prev_chunk.appendItemDiv(item.element);
					prev_chunk.refresh();
				}
				else if (next_chunk &&
					item.options.time >= next_chunk.options.time) {
					next_chunk.prependItemDiv(item.element);
					next_chunk.refresh();
				}
				
				if (prev_fixed &&
					item.options.time < prev_fixed.options.time) {
					item.element.insertBefore(prev_fixed.element);
				}
				else {
					prev_fixed = item;
				}
			}
		});
	},
	
	_sortUnfixed: function()
	{
		var start_time = this.options.time;
		this.element.find("> .body > .item").each(function() {
			var item = $(this).data('item');
			var prev_item = $(this).prev().data('item');
			var next_item = $(this).next().data('item');
			
			if (!item.options.fixed) {
				if (!prev_item) {
					item.options.time = start_time;
					item.refresh();
				}
				else if (prev_item &&
					prev_item.options.fixed) {
					var current_time = prev_item.options.time + (prev_item.options.duration * 60 * 1000);
					alert("WIP");
				}
			}
		});
	},
	
	refresh: function()
	{
		this.element.find("> .header > .time").html(timeToText(this.options.time));
		
		this._sortFixed();
		this._sortUnfixed();
	},
	
	prependItemDiv: function(item_div, options)
	{
		this._initItemDiv(item_div, options);
		item_div.prependTo(this.element.find("> .body"));
	},
	
	
	appendItemDiv: function(item_div, options)
	{
		this._initItemDiv(item_div, options);
		item_div.appendTo(this.element.find("> .body"));
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
	
	addItem: function(after_item)
	{
		var item_div = this.options.molds.item.clone();
		this._initItemDiv(item_div, {
			time: timeToText(this.options.time),
			duration: 60
		});
		
		if (after_item) {
			item_div.insertAfter(after_item.element);
		}
		else {
			this.element.find("> .body").prepend(item_div);
		}
		
		var item = item_div.data('item');
		item.refresh();
		item.edit();
		
		this.refresh();
	},
	
	addChunk: function(after_item)
	{
		var chunk_div = this.options.molds.chunk.clone();
		var chunk_time = new Date(after_item.options.time.getTime() + (after_item.options.duration * 60 * 1000));
		chunk_div.chunk({
			molds: this.options.molds,
			time: timeToText(chunk_time),
			prev_chunk: this,
			next_chunk: this.options.next_chunk
		});
		var chunk = chunk_div.data('chunk');
		this.options.next_chunk = chunk;
		
		var next_item = after_item.element.next().data('item');
		while(next_item) {
			chunk.appendItemDiv(next_item.element);
			next_item = after_item.element.next().data('item');
		}
		
		chunk.refresh();
		
		chunk.element.insertAfter(this.element);
	},
	
	_addWasClicked: function()
	{
		this.addItem();
	},

	_itemAddWasClicked: function(item)
	{
		this.addItem(item);
	},
	
	_itemDeleteWasClicked: function(item)
	{
		this.refresh();
	},
	
	_itemAddChunkWasClicked: function(item)
	{
		this.addChunk(item);
	},
	
	_itemWasEdited: function(item)
	{
		this.refresh();
	}
});

$.plugin('chunk', Chunk);
