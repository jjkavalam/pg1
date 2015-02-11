var CardService = function(){

    var userService = new UserService();
    
    var static_data = {
        "mylentcard_styles" : [
            'mylent_content_style_1',
            'mylent_content_style_2'
        ],
        "crosses" : [
            {"pic":"cross1.png", "virtue":"kind", "cross_heading":"Green cross", "cross_text":"I said an extra prayer."},
            {"pic":"cross2.png", "virtue":"humble", "cross_heading":"Red cross", "cross_text":"I did something good that was hard for me to do."}
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
        var rnd = Math.floor((Math.random() * static_data["mylentcard_styles"].length));    
        return static_data["mylentcard_styles"][rnd];
    }
    
    this.getAddmycrossCards = function(){
        // Simply return the static content dictionary
        var cards = static_data["crosses"];
        
        // Add index as the cross idx
        for (var i = 0; i < cards.length; i++){
            cards[i].cross_idx = i;
        }
        
        // Apply random styles to the card        
        for (var i = 0; i < cards.length; i++){
            cards[i].style_class = getRandomStyle();
        }
        
        return cards
    }
    
}