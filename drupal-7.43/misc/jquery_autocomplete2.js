//declaration of variables is done in the top of the file

var auto_complete2 = function(){


    var data = [
        { "label": "Wheat" },
        { "label": "Rice" },
        { "label": "Barley" },
        {"label": "Tomato"},
        {"label": "Testing"}
 
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
                //console.log($(this).val(ui.item.label).find(":selected").text()); //empty string? 
               
                $("#autocomplete2-value").val(ui.item.value);
                // console.log("you selected " +  $("#autocomplete2-value").val(ui.item.value));
                // var selection =  event.value;
                // var x = document.getElementById("autocomplete2-value").label;
                // console.log('selected ' + selection);
                //console.log('selected ' + selectObject.value=value);
            } 
        });
    }); 

};



jQuery(document).ready(function(){
     auto_complete2();             

});

//<input id="autocomplete2" type="text" class="ui-autocomplete-input" autocomplete="off">
