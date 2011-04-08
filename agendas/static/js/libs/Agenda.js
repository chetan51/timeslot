/*
 * Class Agenda
 * 
 * Constructor options:
 *     ID
 *     date
 *     start_time
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
		// Convert time option to Date object
		if (this.options.start_time) {
			this.options.start_time = timeFromText(this.options.start_time);
		}
		
		// Initialize all children items
		$.each(this.element.find("> .body > .item"), $.proxy(function(i, item_div) {
			this._initItemDiv($(item_div));
		}, this));
	},

	refresh: function()
	{
		this.element.find("> .body > .chunk").each(function() {
			$(this).data('chunk').refresh();
		});
	},

	_initItemDiv: function(item_div, options) {
		var options = $.extend({
			wasEditedCallback: $.proxy(this._itemWasEdited, this),
			addWasClickedCallback: $.proxy(this._itemAddWasClicked, this),
			deleteWasClickedCallback: $.proxy(this._itemDeleteWasClicked, this),
		}, options);
		item_div.item(options);
	},

	_display: function()
	{
		this.element.find("> .header > .date").html(this.options.date);
		this.element.find("> .header > .start-time > .time").html(timeToText(this.options.start_time));
	}
});

$.plugin('agenda', Agenda);
