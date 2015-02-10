var CardService = function(){

    var userService = new UserService();
    
    var static_data = {
        "mylentcard_styles" : [
            'mylent_content_style_1',
            'mylent_content_style_2'
        ],
        "crosses" : [
            {"pic":"cross1.png", "virtue":"kind"},
            {"pic":"cross2.png", "virtue":"humble"}
        ],
        "start_date" : new Date('2/18/2015'),
    }
    
    this.getDaysOfWeek = function(week_n){
        if (week_n == 0){
            return [0, 1, 2, 3];
        }
        if (week_n == 6)
            return [39, 40];            
        if (week_n > 6) return;
        var start = 7*week_n - 3;
        var days = new Array();
        for (var i = 0; i < 7; i++){
            days.push(start+i);
        }
        return days;
    }
    
    this.initialize = function() {
    }
    
    this.getMylentCardsForWeek = function(week_n){
    
        var crossesByDay = userService.getCrossesByDay();
        
        // Filter out cross status data for the given week
        var daysOfWeek = this.getDaysOfWeek(week_n);
        var crossesOfWeek = new Array();
        for (var i = 0; i < daysOfWeek.length; i++){
            var day = daysOfWeek[i];
            crossesOfWeek.push(crossesByDay[day]);
        }
        
        // Prepare cards for days with cross
        var cards = new Array();
        for (var i = 0; i < daysOfWeek.length; i++){
            if (crossesOfWeek[i] == null){
            } else {
                var card = {};
                var crossId = crossesOfWeek[i];
                card.cross_pic = static_data["crosses"][crossId]["pic"];
                card.virtue = static_data["crosses"][crossId]["virtue"];
                cards.push(card);
            }
        }

        // Apply random styles to the card
        for (var i = 0; i < cards.length; i++){
            var card = cards[i];            
            var rnd = Math.floor((Math.random() * static_data["mylentcard_styles"].length));
            card.style_class = static_data["mylentcard_styles"][rnd];
        }
        
        // Add user's name to all cards
        var userName = userService.getName();
        for (var i = 0; i < cards.length; i++){
            var card = cards[i];
            card.userName = userName;
        }

        return cards;
    }
    
    this.getAddmycrossCars = function(){
    }
    
}