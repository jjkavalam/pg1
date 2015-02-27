var DataService = function(){
}

// Set during initialization
DataService.prototype.filename = "data5.txt";

// Pulled in by the service
// The community code will be default
DataService.prototype.userData = { 'crossesByDay' : [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1], 'firstname' : undefined, 'remindertime': undefined };

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
}

DataService.prototype.getUserData = function(){
    var deferred = $.Deferred();
    FSWrapper.prototype.read(DataService.prototype.filename, function(json, err){
        if (json == null){
            deferred.reject(err);
        } else {
            console.log('getUserData: json='+json);
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
            console.log('isFileExists=true, arg='+arg);
            deferred.resolve(true);
        } else {
            console.log('isFileExists=false, arg='+arg);
            deferred.resolve(false);
        }
    });
        
    return deferred.promise();

}

DataService.prototype.createNewUser = function(firstname, remindertime){
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