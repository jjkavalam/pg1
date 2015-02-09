var CrossesView = function() {

    this.initialize = function() {
        this.$el = $('<div/>');
    };

    this.render = function() {
        this.$el.html(this.template());
        return this;
    };
    
    this.initialize();

}
