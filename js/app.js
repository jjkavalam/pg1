// We use an "Immediate Function" to initialize the application to avoid leaving anything behind in the global scope
(function () {

    /* ---------------------------------- Local Variables ---------------------------------- */
    HomeView.prototype.template = Handlebars.compile($("#home-tpl").html());
    EmployeeListView.prototype.template = Handlebars.compile($("#employee-list-tpl").html());
    EmployeeView.prototype.template = Handlebars.compile($("#employee-tpl").html());
    CrossesView.prototype.template = Handlebars.compile($("#crosses-tpl").html());

    var voteService = new VoteService();
    var service = new EmployeeService();    
    var slider = new PageSlider($('body'));
  
    var makeEmployeeView = function(id){
        console.log('make Employee view ');
        var employee = service.findByIdSync(parseInt(id));
        var numvotes = voteService.getNumVotesById(parseInt(id));
        if (numvotes == undefined) numvotes = 0;
        return new EmployeeView(employee, numvotes);                        
    };
                    
    voteService.initialize().done(function(){
    
        service.initialize().done(function () {
            router.addRoute('', function() {
                console.log('empty');
                slider.slidePage(new HomeView(service).render().$el);
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