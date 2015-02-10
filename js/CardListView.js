var CardListView = function () {

    var cards;

    this.initialize = function() {
        this.$el = $('<div/>');
        this.render();
    };

    this.setCards = function(list) {
        cards = list;
        this.render();
    }

    this.render = function(template) {
        this.$el.html(template(cards));
        return this;
    };

    this.initialize();

}