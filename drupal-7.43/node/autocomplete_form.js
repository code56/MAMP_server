// the javascript with the autocomplete function

/// <reference path = "jquery-1.4.4.-vsdoc.js" />
/// <reference path = "jquery-ui.js" />

// start the anonymous function once all the HTML has been loaded 

$(document).ready(function(){

//finding elements by the class autocomplete
//where to go to retrieve data
	//$(".autocomplete").autocomplete();

	$(":input[data-autocomplete]").each(function() {
		$(this).autocomplete({ source: $(this).attr("data-autocomplete") });

		});
	}

})

//other good source
//http://drupal.stackexchange.com/questions/130809/how-to-populate-an-autocomplete-using-a-web-service

