window.ItemCollectionView = Backbone.View.extend
({
	selectors: {
		items: '.item',
		item_add: '.item .add'
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
		var item_view = new ItemView({model: item});
		$(this.el).append($(item_view.render().el));
		
		item.bind('change', this.refresh);
		
		this.refresh();
	},
	
	addAll: function()
	{
		this.collection.each(this.add);
	},
	
	addNew: function(item)
	{
		this.add(item);
		this.saveOrder();
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
		this.refresh();
	},

	makeInteractive: function()
	{
		var self = this;
		
		$(this.el).sortable({
			update: _.bind(function() {
				this.saveOrder();
				this.collection.sort({silent: true});
				this.refresh();
			}, this),
			items: ".item"
		});
		
		this.element('item_add').unbind("click").click(function() {
			var this_item = $(this).parents(".item").data('view').model;
			var new_item;
			
			if (this_item.get('start_restriction_type') &&
				new Time({timeString: this_item.get('start_restriction_time')}).isValid()) {
				start_restriction_type = "range";
				start_restriction_time = new Time({timeString: this_item.view.options.start_time}).format24Hour();
				
				new_item = self.collection.create({
					start_restriction_type: start_restriction_type,
					start_restriction_time: start_restriction_time
				});
			}
			else {
				new_item = self.collection.create();
			}
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
		
		while (item) {
			var start_restriction_type = item.model.get('start_restriction_type');
			var start_restriction_time = new Time({timeString: item.model.get('start_restriction_time')});
			var end_restriction_type = item.model.get('end_restriction_type');
			var end_restriction_time = new Time({timeString: item.model.get('end_restriction_time')});
			
			var start_time = collection_start_time;
			var conflict = false;
			
			// Sanity check on the item's restrictions
			if (start_restriction_type == "fixed" &&
				start_restriction_time.isValid() &&
				start_restriction_time.isLess(collection_start_time)) {
				conflict = true;
			}
			if (end_restriction_type == "range" &&
				end_restriction_time.isValid() &&
				end_restriction_time.isLess(collection_start_time.plusMinutes(item.model.get('duration')))) {
				conflict = true;
			}
			if (start_restriction_type &&
				start_restriction_time.isValid() &&
				end_restriction_type &&
				end_restriction_time.isValid() &&
				start_restriction_time.plusMinutes(item.model.get('duration')).isGreater(end_restriction_time)) {
				conflict = true;
			}
			
			// Scan from the beginning, find an empty timeslot for the item
			if (start_restriction_type == "fixed" &&
				start_restriction_time.isValid()) {
				if (start_restriction_time.isLess(collection_start_time)) {
					conflict = true;
				}
				else {
					start_time = start_restriction_time;
				}
			}
			if (start_restriction_type == "range" &&
				start_restriction_time.isValid()) {
				if (start_restriction_time.isGreater(collection_start_time)) {
					start_time = start_restriction_time;
				}
				else {
					start_time = collection_start_time;
				}
			}
			if (end_restriction_type == "range" &&
				end_restriction_time.isValid()) {
				if (collection_start_time.plusMinutes(item.model.get('duration')).isGreater(end_restriction_time)) {
					conflict = true;
				}
			}
			
			var current_item = this.element('items').first().data('view');
			var placed_item = false;
			
			while (!placed_item &&
				!conflict &&
				$(current_item.el)[0] != $(item.el)[0]) {
				if (start_restriction_type == "fixed" &&
					start_restriction_time.isValid()) {
					if (!current_item.options.conflict &&
						(start_restriction_time.isLess(new Time({timeString: current_item.options.end_time})))) {
						if (current_item.model.get('start_restriction_type') != "fixed" ||
							!current_item.model.get('start_restriction_time')) {
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
					end_restriction_time.isValid()) {
					if (start_time.plusMinutes(item.model.get('duration')).isGreater(end_restriction_time)) {
						if (placed_item) {
							conflict = true;
						}
						else {
							if (current_item.model.get('start_restriction_type') != "fixed" &&
							(!current_item.model.get('end_restriction_type') ||
							 (current_item.model.get('end_restriction_type') == "range" &&
							  !current_item.model.get('end_restriction_time')) ||
							 (current_item.model.get('end_restriction_type') == "range" &&
							  current_item.model.get('end_restriction_time') &&
							  (new Time({timeString: current_item.options.end_time}).plusMinutes(item.model.get('duration')).isLessOrEqual(new Time({timeString: current_item.model.get('end_restriction_time')})))))) {
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
			
			// Add / modify free time block before item as necessary
			var prev_item = $(item.el).prevAll(".item:first").data('view');
			while (prev_item && prev_item.options.conflict) {
				prev_item = $(prev_item.el).prevAll(".item:first").data('view');
			}
			var free_time_duration = 0; // in minutes
			
			if (!item.options.conflict) {
				if (prev_item) {
					free_time_duration = new Time({timeString: item.options.start_time}).minus(new Time({timeString: prev_item.options.end_time}));
				}
				else {
					free_time_duration = new Time({timeString: item.options.start_time}).minus(collection_start_time);
				}
			}
			
			var prev_view = $(item.el).prev().data('view');
			var free_time;
			var new_free_time = false;
			if (prev_view && prev_view.className == "free-time") {
				free_time = prev_view;
				free_time.options.duration = free_time_duration;
			}
			else {
				free_time = new FreeTimeView({duration: free_time_duration});
				new_free_time = true;
			}
			free_time.render();
			
			if (free_time_duration !== 0 && new_free_time) {
				$(free_time.render().el).insertBefore($(item.el));
			}
			else if (free_time_duration === 0) {
				$(free_time.el).remove();
			}
			
			// Remove free time block after item if this is the last item
			var next_item = $(item.el).nextAll(".item:first").data('view');
			var next_view = $(item.el).next().data('view');
			if (!next_item && next_view &&
				next_view.className == "free-time") {
				next_view.remove();
			}
			
			item = $(item.el).nextAll(".item:first").data('view');
		}
		
		this.refreshAlternatingItems();
		this.makeInteractive();
	},
	
	refreshAlternatingItems: function()
	{
		var counter = 0;
		var item = this.element('items').first().data('view');
		
		while (item) {
			if (counter % 2 === 0) {
				$(item.el).addClass("item-A");
				$(item.el).removeClass("item-B");
			}
			else {
				$(item.el).removeClass("item-A");
				$(item.el).addClass("item-B");
			}
			
			item = $(item.el).nextAll(".item:first").data('view');
			counter++;
		}
	}
});
