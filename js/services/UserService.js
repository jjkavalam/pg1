var UserService = function(){  

    var start_time = new Date("Feb 18 2015 00:00:00");
    var end_time = new Date("Apr 4 2015 23:59:59"); 

    this.getToday = function(){
        return new Date();
    }    
    
    this.getName = function(){
        return DataService.prototype.userData['firstname'];;
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
    
    this.getCalendarOfLent = function(){
        // 46 days starting from start date till end date
        var cal = new Array();
        var t = start_time;        
        for (var i = 0; i < 46; i++){
            var date = t.getDate()+"";
            date = date.length == 1 ? "0"+date : date;
            cal.push(
                {
                    cal_day : UserService.prototype.cal_days[t.getDay()],
                    cal_date : date + " " + UserService.prototype.cal_months[t.getMonth()],
                }
                );
            t = new Date(t.getTime()+86400000);
        }
        return cal;
    }
    
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
        return (this.getCrossesByDay()[day_seq] != -1);
    }
    
    this.getCrossesCountByType = function(){
        var crossesByDay = this.getCrossesByDay();
        var crossesCount = {};
        for (var i = 0; i < crossesByDay.length; i++){
            var cross = crossesByDay[i];
            if (cross != -1){
                if(crossesCount[cross]){
                    crossesCount[cross]++;
                } else {
                    crossesCount[cross]=1;
                }
            }
        }
        return crossesCount;
    }
    this.getCrossCountUser = function(){
        var crossesByDay = this.getCrossesByDay();
        var crossesCount = 0;
        for (var i = 0; i < crossesByDay.length; i++){
            if (crossesByDay[i] != -1){
                crossesCount++;
            }
        }
        return crossesCount;    
    }
    this.getCommunityCount = function(){
        return DataService.prototype.userData['communitycount'];
    }
    this.getCrossesByDay = function(){
        return DataService.prototype.userData['crossesByDay'];
    }  
    
}

DataService.prototype.userData['crossesByDay'];
DataService.prototype.userData['deviceID'];
DataService.prototype.userData['classID'];
DataService.prototype.userData['firstname'];

UserService.prototype.cal_days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
UserService.prototype.cal_months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

(function(){
    console.log('Remove this return statement to automatically generate the cross array for test');
    return;
    var oneOrZero = function(){
        if (Math.random() < 0.5){
            return 0;
        } else {
            return 1;
        }
    }

    DataService.prototype.userData['crossesByDay'] = new Array(46);
    for (var i = 0; i < 46; i++){
        var oneOrTwo = Math.floor((Math.random() * 2) + 1);
        if (oneOrTwo == 1){
            DataService.prototype.userData['crossesByDay'][i] = -1;
        } else {
            DataService.prototype.userData['crossesByDay'][i] = Math.floor((Math.random() * 2) + 1) - 1;
        }
    }
    console.log('Initialized crossesByDay');
    console.log(DataService.prototype.userData['crossesByDay']);
    
})();