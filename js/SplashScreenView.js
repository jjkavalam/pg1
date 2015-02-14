var SplashScreenView = function() {

    this.render = function() {
        this.$el = $('<div/>');
        this.$el.html(this.template(this));
        return this;
    };

}

SplashScreenView.prototype.template = Handlebars.compile($("#splashscreen-tpl").html());
