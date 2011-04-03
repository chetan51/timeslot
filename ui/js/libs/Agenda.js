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
		var ID = this.element.find(".data > .ID").html();
		if (!this.options.ID) {
			this.options.ID = ID;
		}
		var date = this.element.find(".header > .date").html();
		if (!this.options.date) {
			this.options.date = date;
		}
		
		// Initialize all children separators and items
		this.element.find(".body > .separator").separator();
		this.element.find(".body > .item").item();
	},

	_display: function()
	{
		this.element.find(".data > .ID").html(this.options.ID);
		this.element.find(".header > .date").html(this.options.date);
	}
});

$.plugin('agenda', Agenda);
