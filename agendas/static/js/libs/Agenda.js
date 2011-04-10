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
		// Parse start time option
		if (this.options.start_time) {
			this.options.start_time = new Time({timeString: this.options.start_time});
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
			deleteWasClickedCallback: $.proxy(this._itemDeleteWasClicked, this)
		}, options);
		item_div.item(options);
	},

	_display: function()
	{
		this.element.find("> .header > .date").html(this.options.date);
		
		// Add event handlers
		this.element.find("> .body").sortable({
			stop: $.proxy(this._sortWasFinished, this)
		});
		
		this.element.find("> .header > .start-time > .time").editable({
			onSubmit: $.proxy(this._startTimeWasEdited, this)
		});
		
		this.refresh();
	},

	refresh: function()
	{
		this.element.find("> .header > .start-time > .time").html(this.options.start_time.format());
		
		var agenda_start_time = this.options.start_time;
		var item = this.element.find("> .body > .item").first().data('item');
		
		while (item) {
			var start_restriction_type = item.options.times.start.restriction.type;
			var start_restriction_time = item.options.times.start.restriction.time;
			var end_restriction_type = item.options.times.end.restriction.type;
			var end_restriction_time = item.options.times.end.restriction.time;
			
			var start_time = agenda_start_time;
			var conflict = false;
			
			// Scan from the beginning, find an empty timeslot for the item
			if (start_restriction_type == "fixed" &&
				start_restriction_time) {
				if (start_restriction_time.options.time < agenda_start_time.options.time) {
					conflict = true;
				}
				else {
					start_time = start_restriction_time;
				}
			}
			if (start_restriction_type == "range" &&
				start_restriction_time) {
				if (start_restriction_time.options.time > agenda_start_time.options.time) {
					start_time = start_restriction_time;
				}
				else {
					start_time = agenda_start_time;
				}
			}
			if (end_restriction_type == "range" &&
				end_restriction_time) {
				if (agenda_start_time.plusMinutes(item.options.duration).options.time > end_restriction_time.options.time) {
					conflict = true;
				}
			}
			
			var current_item = this.element.find("> .body > .item").first().data('item');
			var placed_item = false;
			
			while (!placed_item &&
				!conflict &&
				current_item.element[0] != item.element[0]) {
				if (start_restriction_type == "fixed" &&
					start_restriction_time) {
					if (!current_item.options.conflict &&
						start_restriction_time.options.time < current_item.options.times.end.time.options.time) {
						if (current_item.options.times.start.restriction.type != "fixed") {
							item.element.insertBefore(current_item.element);
							placed_item = true;
						}
						else {
							conflict = true;
						}
					}
					
					if (placed_item) {
						start_time = start_restriction_time;
					}
				}
				else {
					if (!current_item.options.conflict) {
						if (current_item.options.times.start.restriction.type == "fixed" ||
						current_item.options.times.start.restriction.type == "range") {
							if (start_time.plusMinutes(item.options.duration).options.time <= current_item.options.times.start.time.options.time) {
								item.element.insertBefore(current_item.element);
								placed_item = true;
							}
						}
						
						if (!placed_item) {
							if (item.options.times.start.restriction.type != "range" ||
							(item.options.times.start.restriction.type == "range" &&
							item.options.times.start.restriction.time.options.time <= current_item.options.times.end.time.options.time)) {
								start_time = current_item.options.times.end.time;
							}
						}
					}
				}
				
				if (end_restriction_type == "range" &&
					end_restriction_time) {
					if (start_time.plusMinutes(item.options.duration).options.time > end_restriction_time.options.time) {
						if (placed_item) {
							conflict = true;
						}
						else {
							if (current_item.options.times.start.restriction.type != "fixed" &&
							(!current_item.options.times.end.restriction.type ||
							 (current_item.options.times.end.restriction.type == "range" && 
							  current_item.options.times.end.time.plusMinutes(item.options.duration).options.time <= current_item.options.times.end.restriction.time.options.time))) {
								item.element.insertBefore(current_item.element);
								start_time = current_item.options.times.start.time;
								placed_item = true;
							}
							else {
								conflict = true;
							}
						}
					}
				}
				
				if (!placed_item && !conflict) {
					current_item = current_item.element.next().data('item');
				}
			}
			
			item.options.conflict = conflict;
			if (start_time) {
				item.options.times.start.time = start_time;
				item.options.times.end.time = start_time.plusMinutes(item.options.duration);
			}
			item.refresh();
				
			item = item.element.next().data('item');
		}
	},

	_itemWasEdited: function()
	{
		this.refresh();
	},

	_itemAddWasClicked: function(item)
	{
		var new_item_div = this.options.molds.item.clone();
		this._initItemDiv(new_item_div);
		var new_item = new_item_div.data('item');
		if (item) {
			new_item.element.insertAfter(item.element);
		}
		else {
			new_item.element.appendTo(this.element.find("> .body"));
		}
		this.refresh();
	},

	_itemDeleteWasClicked: function(item)
	{
		item.element.remove();
		this.refresh();
	},
	
	_sortWasFinished: function()
	{
		this.refresh();
	},

	_startTimeWasEdited: function(content)
	{
		var new_time = new Time({timeString: content.current});
		
		if (new_time.options.time) {
			this.options.start_time = new_time;
		}
		
		this.refresh();
	}
});

$.plugin('agenda', Agenda);
