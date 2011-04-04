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
		this.element.find("> .body > .chunk").each(function() {
			$(this).chunk({
				molds: molds,
				prev_chunk: prev_chunk,
				next_chunk: $(this).next().data('chunk')
			});
			
			prev_chunk = $(this).data('chunk');
		});
	},

	_display: function()
	{
		this.element.find("> .header > .date").html(this.options.date);
	}
});

$.plugin('agenda', Agenda);
