var UserService = function(){  

    var start_time = new Date("Feb 18 2015 00:00:00");
    var end_time = new Date("Apr 4 2015 23:59:59"); 
    
    this.getToday = function(){
        return new Date("3/19/2015");
    }    
    
    this.getName = function(){
        return "Jobin";
    }
    
    this.isTodayBeforeLent = function(){
        var today = this.getToday();
        return (today.getTime() < start_time.getTime());
    }
    
    this.isTodayAfterLent = function(){
        var today = this.getToday();
        return (today.getTime() > end_time.getTime());
    }
    
    this.getWeekNOfToday = function(){
        if (!this.isTodayInLentSeason()) return;
        var today = this.getDaySeqOfToday();        
        // assumes maximum 7 weeks in lent
        for (var weekn = 0; weekn < 7; weekn++){
            var week = this.getDaysOfWeek(weekn);
            for (var i = 0; i < week.length; i++){
                if(week[i] == today) return weekn;
            }
        }
    }
    
    /*this.isTodayInWeekN = function(week_n){
        var daysOfWeek = this.getDaysOfWeek(week_n);
        var day_seq = this.getDaySeqOfToday();
        for (var i = 0; i < daysOfWeek.length; i++){
            if (day_seq == daysOfWeek[i]) return true;
        }
        return false;
    }
    */
    
    this.getDaysOfWeek = function(week_n){
        if (week_n == 0){
            return [0, 1, 2, 3];
        }
        if (week_n == 6)
            return [39, 40, 41, 42, 43, 44, 45];            
        if (week_n > 6) return;
        var start = 7*week_n - 3;
        var days = new Array();
        for (var i = 0; i < 7; i++){
            days.push(start+i);
        }
        return days;
    }
    
    this.getDaySeqOfToday = function(){
        var today = this.getToday();

        var day_seq = undefined;
        
        // specific to this lent period - Feb 18 to Apr 4 (2015)
        if (today.getMonth() == start_time.getMonth()){
            day_seq = today.getDate() - 18;
        } else if (today.getMonth() == start_time.getMonth() + 1){
            day_seq = 10 + today.getDate();        
        } else if (today.getMonth() == start_time.getMonth() + 2){
            day_seq = 41 + start_time.getDate();
        }        

        return day_seq;
    }
    
    this.isTodayInLentSeason = function(){
        var day_seq = this.getDaySeqOfToday();
        if (day_seq < 0 || day_seq >= 46){
            console.log('Day not in lenten season');
            return false;
        } else {
            return true;
        }        
    }
    
    this.isTodayHasCross = function(){
        var day_seq = this.getDaySeqOfToday();
        return (this.getCrossesByDay()[day_seq] != undefined);
    }
    
    this.getCrossesCountByType = function(){
        var crossesByDay = this.getCrossesByDay();
        var crossesCount = {};
        for (var i = 0; i < crossesByDay.length; i++){
            var cross = crossesByDay[i];
            if (cross != undefined){
                if(crossesCount[cross]){
                    crossesCount[cross]++;
                } else {
                    crossesCount[cross]=1;
                }
            }
        }
        return crossesCount;
    }
    this.getCrossesByDay = function(){
        return UserService.prototype.crossesByDay;
    }  
    
}

UserService.prototype.crossesByDay;

(function(){
    var oneOrZero = function(){
        if (Math.random() < 0.5){
            return 0;
        } else {
            return 1;
        }
    }

    UserService.prototype.crossesByDay = new Array(46);
    for (var i = 0; i < 46; i++){
        var oneOrTwo = Math.floor((Math.random() * 2) + 1);
        if (oneOrTwo == 1){
            UserService.prototype.crossesByDay[i] = undefined;
        } else {
            UserService.prototype.crossesByDay[i] = Math.floor((Math.random() * 2) + 1) - 1;
        }
    }
    console.log('Initialized crossesByDay');
    console.log(UserService.prototype.crossesByDay);
    
})();