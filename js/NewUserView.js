 var NewUserView = function () {

    var message;
    
    this.render = function(message) {
        this.message = message;
        this.$el = $('<div/>');
        this.$el.html(this.template(this));
        return this;
    };

}

NewUserView.prototype.template = Handlebars.compile($("#settings-tpl").html());