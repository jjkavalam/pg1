var VoteService = function () {

    this.initialize = function() {
        var deferred = $.Deferred();
        window.localStorage.setItem("votes", JSON.stringify(
            {
                1 : -2,
                2 : 3
            }
        ));
        deferred.resolve();
        return deferred.promise();
    }

    this.getNumVotesById = function (id) {
        var votes = JSON.parse(window.localStorage.getItem("votes"));
        return votes[id];
    }
    
    this.updateVotesOfId = function(id, value){
        var votes = JSON.parse(window.localStorage.getItem("votes"));
        votes[id] = value;
        window.localStorage.setItem("votes", JSON.stringify(votes));
    }

}