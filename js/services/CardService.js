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
    }    
    
    this.initialize = function() {
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
        
        // Prepare cards for days with cross
        var cards = new Array();
        for (var i = 0; i < daysOfWeek.length; i++){
            if (crossesOfWeek[i] == null){
            } else {
                var card = {};
                var crossId = crossesOfWeek[i];
                card.cross_pic = static_data["crosses"][crossId]["pic"];
                card.virtue = static_data["crosses"][crossId]["virtue"];
                card.day_seq = day_seq[i];
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