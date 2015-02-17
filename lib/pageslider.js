/* Notes:
 * - History management is currently done using window.location.hash.  This could easily be changed to use Push State instead.
 * - jQuery dependency for now. This could also be easily removed.
 */

function PageSlider(container) {

    var effects = {
        "slideFromLeft" : ["left","center","right"],
        "slideFromRight" : ["right","center","left"],
        "zoom" : ["zoomedOut","zoomNormal","zoomNormal2"],
    };
    
    var container = container,
        currentPage,
        stateHistory = [];

    this.replaceCurrentPage = function(page){
        container.append(page);
        page.attr("class", "page center");
        currentPage.remove();        
        currentPage = page;
    }
    
    // Use this function if you want PageSlider to automatically determine the sliding direction based on the state history
    this.newPage = function(page, effect) {

        var deferred = $.Deferred();
    
        var l = stateHistory.length,
            state = window.location.hash;

        // Maintain history and determine default fx            
        if (l === 0) {
            stateHistory.push(state);
            this.addRemovePages(deferred, page);
            return deferred.promise();
        }
        
        var defaultFx;
        
        if (state === stateHistory[l-2]) {
            stateHistory.pop();
            defaultFx = "slideFromLeft";
        } else {
            stateHistory.push(state);
            defaultFx = "slideFromRight";
        }
        
        // 
        var fx = !effect ? defaultFx : effect;
        this.addRemovePages(deferred, page, fx);        
        return deferred.promise();

    }

    // Use this function directly if you want to control the sliding direction outside PageSlider
    this.addRemovePages = function(deferred, page, effect) {

        container.append(page);
        
        if (!currentPage) {
            page.attr("class", "page center");
            currentPage = page;
            return;
        }
        
        var fx = effects[effect];
        

        // Position the page at the starting position of the animation
        
        page.attr("class", "page " + fx[0]);
        //page.attr("class", "page " + "zoomedOut");

        currentPage.one('webkitTransitionEnd', function(e) {
            console.log('Removed');
            $(e.target).remove();
            deferred.resolve();
        });

        // Force reflow. More information here: http://www.phpied.com/rendering-repaint-reflowrelayout-restyle/
        container[0].offsetWidth;

        // Position the new page and the current page at the ending position of their animation with a transition class indicating the duration of the animation
        
        page.attr("class", "page transition "+fx[1]);
        currentPage.attr("class", "page transition " + fx[2]);        
        //page.attr("class", "page transition zoomNormal");
        //currentPage.attr("class", "page transition zoomNormal2");        
        
        currentPage = page;
    }

}