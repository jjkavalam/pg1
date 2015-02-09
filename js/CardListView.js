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

    this.render = function() {
        this.$el.html(this.template(cards));
        return this;
    };

    this.initialize();

}