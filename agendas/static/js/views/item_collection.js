window.ItemCollectionView = Backbone.View.extend
({
	initialize: function()
	{
		_.bindAll(this, 'add', 'addNew', 'render', 'saveOrder');
		
		this.collection.bind('refresh', this.render);
		this.collection.bind('add', this.addNew);
		
		this.views = [];
	},
	
	add: function(item)
	{
		this.addAfter(item);
	},

	addNew: function(item)
	{
		this.addAfter(item);
		this.saveOrder();
	},
	
	addAfter: function(item, after)
	{
		var item_view = new ItemView({model: item});
		if (after) {
			$(item_view.render().el).insertAfter($(after.el));
		}
		else {
			$(this.el).append($(item_view.render().el));
		}
	},
	
	addAll: function()
	{
		this.collection.each(this.add);
	},

	render: function()
	{
		$(this.el).html('');
		
		this.addAll();
		this.makeInteractive();
		this.loadElements();
		this.refresh();
	},
	
	loadElements: function()
	{
		this.elements = {};
		$.extend(this.elements, {
			items: this.$(".item"),
		});
	},

	makeInteractive: function()
	{
		var self = this;
		
		$(this.el).sortable({
			update: function() {
				self.saveOrder();
				self.collection.sort({silent: true});
			},
			items: ".item"
		});
	},
	
	saveOrder: function()
	{
		this.loadElements();
		this.elements.items.each(function(seq, item_div) {
			var item = $(item_div).data('model');
			item.save({seq: seq});
		});
	},
	
	refresh: function()
	{
		var collection_start_time = this.collection.options.start_time;
		var item_div = this.elements.items.first();
		var item = item_div.data('model');
		var counter = 0;
		
		while (item) {
			var start_restriction_type = item.get('start_restriction_type');
			var start_restriction_time = item.get('start_restriction_time');
			var end_restriction_type = item.get('end_restriction_type');
			var end_restriction_time = item.get('end_restriction_time');
			
			var start_time = collection_start_time;
			var conflict = false;
			
			// Scan from the beginning, find an empty timeslot for the item
			if (start_restriction_type == "fixed" &&
				start_restriction_time) {
				if (start_restriction_time.isLess(collection_start_time)) {
					conflict = true;
				}
				else {
					start_time = start_restriction_time;
				}
			}
			if (start_restriction_type == "range" &&
				start_restriction_time) {
				if (start_restriction_time.isGreater(collection_start_time)) {
					start_time = start_restriction_time;
				}
				else {
					start_time = collection_start_time;
				}
			}
			if (end_restriction_type == "range" &&
				end_restriction_time) {
				if (collection_start_time.plusMinutes(item.options.duration).isGreater(end_restriction_time)) {
					conflict = true;
				}
			}
			
			var current_item_div = this.elements.items.first();
			var current_item = current_item_div.data('model');
			var placed_item = false;
			
			// up to here works
			
			while (!placed_item &&
				!conflict &&
				current_item_div[0] != item_div[0]) {
				if (start_restriction_type == "fixed" &&
					start_restriction_time) {
					if (!current_item_div.data('conflict') &&
						(start_restriction_time.isLess(current_item_div.data('end_time')))) {
						if (current_item.get('start_restriction_type') != "fixed") {
							item_div.insertBefore(current_item_div);
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
					if (!current_item_div.data('conflict')) {
						if (current_item.get('start_restriction_type') == "fixed" ||
						current_item.get('start_restriction_type') == "range") {
							if (start_time.plusMinutes(item.get('duration')).isLessOrEqual(current_item_div.data('start_time'))) {
								item_div.insertBefore(current_item_div);
								placed_item = true;
							}
						}
						
						if (!placed_item) {
							if (start_restriction_type != "range" ||
							(start_restriction_type == "range" &&
							start_restriction_time.isLessOrEqual(current_item_div.data('end_time')))) {
								start_time = current_item_div.data('end_time');
							}
						}
					}
				}
				
				/*
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
				*/
				
				if (!placed_item && !conflict) {
					current_item_div = current_item_div.nextAll(".item:first");
					current_item = current_item_div.data('model');
				}
			}
			
			var end_time = start_time.plusMinutes(item.get('duration'));
			
			item_div.data('conflict', conflict);
			item_div.data('start_time', start_time);
			item_div.data('end_time', end_time);
			//item.refresh();
			
			if (counter % 2 == 0) {
				item_div.addClass("item-A");
				item_div.removeClass("item-B");
			}
			else {
				item_div.removeClass("item-A");
				item_div.addClass("item-B");
			}
			
			/*
			// Add / modify free time block before item as necessary
			var prev_item = item.element.prevAll(".item:first").data('item');
			var free_time = 0; // in minutes
			
			if (prev_item) {
				free_time = item.options.times.start.time.minus(prev_item.options.times.end.time);
			}
			else {
				free_time = item.options.times.start.time.minus(collection_start_time);
			}
			
			var prev_div = item.element.prev();
			var free_time_div;
			var new_free_time_div = false;
			if (!prev_div.length || !prev_div.hasClass("free-time")) {
				free_time_div = this.model.options.molds.free_time.clone();
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
			*/
			
			item_div = item_div.nextAll(".item:first");
			item = item_div.data('model');
			counter++;
		}
	},
});
