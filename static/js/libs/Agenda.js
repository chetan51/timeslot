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
		var timeWasEditedCallback = $.proxy(this._chunkTimeWasEdited, this);
		var addChunkWasClickedCallback = $.proxy(this._addChunkWasClicked, this);
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
			timeWasEditedCallback: $.proxy(this._chunkTimeWasEdited, this),
			addChunkWasClickedCallback: $.proxy(this._addChunkWasClicked, this)
		});
	},

	_display: function()
	{
		this.element.find("> .header > .date").html(this.options.date);
	},

	_chunkTimeWasEdited: function(chunk)
	{
		this.element.find("> .body > .chunk").each(function() {
			$(this).data('chunk').refresh();
		});
	},
	
	_addChunkWasClicked: function(this_chunk, after_item)
	{
		this.addChunk(this_chunk, after_item);
	},
	
	addChunk: function(this_chunk, after_item)
	{
		var chunk_div = this.options.molds.chunk.clone();
		var chunk_time = new Date(after_item.options.time.getTime() + (after_item.options.duration * 60 * 1000));
		
		this._initChunk(chunk_div, this_chunk, this_chunk.options.next_chunk, chunk_time);
		
		var chunk = chunk_div.data('chunk');
		this_chunk.options.next_chunk = chunk;
		
		var next_item = after_item.element.next().data('item');
		while(next_item) {
			chunk.appendItemDiv(next_item.element);
			next_item = after_item.element.next().data('item');
		}
		
		chunk.refresh();
		chunk.element.insertAfter(this_chunk.element);
	}
});

$.plugin('agenda', Agenda);
