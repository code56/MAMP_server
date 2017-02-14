




(function($) {
  $(document).ready(function() {
    console.log(Drupal.settings.gene_names);
    var array_of_gene_names = Drupal.settings.gene_names;
    console.log(array_of_gene_names);
    console.log('this is the autocomplete_gene_names.js file working' + window.jQuery.ui);
       // console.log(array_of_gene_names);
        $("#autocompletegenesnames").autocomplete({
            source: array_of_gene_names
        });
      
    }); 
  
    //autocompletegenesnames 
    // I need this dataformat: var data = [
       /* { "label": "Wheat" },
        { "label": "Rice" },
        { "label": "Barley" },
        {"label": "Tomato"},
        {"label": "Testing"}
 
    ];
*/
  /*
  in the eLIFE article (the editing page of the content) I added these lines; Which do appear under the sources 

   <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
  <link rel="stylesheet" href="/resources/demos/style.css">
  <script src="https://code.jquery.com/jquery-1.12.4.js"></script>
  <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
  */
    // I could do a preprocess of converting an array to a JSON with key-value pairs. 
        
})(jQuery);

// add the autocomplete functionality here. 


