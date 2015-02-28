var DataService = function(){
}

// Set during initialization
DataService.prototype.filename = "userdata.txt";

// Pulled in by the service
// The community code will be default
DataService.prototype.userData = { 'crossesByDay' : [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1], 'firstname' : undefined, 'remindertime': undefined };

// Static
DataService.prototype.contentData = {
    "mylentcard_styles" : [
        'mylent_content_style_1'
    ],
    "crosses" : [
        {"pic":"orange", "virtue":"practices fortitude", "cross_heading":"Orange cross", "cross_text":"I did something good that was hard for me to do."},
        {"pic":"Indigo", "virtue":"is diligent", "cross_heading":"Indigo cross", "cross_text":"I sacrificed something for my fellow beings... I stopped being lavish..."},
        {"pic":"Khaki", "virtue":"is forgiving", "cross_heading":"Khaki cross", "cross_text":"I compensated for someone else's shortcoming and didn't murmur"},
        {"pic":"Crimson", "virtue":"is humble", "cross_heading":"Crimson cross", "cross_text":"I said thank you for the blessings given to others, especially those I was tempted to envy"},
        {"pic":"Green", "virtue":"is Joyful", "cross_heading":"Green cross", "cross_text":"I smiled at a stranger and tried to spread a smile around me"},
        {"pic":"Blue", "virtue":"is kind", "cross_heading":"Blue cross", "cross_text":"I prayed for someone who has hurt me or whom I have hurt"},
        {"pic":"Blue", "virtue":"is kind", "cross_heading":"Blue cross", "cross_text":"I said sorry to someone I have offended or forgave someone today"},
        {"pic":"Red", "virtue":"is loving", "cross_heading":"Red cross", "cross_text":"I wished / kissed / hugged my parents and siblings"},
        {"pic":"Gold", "virtue":"is prayerful", "cross_heading":"Gold cross", "cross_text":"I went for weekday mass"},
        {"pic":"Gold", "virtue":"is prayerful", "cross_heading":"Gold cross", "cross_text":"I prayed a decade of rosary"},
        {"pic":"Gold", "virtue":"is prayerful", "cross_heading":"Gold cross", "cross_text":"I did something to remember/reflect on the Passion/Jesus' suffering"},
        {"pic":"Gold", "virtue":"is prayerful", "cross_heading":"Gold cross", "cross_text":"I said small prayers while travelling"},
        {"pic":"Gold", "virtue":"is prayerful", "cross_heading":"Gold cross", "cross_text":"I found time for reflection today and increased my quiet time with God"},
        {"pic":"Pink", "virtue":"loves the Bible", "cross_heading":"Pink cross", "cross_text":"I read some specific verses/chapters/passages of the Bible and committed it to memory"},
        {"pic":"Brown", "virtue":"practices charity", "cross_heading":"Brown cross", "cross_text":"I prayed for my friend"},
        {"pic":"Brown", "virtue":"practices charity", "cross_heading":"Brown cross", "cross_text":"I gave a lending ear to a friend"},
        {"pic":"Orange", "virtue":"practices fortitude", "cross_heading":"Orange cross", "cross_text":"I stopped myself from doing something that was bad... which I would have done out of my habit..."},
        {"pic":"Purple", "virtue":"practices temperance", "cross_heading":"Purple cross", "cross_text":"I decreased the amount of my favourite food"},
        {"pic":"Purple", "virtue":"practices temperance", "cross_heading":"Purple cross", "cross_text":"I limited my media involvement"},
        {"pic":"Gold", "virtue":"practices temperance", "cross_heading":"Gold cross", "cross_text":"I consciously checked any offensive words"},
        {"pic":"Olive", "virtue":"strives for purity", "cross_heading":"Olive cross", "cross_text":"I examine my conscience and went for Confession"},
        {"pic":"Olive", "virtue":"strives for purity", "cross_heading":"Olive cross", "cross_text":"I tried not to sin or fall to temptation"},
        {"pic":"Violet", "virtue":"trusts in Jesus", "cross_heading":"Violet cross", "cross_text":"I said “Thank You Jesus” even when it didn't go as I planned"}        
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