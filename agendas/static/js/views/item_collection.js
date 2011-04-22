window.ItemCollectionView = Backbone.View.extend
({
	selectors: {
		items: '.item'
	},

	element: function(selector)
	{
		return this.$(this.selectors[selector]);
	},

	initialize: function(options)
	{
		_.bindAll(this, 'add', 'addNew', 'remove', 'render', 'refresh', 'saveOrder');
		
		this.collection.bind('refresh', this.render);
		this.collection.bind('add', this.addNew);
		this.collection.bind('remove', this.remove);
		
		this.render();
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
		
		item.bind('change', this.refresh);
		
		this.refresh();
	},
	
	addAll: function()
	{
		this.collection.each(this.add);
	},
	
	remove: function(item)
	{
		item.view.remove();
		this.refresh();
	},
	
	render: function()
	{
		$(this.el).html('');
		
		this.addAll();
		this.makeInteractive();
		this.refresh();
	},

	makeInteractive: function()
	{
		$(this.el).sortable({
			update: _.bind(function() {
				this.saveOrder();
				this.collection.sort({silent: true});
				this.refresh();
			}, this),
			items: ".item"
		});
	},
	
	saveOrder: function()
	{
		this.element('items').each(function(seq, item_div) {
			var item = $(item_div).data('view');
			item.model.save({seq: seq});
		});
	},
	
	refresh: function()
	{
		var collection_start_time = new Time({timeString: this.options.start_time});
		var item = this.element('items').first().data('view');
		var counter = 0;
		
		while (item) {
			var start_restriction_type = item.model.get('start_restriction_type');
			var start_restriction_time = item.model.get('start_restriction_time');
			var end_restriction_type = item.model.get('end_restriction_type');
			var end_restriction_time = item.model.get('end_restriction_time');
			
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
			
			var current_item = this.element('items').first().data('view');
			var placed_item = false;
			
			while (!placed_item &&
				!conflict &&
				$(current_item.el)[0] != $(item.el)[0]) {
				if (start_restriction_type == "fixed" &&
					start_restriction_time) {
					if (!current_item.options.conflict &&
						(start_restriction_time.isLess(new Time({timeString: current_item.options.end_time})))) {
						if (current_item.model.get('start_restriction_type') != "fixed") {
							$(item.el).insertBefore($(current_item.el));
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
						if (current_item.model.get('start_restriction_type') == "fixed" ||
						current_item.model.get('start_restriction_type') == "range") {
							if (start_time.plusMinutes(item.model.get('duration')).isLessOrEqual(new Time({timeString: current_item.options.start_time}))) {
								$(item.el).insertBefore($(current_item.el));
								placed_item = true;
							}
						}
						
						if (!placed_item) {
							if (start_restriction_type != "range" ||
							(start_restriction_type == "range" &&
							start_restriction_time.isLessOrEqual(new Time({timeString: current_item.options.end_time})))) {
								start_time = new Time({timeString: current_item.options.end_time});
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
							if (current_item.model.get('start_restriction_type') != "fixed" &&
							(!current_item.model.get('end_restriction_type') ||
							 (current_item.model.get('end_restriction_type') == "range" &&
							  current_item.model.get('end_restriction_time') &&
							  (new Time({timeString: current_item.options.end_time}).plusMinutes(item.options.duration).isLessOrEqual(new Time({timeString: current_item.model.get('end_restriction_time')})))))) {
								$(item.el).insertBefore($(current_item.el));
								start_time = new Time({timeString: current_item.options.start_time});
								placed_item = true;
							}
							else {
								conflict = true;
							}
						}
					}
				}
				
				if (!placed_item && !conflict) {
					current_item = $(current_item.el).nextAll(".item:first").data('view');
				}
			}
			
			var end_time = start_time.plusMinutes(item.model.get('duration'));
			
			item.options.conflict = conflict;
			item.options.start_time = start_time.format();
			item.options.end_time = end_time.format();
			item.refresh();
			
			if (counter % 2 == 0) {
				$(item.el).addClass("item-A");
				$(item.el).removeClass("item-B");
			}
			else {
				$(item.el).removeClass("item-A");
				$(item.el).addClass("item-B");
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
			
			item = $(item.el).nextAll(".item:first").data('view');
			counter++;
		}
	},
});
