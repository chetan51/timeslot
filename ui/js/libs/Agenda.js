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
		this.element.find("> .body > .chunk").chunk({
			molds: this.options.molds
		});
	},

	_display: function()
	{
		this.element.find("> .header > .date").html(this.options.date);
	}
});

$.plugin('agenda', Agenda);
