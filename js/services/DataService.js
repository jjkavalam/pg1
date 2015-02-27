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
DataService.prototype.userData = { 'crossesByDay' : [-1,1,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1], 'firstname' : undefined, 'remindertime': undefined };

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
    DataService.prototype.filename = "data4.txt";
}

DataService.prototype.getUserData = function(){
    var deferred = $.Deferred();
    FSWrapper.prototype.read(DataService.prototype.filename, function(json, err){
        if (json == null){
            deferred.reject(err);
        } else {
            console.log(json);
            var data = JSON.parse(json);
            DataService.prototype.userData['crossesByDay'] = data['crossesByDay'];
            DataService.prototype.userData['firstname'] = data['firstname'];
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
    
    FSWrapper.prototype.isFileExists(DataService.prototype.filename, function(exists,arg){
        if (exists){
            console.log(arg);
            deferred.resolve(true);
        } else {
            console.log(arg);
            deferred.resolve(false);
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