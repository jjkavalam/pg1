var DataService = function(){
    // Get content and user data from the web on load
    // Show loader till initialize is complete
        
    // Perform periodic updates of cotent (5 min)
    // User data (5s)    
    // download and update no matter what
    
    // trigger newcross event if requried
    
    // update user data upon 'I did this'
    
    // when fail to contact server
    // -- if its on startup fail the app
    // -- 'I did this' : complete server transaction before showing victory screen, show 'try again' message if failed
    // -- All other times, simply ignore (but show a warning notification)
    
    // employees = JSON.parse(window.localStorage.getItem("employees"));
    // window.localStorage.setItem("employees", JSON.stringify(employees));    
    
}

DataService.prototype.onlineStatusCallback = function(isOnline){
    console.log('Online status :'+isOnline);
};

DataService.prototype.userData = { 'crossesByDay' : [], 'deviceID' : undefined, 'classID': undefined };
DataService.prototype.contentData = {
    "mylentcard_styles" : [
        'mylent_content_style_1'
    ],
    "crosses" : [
        {"pic":"red", "virtue":"kind", "cross_heading":"Green cross", "cross_text":"I said an extra prayer."},
        {"pic":"blue", "virtue":"humble", "cross_heading":"Red cross", "cross_text":"I did something good that was hard for me to do."}
    ],
}

// done or reject
DataService.prototype.initializeOnStartUp = function(){
    var deferred = $.Deferred();
    // load data and setTimeout for periodic updates
    DataService.prototype.getUserData().then(
        function(){
            DataService.prototype.getContentData().then(
                function(){
                    // setTimeouts
                    setInterval(DataService.prototype.getContentData, 12*1000);
                    setInterval(function(){
                        DataService.prototype.getUserData().done(
                            function(){
                                console.log('Check if the data has changed');
                                console.log(DataService.prototype.userData);
                            }
                        );
                    }, 4*1000);
                    deferred.resolve();
                },
                function(){
                    deferred.reject();
                }
            );
        },        
        function(){
            deferred.reject();
        }
    );

    console.log('Initializing ...');
    return deferred.promise();
    
}

DataService.prototype.getUserData = function(){
    var deferred = $.Deferred();
        
    $.ajax({
            url: "http://www.rediscoverkerala.com/lent/userData.php",
            success: function(data, type){
                console.log(data);
                DataService.prototype.userData = data;
                DataService.prototype.onlineStatusCallback(true);
                console.log('userdata refreshed');
                deferred.resolve();
            },
            error: function(xhr,status,error){
                console.log("[ERROR] User data Request failed");
                DataService.prototype.onlineStatusCallback(false);
                console.log(xhr);
                console.log(status);
                console.log(error);
                deferred.reject();
            }
    });
        
    return deferred.promise();
}
DataService.prototype.getContentData = function(){
    var deferred = $.Deferred();
        
    $.ajax({
            url: "http://www.rediscoverkerala.com/lent/contentData.php",
            success: function(data, type){
                console.log(data);
                DataService.prototype.contentData = data;
                DataService.prototype.onlineStatusCallback(true);
                console.log('content data refreshed');
                deferred.resolve();
            },
            error: function(xhr,status,error){
                console.log("[ERROR] Content data Request failed");
                DataService.prototype.onlineStatusCallback(false);
                console.log(xhr);
                console.log(status);
                console.log(error);
                deferred.reject();
            }
    });
        
    return deferred.promise();
}

DataService.prototype.updateUserData = function(){
    var deferred = $.Deferred();
        
    $.ajax({
            url: "http://www.rediscoverkerala.com/lent/updateUserData.php",
            data: JSON.stringify(DataService.prototype.userData),
            success: function(){
                DataService.prototype.onlineStatusCallback(true);
                console.log('updateUserData completed with success');
                deferred.resolve();
            },
            error: function(xhr,status,error){
                console.log("[ERROR] User data update failed");
                DataService.prototype.onlineStatusCallback(false);
                console.log(xhr);
                console.log(status);
                console.log(error);
                deferred.reject();
            }
    });
        
    return deferred.promise();

}