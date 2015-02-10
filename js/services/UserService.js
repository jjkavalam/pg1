var UserService = function(){    
    this.getName = function(){
        return "Jobin";
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

    UserService.prototype.crossesByDay = new Array(40);
    for (var i = 0; i < 40; i++){
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