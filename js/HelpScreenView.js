var HelpScreenView = function() {

    this.render = function() {
        this.$el = $('<div/>');
        this.$el.html(this.template(this));
        return this;
    };

}

HelpScreenView.prototype.template = Handlebars.compile($("#helpscreen-tpl").html());
