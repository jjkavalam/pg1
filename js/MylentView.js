 var MylentView = function () {

    var isDisplayPrevWeekButton;
    var isDisplayNextWeekButton;
    var weekNumber;
    var cards;
    var isDisplayEncouragement;
    var isTodayHasCross;
    
    this.render = function() {
        this.$el = $('<div/>');
        this.$el.html(this.template(this));
        return this;
    };

}

MylentView.prototype.template = Handlebars.compile($("#mylent-tpl").html());