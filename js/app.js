// We use an "Immediate Function" to initialize the application to avoid leaving anything behind in the global scope
(function () {

    /* ---------------------------------- Local Variables ---------------------------------- */
    CrossesView.prototype.template = Handlebars.compile($("#crosses-tpl").html());
    
    var voteService = new VoteService();
    var service = new EmployeeService();    
    var cardService = new CardService();
    var userService = new UserService();
    
    var slider = new PageSlider($('body'));
  
    var makeEmployeeView = function(id){
        console.log('make Employee view ');
        var employee = service.findByIdSync(parseInt(id));
        var numvotes = voteService.getNumVotesById(parseInt(id));
        if (numvotes == undefined) numvotes = 0;
        return new EmployeeView(employee, numvotes);                        
    };
    
    var LAST_WEEK = 6;
    
    var makeMylentView = function(week_n){
        console.log('makeMylentView'+week_n);
    
        var weeknToday = userService.getWeekNOfToday();
        var isTodayHasCross = userService.isTodayHasCross();
        var isThisWeek = (weeknToday == week_n);       
    
        var mylentView = new MylentView();
        mylentView.isDisplayPrevWeekButton = (week_n > 0);
        mylentView.isDisplayNextWeekButton = (week_n < LAST_WEEK) && (week_n < weeknToday);
        mylentView.weekNumber = week_n+1;
        mylentView.cards = cardService.getMylentCardsForWeek(week_n);
                
        mylentView.isTodayHasCross = isTodayHasCross;
        mylentView.isDisplayEncouragement = isThisWeek && !isTodayHasCross;
        return mylentView;
    }
    
    
    voteService.initialize().done(function(){
    
        service.initialize().done(function () {
            router.addRoute('', function() {
                console.log('mylentview');
                var thisWeekN = userService.getWeekNOfToday();
                var mylentView = makeMylentView(thisWeekN);
                slider.newPage(mylentView.render().$el);
            });

            router.addRoute('mylent/:week_n/:fx', function(weekExpr, transitionFx){
                console.log('mylent'+transitionFx);
                var week_n = eval(weekExpr)-1;
                var mylentView = makeMylentView(eval(week_n));
                slider.newPage(mylentView.render().$el, transitionFx);
            });
            
            router.addRoute('addmycross', function() {
                console.log('addmycross');
                var crossesView = new CrossesView();
                crossesView.cards = cardService.getAddmycrossCards();
                slider.newPage(crossesView.render().$el,"zoom");
            });
            
            router.addRoute('crosses_close', function() {
                console.log('crosses_close');
                slider.newPage(new HomeView(service).render().$el);
            });
            
            router.addRoute('employees/:id', function(id) {
                slider.newPage(makeEmployeeView(id).render().$el);
            });

            router.addRoute('ididit/:cross_idx', function(cross_idx) {
                //voteService.updateVotesOfId(id, parseInt(current_votes)+1);
                cross_idx = parseInt(cross_idx);
                //userService.registerTodaysCross(cross_idx);
                Animate.prototype.animateNow($('.cross_'+cross_idx),'bounceIn').done(function(){
                    //slider.replaceCurrentPage(makeEmployeeView(id).render().$el);
                });                                
            });
                        
            router.start();
        });
    
    });

    /* --------------------------------- Event Registration -------------------------------- */
    document.addEventListener('deviceready', function () {
        StatusBar.overlaysWebView( false );
        StatusBar.backgroundColorByHexString('#ffffff');
        StatusBar.styleDefault();
        FastClick.attach(document.body);
        if (navigator.notification) { // Override default HTML alert with native dialog
            window.alert = function (message) {
                navigator.notification.alert(
                    message,    // message
                    null,       // callback
                    "Workshop", // title
                    'OK'        // buttonName
                );
            };
        }
                        
    }, false);
    $(document).ready(function(){
                //
    });
    /* ---------------------------------- Local Functions ---------------------------------- */

}());