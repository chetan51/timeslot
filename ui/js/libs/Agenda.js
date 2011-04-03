/*
 * Class Agenda
 * 
 * Constructor options:
 *     ID
 *     date
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
	 
	ID: function()
	{
		return this.options.ID;
	},
    
	_load: function()
	{
		// Initialize all children chunks
		this.element.find(".body > .chunk").chunk();
	},

	_display: function()
	{
		this.element.find(".header > .date").html(this.options.date);
	}
});

$.plugin('agenda', Agenda);
