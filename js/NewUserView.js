 var NewUserView = function () {

    this.render = function() {
        this.$el = $('<div/>');
        this.$el.html(this.template(this));
        return this;
    };

}

NewUserView.prototype.template = Handlebars.compile($("#newuser-tpl").html());