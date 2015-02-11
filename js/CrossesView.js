var CrossesView = function() {

    var cards;
    
    this.render = function() {
        this.$el = $('<div/>');
        this.$el.html(this.template(this));
        return this;
    };

}

CrossesView.prototype.template = Handlebars.compile($("#crosses-tpl").html());