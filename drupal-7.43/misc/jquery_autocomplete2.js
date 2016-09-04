//declaration of variables is done in the top of the file

var auto_complete2 = function(){


    var data = [
        { value: "W", label: "Wheat" },
        { value: "R", label: "Rice" },
        { value: "B", label: "Barley" },
        {value: "T", label: "Tomato"},
 
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
                console.log("you selected " +  $("#autocomplete2-value").val(ui.item.value));
                var selection =  event.value;
                var x = document.getElementById("autocomplete2-value").label;
                console.log('selected ' + selection);
                //console.log('selected ' + selectObject.value=value);
            } 
        });
    }); 

  /*  $(function(){
        var javascriptVariable

    });*/
};



jQuery(document).ready(function (){
     auto_complete2();             

});





/*
<?php
   $connection = mysqli_connect("localhost", "peopledatabase", "evanthia1011"); 

if(!$connection)
    {
        die ('Not Connected to database Server');
              
    }

echo 'you have connected successfully' . "\xA\xA";


$db = mysqli_select_db("peopledatabase", $connection); 
$db = mysqli_select_db($connection,'peopledatabase');

if (!$db)
  {
  echo "Failed to connect to db";
  }

if ($db)
  {
  echo "connected to db";
  }
$name=$_POST['typetest'];

$sql="INSERT INTO `nametable` (`firstname`)VALUES('$name')";
?>
/*
