var Animate = function(){
};

Animate.prototype.animateNow = function ($elem, trick){       
       var deferred = $.Deferred();
       
       var original_class_string = $elem.attr('class');
       $elem.addClass(trick + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
          $(this).attr('class',original_class_string);
          deferred.resolve();
       });
       return deferred.promise();
};