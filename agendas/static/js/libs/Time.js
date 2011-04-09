/*
 * Class Time
 * 
 * Constructor options:
 *     timeString
 */

var Time = Class.extend(
{
	init: function(options)
	{
		this.options = $.extend({}, options);
		if (this.options.timeString) {
			var t = new Date();
			var time = this.options.timeString.match(/(\d+)(?::(\d\d))?\s*(p?)/);
			if (time && time[1]) {
				t.setHours(parseInt(time[1]) + (time[3] ? 12 : 0));
				t.setMinutes(parseInt(time[2]) || 0);
				t.setSeconds(0);
				t.setMilliseconds(0);
			}
			else {
				t = null;
			}

			this.options.time = t;
		}
	},

	format: function()
	{
		if (this.options.time) {
			var a_p = "";
			var d = this.options.time;
			var curr_hour = d.getHours();
			if (curr_hour < 12)
			{
				a_p = "am";
			}
			else
			{
				a_p = "pm";
			}
			if (curr_hour == 0)
			{
				curr_hour = 12;
			}
			if (curr_hour > 12)
			{
				curr_hour = curr_hour - 12;
			}

			var curr_min = d.getMinutes();

			curr_min = curr_min + "";

			if (curr_min.length == 1)
			{
				curr_min = "0" + curr_min;
			}

			return curr_hour + ":" + curr_min + " " + a_p;
		}
		else {
			return "";
		}
	},

	plusMinutes: function(minutes)
	{
		var new_time = new Time();
		new_time.options.time = new Date(this.options.time.getTime() + minutes * 60 * 1000);
		new_time.options.time.setSeconds(0);
		new_time.options.time.setMilliseconds(0);
		return new_time;
	}
});
