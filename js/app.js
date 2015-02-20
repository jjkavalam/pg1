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
        
        router.addRoute('show_settings', function(){
            slider.newPage(new NewUserView().render(false).$el).done(
                function(){
                    ($(".input_name",".page")[0]).value = DataService.prototype.userData['firstname'];   
                    ($(".input_remindertime",".page")[0]).value = DataService.prototype.userData['remindertime'];               
                }
            );
            
            // load existing settings into the view
            
        });
        
        router.addRoute('settings/:isNewUserMode/:random', function(isNewUserMode, rnd) {
        
            // change the href so that clicking the link with trigger this action again
            isNewUserMode = eval(isNewUserMode);
            console.log('isNewUserMode='+isNewUserMode);
            
            var rand = new Date().getTime();            
            var newhref = ($(".settingsdone",".page")[0]).href.replace(/#settings.*/,'') + '#settings/' +isNewUserMode+'/'+rand;
            $(".settingsdone",".page").attr('href',newhref);
                        
            var name = ($(".input_name",".page")[0]).value;   
            var remindertime = ($(".input_remindertime",".page")[0]).value;
            var remindertime_minute = ($(".input_remindertime_minute",".page")[0]).value;

            var minutes = (remindertime_minute == undefined || remindertime_minute.length == 0) ? 0 : parseInt(remindertime_minute);
            
            // find the timestamp of the next immediate alarm time
            var timestamp = new Date(1424188800000 + parseInt(remindertime)*(1000*3600) + minutes*60*1000);
            var now = new Date();
            while(timestamp < now){
                timestamp = new Date(timestamp.getTime()+(24*3600*1000));
            }
            
            if (name == undefined || name.length == 0){
                alert('Please enter your name');
                return;
            }
                                    
            if (isNewUserMode){
                DataService.prototype.createNewUserAndAddToCommunity(name, remindertime).then(                
                    function(){

                        window.plugin.notification.local.add({
                            id: 1,
                            title: 'Lent',
                            date: timestamp,
                            message: 'Dont forget todays cross',
                            repeat: 'minutely',                        
                        });
                    
                        alert('Welcome '+name);

                        // reload page
                        window.location.href='';

                    },
                    networkError
                );            
            } else {    
            
                var isDontShowReminder = ($("#dont_show_reminder")[0]).checked;
                if (isDontShowReminder){
                    window.plugin.notification.local.cancelAll();
                    alert('Settings updated');                        

                    // reload page
                    window.location.href='';
                    
                } else {
            
                    DataService.prototype.updateUserSettings(name, remindertime).then(
                        function(){
                            window.plugin.notification.local.add({
                                id: 1,
                                title: 'Lent',
                                date: timestamp,
                                message: 'Dont forget todays cross',
                                repeat: 'minutely',                        
                            });
                        
                            alert('Settings updated');                        

                            // reload page
                            window.location.href='';
                        },
                        networkError                
                    );
                    
                }
            }

        });
        
        router.addRoute('mylent/:week_n/:fx', function(weekExpr, transitionFx){
            console.log('mylent'+transitionFx);
            var week_n = eval(weekExpr)-1;
            var mylentView = makeMylentView(eval(week_n));
            slider.newPage(mylentView.render().$el, transitionFx);
        });
        
        router.addRoute('settime/:time', function(time) {
            console.log('settime'+time);
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
                        
        DataService.prototype.uid = device.uuid;
        
        DataService.prototype.isUserExist().then(
            function(isExist){
                if (!isExist){                
                    slider.newPage(new NewUserView().render(true).$el);
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
        
        //var uid = device.uuid;
        thisPartOfInitWorksOnThePCAlso();
        
    }, false);

    //$(document).ready(function(){thisPartOfInitWorksOnThePCAlso();});
    $(document).on("custom_event_community_count", function(){
        console.log('Event received');
    });
    /* ---------------------------------- Local Functions ---------------------------------- */

}());