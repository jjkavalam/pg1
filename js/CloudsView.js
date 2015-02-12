var CloudsView = function() {
    
    var message;
    
    this.render = function() {        
        this.$el = $('<div/>');
        this.$el.html(this.template(this));       
        return this;
    };

}

CloudsView.prototype.template = Handlebars.compile($("#clouds-tpl").html());