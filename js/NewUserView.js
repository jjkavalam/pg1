 var NewUserView = function () {

    var isNewUserMode;
    var href;
    
    this.render = function(isNewUserMode) {
    
        this.isNewUserMode = isNewUserMode;
        this.href = isNewUserMode+'';

        this.$el = $('<div/>');
        this.$el.html(this.template(this));
        return this;
    };

}

NewUserView.prototype.template = Handlebars.compile($("#settings-tpl").html());