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

// Set during initialization
DataService.prototype.filename;

// Pulled in by the service
// The community code will be default
DataService.prototype.userData = { 'crossesByDay' : undefined, 'communitycode': undefined, 'communitycount': undefined, 'firstname' : undefined, 'remindertime': undefined };

// Static
DataService.prototype.contentData = {
    "mylentcard_styles" : [
        'mylent_content_style_1'
    ],
    "crosses" : [
        {"pic":"red", "virtue":"kind", "cross_heading":"Green cross", "cross_text":"I said an extra prayer."},
        {"pic":"blue", "virtue":"humble", "cross_heading":"Red cross", "cross_text":"I did something good that was hard for me to do."},
        {"pic":"orange", "virtue":"humble", "cross_heading":"Red cross", "cross_text":"I did something good that was hard for me to do."},
        {"pic":"khaki", "virtue":"humble", "cross_heading":"Red cross", "cross_text":"I did something good that was hard for me to do."}
    ],
}

// done or reject
DataService.prototype.initializeOnStartUp = function(){
    var deferred = $.Deferred();       
    
    Dataservice.prototype.filename = cordova.file.dataDirectory + "data.txt";
    DataService.prototype.getUserData().then(
        function(){
            deferred.resolve();        
        },
        function(){
            deferred.reject();
        }
    );
    return deferred.promise();    
}

DataService.prototype.getUserData = function(){
    var deferred = $.Deferred();
    FSWrapper.prototype.read(DataService.prototype.filename, function(json, err){
        if (json == null){
            deferred.reject(err);
        } else {
            var data = JSON.parse(json);
            DataService.prototype.userData['crossesByDay'] = data['crossesByDay'];
            DataService.prototype.userData['firstname'] = data['firstname'];
            DataService.prototype.userData['communitycode'] = data['communitycode'];
            DataService.prototype.userData['communitycount'] = data['communitycount'];
            DataService.prototype.userData['remindertime'] = data['remindertime'];
            deferred.resolve();
        }
    });            
    return deferred.promise();
}

DataService.prototype.putCross = function(dayseq, crossid){
    DataService.prototype.userData['crossesByDay'][dayseq] = crossid;    
    return DataService.prototype.utilWriteUserDataToFile();
}

DataService.prototype.isUserExist = function(){
    var deferred = $.Deferred();

    FSWrapper.prototype.getFile(DataService.prototype.filename, function(fileEntry, err){
        if (fileEntry == null){
            deferred.resolve(false);
        } else {
            deferred.resolve(true);
        }
    });
        
    return deferred.promise();

}

DataService.prototype.createNewUserAndAddToCommunity = function(firstname, remindertime){
    return DataService.prototype.updateUserSettings(firstname, remindertime);
}

DataService.prototype.updateUserSettings = function(firstname, remindertime){
    DataService.prototype.userData['firstname'] = firstname;
    DataService.prototype.userData['remindertime'] = remindertime;
    return DataService.prototype.utilWriteUserDataToFile();            
}

DataService.prototype.utilWriteUserDataToFile = function(){
    var deferred = $.Deferred();    

    FSWrapper.prototype.write(DataService.prototype.filename, DataService.prototype.userData, function(evt, err){
        if (evt == null){
            deferred.reject(err);
        } else {
            deferred.resolve();
        }
    });
    
    return deferred.promise();    
}