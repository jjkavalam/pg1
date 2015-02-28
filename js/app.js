// We use an "Immediate Function" to initialize the application to avoid leaving anything behind in the global scope
(function () {

    var debug = false;
   
    /* ---------------------------------- Local Variables ---------------------------------- */    
    var cardService = new CardService();
    var userService = new UserService();
    
    var slider = new PageSlider($('body'));
      
    var LAST_WEEK = 6;
    
    var makeMylentView = function(week_n){
        console.log('makeMylentView'+week_n);
    
        var weeknToday = userService.getWeekNOfToday();
        var isTodayHasCross = userService.isTodayHasCross();
        if (debug) isTodayHasCross = false;
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
    
    var gotoHomeScreen = function(){
        var thisWeekN = userService.getWeekNOfToday();
        var mylentView = makeMylentView(thisWeekN);
        slider.newPage(mylentView.render().$el);    
    };
    
    var fileError = function(){
        alert('File error.');
    }    
    var utilSetAlarms = function(timestamp){
        window.plugin.notification.local.cancelAll();
        var notificationId = 0;
        var end_time = new Date("Apr 4 2015 23:59:59");                             
        if (false){
        while(timestamp < end_time){
            
            notificationId++;
            window.plugin.notification.local.add({
                id: notificationId,
                title: 'Lent',
                date: timestamp,
                message: 'Dont forget todays cross',
            });
            
            timestamp = new Date(timestamp.getTime()+(24*3600*1000));
        }     
        } else {
            for (var i = 0; i < 4; i++){
                notificationId++;
                window.plugin.notification.local.add({
                    id: notificationId,
                    title: 'Lent',
                    date: timestamp,
                    message: 'Dont forget todays cross',
                });
                
                timestamp = new Date(timestamp.getTime()+(5*1000));
            
            }        
        }
    }                            

    
    var initApp = function(){
        
        var firstLoad = true;        
        router.addRoute('', function() {
            if (firstLoad){
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
                DataService.prototype.createNewUser(name, remindertime).then(
                    function(){
                        
                        if (!debug){
                            // add notifications from now till end of lent
                            utilSetAlarms(timestamp);
                        }
                    
                        alert('Welcome '+name);

                        // reload page
                        window.location.href='';

                    },
                    fileError
                );            
            } else {    
            
                var isDontShowReminder = parseInt($("#input_remindertime").val()) == -1;
                if (isDontShowReminder){
                    if (!debug)
                    window.plugin.notification.local.cancelAll();
                    alert('Settings updated');                        

                    // reload page
                    window.location.href='';
                    
                } else {
            
                    DataService.prototype.updateUserSettings(name, remindertime).then(
                        function(){
                            if (!debug){
                                utilSetAlarms(timestamp);
                            }
                        
                            alert('Settings updated');                        

                            // reload page
                            window.location.href='';
                        },
                        fileError                
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

        router.addRoute('homescreen', function() {
            gotoHomeScreen();
        });
        
        router.addRoute('help', function() {
            console.log('help');
            slider.newPage(new HelpScreenView().render().$el);
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
            gotoHomeScreen();
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
                            
                            $('.nummycrosses', $el).html(userCrossCount-1);
                            
                            $('.sun',$el).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){                    
                                    $('.nummycrosses', $el).html(userCrossCount);                                                                        
                                Animate.prototype.animateNow($('.numcrosses', $el),'bounceIn').done(function(){
                                    $('.bar','.page').css('visibility','visible');
                                });
                            });
                            
                            slider.newPage($el, "zoom");
                            
                        },
                        fileError
                    );
                },
                fileError
            );

        });
                    
        router.start();
        
        DataService.prototype.initializeOnStartUp();
        
        DataService.prototype.isUserExist().then(
            function(isExist){
                if (!isExist){                
                    slider.newPage(new NewUserView().render(true).$el);
                } else {
                    DataService.prototype.getUserData().then(
                        function(){
                            gotoHomeScreen();
                        },
                        fileError
                    );        
                }
            },
            fileError
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
        
        initApp();
        
    }, false);

    //if (debug) $(document).ready(function(){initApp();});    

}());