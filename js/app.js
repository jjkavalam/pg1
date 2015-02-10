// We use an "Immediate Function" to initialize the application to avoid leaving anything behind in the global scope
(function () {

    /* ---------------------------------- Local Variables ---------------------------------- */
    CrossesView.prototype.template = Handlebars.compile($("#crosses-tpl").html());
    
    var voteService = new VoteService();
    var service = new EmployeeService();    
    var cardService = new CardService();
    
    var slider = new PageSlider($('body'));
  
    var makeEmployeeView = function(id){
        console.log('make Employee view ');
        var employee = service.findByIdSync(parseInt(id));
        var numvotes = voteService.getNumVotesById(parseInt(id));
        if (numvotes == undefined) numvotes = 0;
        return new EmployeeView(employee, numvotes);                        
    };
    
    var LAST_WEEK = 6;
    
    var makeMylentView = function(week_n, isThisWeek){
        console.log('makeMylentView'+week_n);
    
        var mylentView = new MylentView();
        mylentView.isDisplayPrevWeekButton = (week_n > 0);
        mylentView.isDisplayNextWeekButton = (week_n < LAST_WEEK);
        mylentView.weekNumber = week_n+1;
        mylentView.cards = cardService.getMylentCardsForWeek(week_n);
        mylentView.isDisplayTodaysCross = isThisWeek;                
        return mylentView;
    }
    
    
    voteService.initialize().done(function(){
    
        service.initialize().done(function () {
            router.addRoute('', function() {
                console.log('mylentview');
                var mylentView = makeMylentView(5, true);
                slider.slidePage(mylentView.render().$el);
            });

            router.addRoute('mylent/:week_n/:direction', function(weekExpr, direction){
                console.log('mylent');
                var week_n = eval(weekExpr)-1;
                var mylentView = makeMylentView(eval(week_n), true);
                slider.slidePageFrom(mylentView.render().$el, direction);
            });
            
            router.addRoute('addmycross', function() {
                console.log('addmycross');
                slider.slidePage(new CrossesView().render().$el);
            });
            
            router.addRoute('crosses_close', function() {
                console.log('crosses_close');
                slider.slidePage(new HomeView(service).render().$el);
            });
            
            router.addRoute('employees/:id', function(id) {
                slider.slidePage(makeEmployeeView(id).render().$el);
            });

            router.addRoute('upvote/:id/:current_votes', function(id, current_votes) {
                voteService.updateVotesOfId(id, parseInt(current_votes)+1);
                Animate.prototype.animateNow($('.vote-text'),'flash').done(function(){
                    slider.replaceCurrentPage(makeEmployeeView(id).render().$el);
                });                                
            });
            
            router.addRoute('downvote/:id/:current_votes', function(id, current_votes) {
                voteService.updateVotesOfId(id, parseInt(current_votes)-1);
                Animate.prototype.animateNow($('.vote-text'),'flash').done(function(){
                    slider.replaceCurrentPage(makeEmployeeView(id).render().$el);
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