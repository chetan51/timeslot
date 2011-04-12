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
			stop: $.proxy(this._sortWasFinished, this),
			items: ".item",
			cancel: ".free-time"
		});
		
		this.element.find("> .header > .start-time").hover($.proxy(this._startTimeWasHoveredIn, this), $.proxy(this._startTimeWasHoveredOut, this))
		this.element.find("> .header > .start-time > .time").editable({
			onSubmit: $.proxy(this._startTimeWasEdited, this)
		});
		
		this.element.find("> .header > .add-item").click($.proxy(this._itemAddWasClicked, this));
		
		this.refresh();
	},

	refresh: function()
	{
		this.element.find("> .header > .start-time > .time").html(this.options.start_time.format());
		
		var agenda_start_time = this.options.start_time;
		var item = this.element.find("> .body > .item").first().data('item');
		var counter = 0;
		
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
				if (start_restriction_time.isLess(agenda_start_time)) {
					conflict = true;
				}
				else {
					start_time = start_restriction_time;
				}
			}
			if (start_restriction_type == "range" &&
				start_restriction_time) {
				if (start_restriction_time.isGreater(agenda_start_time)) {
					start_time = start_restriction_time;
				}
				else {
					start_time = agenda_start_time;
				}
			}
			if (end_restriction_type == "range" &&
				end_restriction_time) {
				if (agenda_start_time.plusMinutes(item.options.duration).isGreater(end_restriction_time)) {
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
						(start_restriction_time.isLess(current_item.options.times.end.time))) {
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
							if (start_time.plusMinutes(item.options.duration).isLessOrEqual(current_item.options.times.start.time)) {
								item.element.insertBefore(current_item.element);
								placed_item = true;
							}
						}
						
						if (!placed_item) {
							if (start_restriction_type != "range" ||
							(start_restriction_type == "range" &&
							start_restriction_time.isLessOrEqual(current_item.options.times.end.time))) {
								start_time = current_item.options.times.end.time;
							}
						}
					}
				}
				
				if (end_restriction_type == "range" &&
					end_restriction_time) {
					if (start_time.plusMinutes(item.options.duration).isGreater(end_restriction_time)) {
						if (placed_item) {
							conflict = true;
						}
						else {
							if (current_item.options.times.start.restriction.type != "fixed" &&
							(!current_item.options.times.end.restriction.type ||
							 (current_item.options.times.end.restriction.type == "range" &&
							  current_item.options.times.end.restriction.time &&
							  (current_item.options.times.end.time.plusMinutes(item.options.duration).isLessOrEqual(current_item.options.times.end.restriction.time))))) {
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
					current_item = current_item.element.nextAll(".item:first").data('item');
				}
			}
			
			var end_time = start_time.plusMinutes(item.options.duration);
			
			item.options.conflict = conflict;
			item.options.times.start.time = start_time;
			item.options.times.end.time = end_time;
			item.refresh();
				
			if (counter % 2 == 0) {
				item.element.addClass("item-A");
				item.element.removeClass("item-B");
			}
			else {
				item.element.removeClass("item-A");
				item.element.addClass("item-B");
			}
			
			// Add / modify free time block before item as necessary
			var prev_item = item.element.prevAll(".item:first").data('item');
			var free_time = 0; // in minutes
			
			if (prev_item) {
				free_time = item.options.times.start.time.minus(prev_item.options.times.end.time);
			}
			else {
				free_time = item.options.times.start.time.minus(agenda_start_time);
			}
			
			var prev_div = item.element.prev();
			var free_time_div;
			var new_free_time_div = false;
			if (!prev_div.length || !prev_div.hasClass("free-time")) {
				free_time_div = this.options.molds.free_time.clone();
				new_free_time_div = true;
			}
			else {
				free_time_div = prev_div;
			}
			free_time_div.find("> .info > .duration > .length").html(durationToText(free_time));
			var height = 50 + (free_time / 15) * 5;
			free_time_div.css("height", height + "px");
			
			if (free_time != 0 && new_free_time_div) {
				free_time_div.insertBefore(item.element);
			}
			else if (free_time == 0) {
				free_time_div.remove();
			}
			
			item = item.element.nextAll(".item:first").data('item');
			counter++;
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
		if (item.options) {
			new_item.element.insertAfter(item.element);
		}
		else {
			new_item.element.appendTo(this.element.find("> .body"));
		}
		new_item.edit();
		new_item.editName();
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
	
	_startTimeWasHoveredIn: function()
	{
		this.element.find("> .header > .start-time > .label").show();
	},

	_startTimeWasHoveredOut: function()
	{
		this.element.find("> .header > .start-time > .label").hide();
	},
	
	_startTimeWasEdited: function(content)
	{
		var new_time = new Time({timeString: content.current});
		
		if (new_time.isValid()) {
			this.options.start_time = new_time;
		}
		
		this.refresh();
	}
});

$.plugin('agenda', Agenda);
