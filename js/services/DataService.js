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
DataService.prototype.isOnline;
DataService.prototype.onlineStatusCallback = function(isOnline){
    if (isOnline != DataService.prototype.isOnline){
        console.log('online status changed to '+isOnline);
    }
    DataService.prototype.isOnline = isOnline;
    if (isOnline){
        $('.tab-label','.onlinestatusIndicator').html('Online').css('color','green');
        $('.icon','.onlinestatusIndicator').css('color','green');
    } else {
        $('.tab-label','.onlinestatusIndicator').html('Offline').css('color','red');
        $('.icon','.onlinestatusIndicator').css('color','red');   
    }
    
};

DataService.prototype.uid = undefined;
DataService.prototype.userData = { 'crossesByDay' : undefined, 'communitycode': undefined, 'communitycount': undefined, 'lastCommunitycount': undefined };

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
DataService.prototype.initializeOnStartUp = function(uid){
    var deferred = $.Deferred();    
    
    DataService.prototype.uid = 1; // device.uuid
    
    // load data and setTimeout for periodic updates
    DataService.prototype.getUserData().then(
        function(){
            DataService.prototype.getContentData().then(
                function(){
                    // setTimeouts
                    setInterval(DataService.prototype.getContentData, 60*1000);
                    setInterval(function(){
                        DataService.prototype.getCommunityCount().done(
                            function(){
                                if (DataService.prototype.userData['lastCommunitycount'] != DataService.prototype.userData['communitycount']){
                                    console.log('Community count has changed !!');
                                    DataService.prototype.userData['lastCommunitycount'] = DataService.prototype.userData['communitycount'];
                                    $(document).trigger("custom_event_community_count",[DataService.prototype.userData['communitycount']]);
                                }                                
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

DataService.prototype.getCommunityCount = function(){
    var deferred = $.Deferred();
    var communitycode = DataService.prototype.userData['communitycode'];
    
    $.ajax({
            url: "http://www.rediscoverkerala.com/lent/app.php?method=getCommunityCrossCount&communitycode="+communitycode,
            success: function(data, type){
                DataService.prototype.userData['communitycount'] = data['count'];
                DataService.prototype.onlineStatusCallback(true);
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

DataService.prototype.getUserData = function(){
    var deferred = $.Deferred();

    var uid = DataService.prototype.uid;
    
    $.ajax({
            url: "http://www.rediscoverkerala.com/lent/app.php?method=getUserData&uid="+uid,
            success: function(data, type){
                console.log(data);
                DataService.prototype.userData['crossesByDay'] = data['crossesByDay'];
                DataService.prototype.userData['communitycode'] = data['communitycode'];
                DataService.prototype.userData['communitycount'] = data['communitycount'];
                DataService.prototype.onlineStatusCallback(true);
                console.log('Userdata loaded.');
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
                console.log('Content data loaded');
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

DataService.prototype.putCross = function(dayseq, crossid){
    var deferred = $.Deferred();

    var uid = DataService.prototype.uid;
    
    $.ajax({
            url: "http://www.rediscoverkerala.com/lent/app.php?method=putCross&uid="+uid+"&dayseq="+dayseq+"&crossid="+crossid,
            success: function(result){
                console.log(result);
                console.log('updateUserData completed with success');                
                // Update local data also
                DataService.prototype.userData['crossesByDay'][dayseq] = crossid;
                DataService.prototype.onlineStatusCallback(true);
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