var CardService = function(){

    var userService = new UserService();
    
    //DataService.prototype.contentData;    
    
    this.getThankyouMessage = function(){
        return "Well done !";
    }
    
    this.getMylentCardsForWeek = function(week_n){
    
        var crossesByDay = userService.getCrossesByDay();
        
        // Filter out cross status data for the given week
        var daysOfWeek = userService.getDaysOfWeek(week_n);
        var crossesOfWeek = new Array();
        var day_seq = new Array();
        for (var i = 0; i < daysOfWeek.length; i++){
            var day = daysOfWeek[i];
            crossesOfWeek.push(crossesByDay[day]);
            day_seq.push(day+1);            
        }
        
        var lentCalendar = userService.getCalendarOfLent();
        
        // Prepare cards for days with cross
        var cards = new Array();
        for (var i = 0; i < daysOfWeek.length; i++){
            if (crossesOfWeek[i] != -1){
                var card = {};
                var crossId = crossesOfWeek[i];
                card.cross_pic = DataService.prototype.contentData["crosses"][crossId]["pic"];
                card.virtue = DataService.prototype.contentData["crosses"][crossId]["virtue"];
                card.day_seq = day_seq[i];
                var cal = lentCalendar[day_seq[i]-1];
                card.cal_date = cal.cal_date;
                card.cal_day = cal.cal_day;
                cards.push(card);
            }
        }

        // Apply random styles to the card
        for (var i = 0; i < cards.length; i++){
            cards[i].style_class = getRandomStyle();
        }
        
        // Add user's name to all cards
        var userName = userService.getName();
        for (var i = 0; i < cards.length; i++){
            var card = cards[i];
            card.userName = userName;
        }

        return cards;
    }
    
    var getRandomStyle = function(){
        var rnd = Math.floor((Math.random() * DataService.prototype.contentData["mylentcard_styles"].length));    
        return DataService.prototype.contentData["mylentcard_styles"][rnd];
    }
    
    this.getAddmycrossCards = function(){
        // Simply return the static content dictionary
        var cards = DataService.prototype.contentData["crosses"];
        
        // Add index as the cross idx
        for (var i = 0; i < cards.length; i++){
            cards[i].cross_idx = i;
        }
                
        var crossesCountByType = userService.getCrossesCountByType();
        console.log(crossesCountByType);
        for (var i = 0; i < cards.length; i++){
            cards[i].crosses_so_far = crossesCountByType[i] ? crossesCountByType[i] : 0;
        }        
        
        // Apply random styles to the card        
        for (var i = 0; i < cards.length; i++){
            cards[i].style_class = getRandomStyle();
        }
        
        
        return cards
    }
    
}