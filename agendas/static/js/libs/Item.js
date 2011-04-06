/*
 * Class Item
 * 
 * Constructor options:
 *     ID
 *     duration (optional)
 *     name     (optional)
 *     wasEditedCallback          (optional)
 *     addWasClickedCallback      (optional)
 *     deleteWasClickedCallback   (optional)
 *     addChunkWasClickedCallback (optional)
 */

var Item = Class.extend(
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
		// Convert fixed option to boolean
		this.options.fixed = this.options.fixed == "true" ? true : false;
		// Convert time option to Date object
		if (this.options.time) {
			this.options.time = timeFromText(this.options.time);
		}
	},

	_display: function()
	{
		this.refresh();
		
		// Add event handlers
		this.element.hover($.proxy(this._wasHoveredIn, this), $.proxy(this._wasHoveredOut, this));
		this.element.find("> .info > .duration").editable({
			type: 'select',
			options: {
				15:'(15 m)',
				30:'(30 m)',
				45:'(45 m)',
				60:'(1 h)',
				75:'(1 h, 15 m)',
				90:'(1 h, 30 m)',
				105:'(1 h, 45 m)',
				120:'(2 h)'
			},
			onEdit: $.proxy(this._durationWasClicked, this),
			onSubmit: $.proxy(this._durationWasEdited, this)
		});
		this.element.find("> .info > .time").editable({
			onSubmit: $.proxy(this._timeWasEdited, this)
		});
		this.element.find("> .info > .fixed > .control > input").change($.proxy(this._fixedWasEdited, this));
		this.element.find("> .name").editable({
			onSubmit: $.proxy(this._nameWasEdited, this)
		});
		this.element.find("> .controls > .add").click($.proxy(this._addWasClicked, this));
		this.element.find("> .controls > .delete").click($.proxy(this._deleteWasClicked, this));
		this.element.find("> .add-chunk").click($.proxy(this._addChunkWasClicked, this));
	},

	refresh: function()
	{
		this.element.find("> .info > .duration").html(durationToText(this.options.duration));
		var height = 60 + (this.options.duration / 15) * 5;
		this.element.css("height", height + "px");
		if (this.options.time) {
			this.element.find("> .info > .time").html(timeToText(this.options.time));
		}
		if (this.options.fixed) {
			this.element.find("> .info > .fixed > .control").hide();
			this.element.find("> .info > .fixed").show();
		}
		else {
			this.element.find("> .info > .fixed").hide();
		}
		this.element.find("> .name").html(this.options.name);
	},
	
	_wasHoveredIn: function()
	{
		this.element.find("> .controls").show();
		if (!this.options.fixed) {
			this.element.find("> .info > .fixed").show();
		}
		this.element.find("> .info > .fixed > .control").show();
		this.element.find("> .add-chunk").show();
	},
	
	_wasHoveredOut: function()
	{
		this.element.find("> .controls").hide();
		if (!this.options.fixed) {
			this.element.find("> .info > .fixed").hide();
		}
		this.element.find("> .info > .fixed > .control").hide();
		this.element.find("> .add-chunk").hide();
	},
	
	_timeWasEdited: function()
	{
		this.options.time = timeFromText(this.element.find("> .info > .time").text());
		
		if (this.options.wasEditedCallback) {
			this.options.wasEditedCallback(this);
		}
	},
	
	_durationWasClicked: function()
	{
		// this.element.find("> .info > .duration > select").attr('size',6);
	},
	
	_durationWasEdited: function(content)
	{
		this.options.duration = durationFromText(content.current);
		this.refresh();
		
		if (this.options.wasEditedCallback) {
			this.options.wasEditedCallback(this);
		}
	},
	
	_fixedWasEdited: function()
	{
		this.options.fixed = this.element.find("> .info > .fixed > .control > input").is(":checked");
		this.refresh();
		
		if (this.options.wasEditedCallback) {
			this.options.wasEditedCallback(this);
		}
		
		this._wasHoveredIn();
	},

	_nameWasEdited: function()
	{
	},

	_addWasClicked: function()
	{
		if (this.options.addWasClickedCallback) {
			this.options.addWasClickedCallback(this);
		}
	},
	
	_deleteWasClicked: function()
	{
		this.element.remove();
		
		if (this.options.deleteWasClickedCallback) {
			this.options.deleteWasClickedCallback(this);
		}
	},
	
	_addChunkWasClicked: function()
	{
		if (this.options.addChunkWasClickedCallback) {
			this.options.addChunkWasClickedCallback(this);
		}
	},

	edit: function()
	{
		this.element.find("> .name").click();
	}
});

$.plugin('item', Item);
