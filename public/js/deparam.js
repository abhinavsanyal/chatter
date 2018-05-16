(function($){
    $.deparam = $.deparam || function(uri){
        var value1 = uri;
        var value2 = value1.split('/');
        var value3 = value2.pop();

        return value3;
    }
})(jQuery);