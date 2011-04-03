window.log = function(){
  log.history = log.history || [];  
  log.history.push(arguments);
  arguments.callee = arguments.callee.caller;  
  if(this.console) console.log( Array.prototype.slice.call(arguments) );
};
(function(b){function c(){}for(var d="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),a;a=d.pop();)b[a]=b[a]||c})(window.console=window.console||{});

/*
 * jQuery utilities
 */

jQuery.fn.swap = function(b){ 
    b = jQuery(b)[0]; 
    var a = this[0]; 
    var t = a.parentNode.insertBefore(document.createTextNode(''), a); 
    b.parentNode.insertBefore(a, b); 
    t.parentNode.insertBefore(b, t); 
    t.parentNode.removeChild(t); 
    return this; 
};

/*
 * Time string parsing
 */

function timeFromText(timeText)
{
    var d = new Date();
    var time = timeText.match(/(\d+)(?::(\d\d))?\s*(p?)/);
    d.setHours( parseInt(time[1]) + (time[3] ? 12 : 0) );
    d.setMinutes( parseInt(time[2]) || 0 );
    return d;
}

function timeToText(time)
{
    var a_p = "";
    var d = time;
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

function durationToText(duration) // in minutes
{
    var text_elements = [];
    var hours = Math.floor(duration / 60);
    if (hours > 0) {
        text_elements.push(hours + " h");
        duration -= hours * 60;
    }
    var minutes = Math.floor(duration);
    if (minutes > 0) {
        text_elements.push(minutes + " m");
        duration -= minutes;
    }
    return "(" + text_elements.join(', ') + ")";
}

function durationFromText(durationText)
{
    durationText = durationText.substring(1, durationText.length - 1); // remove parentheses
    var text_elements = durationText.split(', ');
    
    var minutes = 0;
    for (t in text_elements) {
        var text_element = text_elements[t];
        var element_components = text_element.split(' ');
        if (element_components[1] == 'h') {
            minutes += parseInt(element_components[0]) * 60;
        }
        else if (element_components[1] == 'm') {
            minutes += parseInt(element_components[0]);
        }
    }
    
    return minutes;
}
