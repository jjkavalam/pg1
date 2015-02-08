var EmployeeView = function(employee, numvotes) {

    this.initialize = function() {
        this.$el = $('<div/>');
    };

    this.render = function() {
        var wrapped_employee = employee;
        wrapped_employee.numvotes = numvotes;
        this.$el.html(this.template(wrapped_employee));
        return this;
    };
    
    this.reflow = function(){
        this.render().$el[0].offsetWidth;
    }

    this.initialize();

}
