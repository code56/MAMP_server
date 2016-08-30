//declaration of variables is done in the top of the file

var auto_complete2 = function(){


    var data = [
        { value: "W", label: "Wheat" },
        { value: "R", label: "Rice" },
        { value: "B", label: "Barley" },

    ];

    $(function() {
        console.log('am working' + window.jQuery.ui);
        $("#autocomplete2").autocomplete({
            source: data,
            focus: function(event, ui) {
                // prevent autocomplete from updating the textbox
                event.preventDefault();
                // manually update the textbox
                $(this).val(ui.item.label);
            },
            select: function(event, ui) {
                // prevent autocomplete from updating the textbox
                event.preventDefault();
                // manually update the textbox and hidden field
                $(this).val(ui.item.label);
                $("#autocomplete2-value").val(ui.item.value);
            }
        });
    }); 
};



jQuery(document).ready(function (){
     auto_complete2();             

});
