//this is a js file that will be called from the 
//custom module when the user will click on a 
// form that will have some autocomplete functionality 
// for autosuggesting the gene names for the user to 
// chooose which genes they want to see. 
//
// the array data source for the autcomplete jquery function
// will be coming from the data fetched from an AJAX SQL query
// this query will be executed with php code. 
// thus the result of the query will be a php variable
// which I can then convert to json (json_encoude())
// this json thus, needs to be accessible by the javascript file


// so the problem I am facing is I first tried to put the php 
// code within the mycustommodule.module file like loose, like not
// even within a function, and then I tried to put some javascript 
// within this php file, that would capture the query result json 
// in order to work with it. but I was failing at it. 
// here is my github progress with that: 
//https://github.com/code56/MAMP_server/blob/master/drupal-7.43/sites/all/modules/custom/dataform/dataform.module#L41


// So then I figured, that the mycustommodule.module would call 
// a javascript that will include some php code in it, which php code will
// be doing the AJAX sql query


//pseudocode

<script>

once the user clicks the form with #autocomplete-form id:
	run this function: 
	function autocomplete_function(){

	// this is the php code embedded in the javascript file.
	<?php do the sql query
		bring all the genes available in the database.
		store them in an array
		json_encode(sql_query_result)
		?>

	//??????? how amma going to capture that sql_query_result.json to be 
	// accessible via JS? 
	// or is it coz it's within the js function it should be available?
	}

	// i think here i should do some result cache so that the sql query
	// is not run each time the user clicks the autocomplete form.
	// but only run the first time? (provided the gene data in the db is the same)





</script>