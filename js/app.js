// We use an "Immediate Function" to initialize the application to avoid leaving anything behind in the global scope
(function () {

    /* Debug */
    
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

        mylentView.isOnline = DataService.prototype.isOnline;
        mylentView.isTodayHasCross = isTodayHasCross;
        mylentView.isDisplayEncouragement = isThisWeek && !isTodayHasCross;
        return mylentView;
    }
    
    var gotoHomeScreen = function(){
        var thisWeekN = userService.getWeekNOfToday();
        var mylentView = makeMylentView(thisWeekN);
        slider.newPage(mylentView.render().$el);    
    };
    
    var networkError = function(){
        alert('Err: Please ensure you are online and try again.');
    }
    
    var thisPartOfInitWorksOnThePCAlso = function(){
        
        var firstLoad = true;        
        router.addRoute('', function() {
            // very first time show splash screen
            if (firstLoad){
                // Show splash screen 
                slider.newPage(new SplashScreenView().render().$el);    
                firstLoad = false;
            } else {
                DataService.prototype.getUserData();
                gotoHomeScreen();
            }
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

        router.addRoute('ididit/:cross_idx', function(cross_idx) {
            cross_idx = parseInt(cross_idx);
                                
            DataService.prototype.putCross(userService.getDaySeqOfToday(), cross_idx).then(
                function(){
                    DataService.prototype.getUserData().then(
                        function(){
                            console.log('Userdata after put cross');
                            console.log(DataService.prototype.userData);
                            var cloudsView = new CloudsView();
                            cloudsView.message = cardService.getThankyouMessage();
                            var $el = cloudsView.render().$el;
                            
                            var userCrossCount = userService.getCrossCountUser();
                            var communityCrossCount = userService.getCommunityCount();
                            
                            $('.nummycrosses', $el).html(userCrossCount-1);
                            $('.numclasscrosses', $el).html(communityCrossCount-1);
                            
                            $('.sun',$el).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){                    
                                    $('.nummycrosses', $el).html(userCrossCount);                                            
                                    $('.numclasscrosses', $el).html(communityCrossCount);
                            
                                Animate.prototype.animateNow($('.numcrosses', $el),'bounceIn').done(function(){
                                    $('.bar','.page').css('visibility','visible');
                                });
                            });
                            
                            slider.newPage($el, "zoom");
                            
                        },
                        networkError
                    );
                },
                networkError
            );

        });
                    
        router.start();
                
        // Test the local notification
        window.plugin.notification.local.add({
            id:         1,
            message:    'I love BlackBerry!',
            json:       JSON.stringify({ test: 123 })
        });

        window.plugin.notification.local.onclick = function (id, state, json) {
            console.log(id +","+ json);
            alert(id +","+ json);
        }
        
        // TODO: For debug only
        DataService.prototype.uid = 1; // device.uuid
        
        // First check if user exist
        DataService.prototype.isUserExist().then(
            function(isExist){
                if (!isExist){
                    // continue
                } else {
                    DataService.prototype.initializeOnStartUp().then(
                        function(){
                            gotoHomeScreen();
                        },
                        networkError
                    );        
                }
            },
            networkError
        );
        

    }
    
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
                    "Lent", // title
                    'OK'        // buttonName
                );
            };
        }
        
        var uid = device.uuid;
        thisPartOfInitWorksOnThePCAlso();
        
    }, false);
    
    $(document).ready(function(){        
        thisPartOfInitWorksOnThePCAlso();
    });
    
    $(document).on("custom_event_community_count", function(){
        console.log('Event received');
    });
    /* ---------------------------------- Local Functions ---------------------------------- */

}());