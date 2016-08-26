// this works
/*(function ($) {
  $(document).ready(function(){
    alert("Hello world!");  //here we can add our JS code
  });
})(jQuery);
*/


(function ($){
    var data = [
        { value: "W", label: "Wheat" },
        { value: "R", label: "Rice" },
        { value: "B", label: "Barley" },

    ];

    $(function() {

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
})(jQuery);
