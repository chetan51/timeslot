/*
 * Class Agenda
 * 
 * Constructor options:
 *     ID
 *     date
 *     molds
 */

var Agenda = Class.extend(
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
		// Initialize all children chunks
		var molds = this.options.molds;
		var prev_chunk = null;
		$.each(this.element.find("> .body > .chunk"), $.proxy(function(i, chunk_div) {
			chunk_div = $(chunk_div);
			this._initChunk(chunk_div, prev_chunk);
			var chunk = chunk_div.data('chunk');
			
			if (prev_chunk) {
				prev_chunk.options.next_chunk = chunk;
			}
			prev_chunk = chunk;
		}, this));
	},

	refresh: function()
	{
		this.element.find("> .body > .chunk").each(function() {
			$(this).data('chunk').refresh();
		});
	},

	_initChunk: function(chunk_div, prev_chunk, next_chunk, chunk_time)
	{
		var time = null;
		if (chunk_time) {
			time = timeToText(chunk_time);
		}
		
		chunk_div.chunk({
			molds: this.options.molds,
			time: time,
			prev_chunk: prev_chunk,
			next_chunk: next_chunk,
			wasEditedCallback: $.proxy(this._chunkWasEdited, this),
			addChunkWasClickedCallback: $.proxy(this._addChunkWasClicked, this),
			deleteWasClickedCallback: $.proxy(this._deleteChunkWasClicked, this)
		});
		
		chunk_div.find("> .body").sortable({
			connectWith: ".chunk > .body",
			stop: $.proxy(this._chunkSortingWasStopped, this)
		});
	},

	_display: function()
	{
		this.element.find("> .header > .date").html(this.options.date);
	},

	_chunkWasEdited: function(chunk)
	{
		this.refresh();
	},
	
	_addChunkWasClicked: function(this_chunk, after_item)
	{
		this.addChunk(this_chunk, after_item);
	},
	
	_deleteChunkWasClicked: function(chunk)
	{
		this.deleteChunk(chunk);
	},
	
	_chunkSortingWasStopped: function()
	{
		this.refresh();
	},
	
	addChunk: function(after_chunk, after_item)
	{
		var chunk_div = this.options.molds.chunk.clone();
		var chunk_time = new Date(after_item.options.time.getTime() + (after_item.options.duration * 60 * 1000));
		
		var next_chunk = after_chunk.options.next_chunk;
		this._initChunk(chunk_div, after_chunk, next_chunk, chunk_time);
		
		var this_chunk = chunk_div.data('chunk');
		after_chunk.options.next_chunk = this_chunk;
		if (next_chunk) {
			next_chunk.options.prev_chunk = this_chunk;
		}
		
		var next_item = after_item.element.next().data('item');
		while(next_item) {
			var next_item_div = next_item.element.detach();
			this_chunk.appendItemDiv(next_item_div);
			next_item = after_item.element.next().data('item');
		}
		
		this_chunk.refresh();
		this_chunk.element.insertAfter(after_chunk.element);
	},

	deleteChunk: function(chunk)
	{
		var prev_chunk = chunk.options.prev_chunk;
		var next_chunk = chunk.options.next_chunk;
		if (prev_chunk) {
			var item_divs = chunk.element.find("> .body > .item");
			item_divs.each(function() {
				var item_div = $(this).detach();
				prev_chunk.appendItemDiv(item_div);
			});
			
			prev_chunk.options.next_chunk = next_chunk;
			if (next_chunk) {
				next_chunk.options.prev_chunk = prev_chunk;
			}
			
			chunk.element.remove();
			this.refresh();
		}
		else {
			alert("Can't delete first separator");
		}
	}
});

$.plugin('agenda', Agenda);
