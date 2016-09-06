jQuery(document).ready(function ($){
                
                auto_complete();
                

            });



var auto_complete = function(){
                AutoComplete({
               
                    
                    post: do_post,
                    select: do_select,
//                    ajax: ajax_post, this needs to be called 
                    
/*                    var test = do_select(); // this will grab the return value from the do_select
                    alert ('hello am passing');
                    alert("I grabbed the do_select function value " + test);
    //                ajax_post();*/
                    
                    //var test = do_select();
                    //console.log("hello am passing the do_select function value" + test);
                    });

//upon select choose what to do with it.//override
                function do_select(input, item){
                    //console.log(input)
                    //console.log(item)
                    input.value = attr(item, "data-autocomplete-value", item.innerHTML);
                    console.log(input.value); // PO: antheridium jacket layer - is the element chosen in the input form
                    attr(input, {"data-autocomplete-old-value": input.value});
                    alert("you selected "+ input.value);
                    var selected_po = input.value;
                    console.log ('x string is: ' + selected_po);
                    
                    // returning x (the selected PO so it can be passed to ajax_post() function to be sent to the mySQL via PHP)

                    ajax_post(selected_po); 
                }



                //connect the selection to a local mySQL database: 
                //https://www.sitepoint.com/using-node-mysql-javascript-client/
                
                function do_post(result, response, custParams) {
                    response = JSON.parse(response);
                    console.log("num_found " + response.response.numFound)
                    var properties = Object.getOwnPropertyNames(response);
                    //Try parse like JSON data

                    var empty,
                        length = response.length,
                        li = domCreate("li"),
                        ul = domCreate("ul");

                    //Reverse result if limit parameter is custom
                    if (custParams.limit < 0) {
                        properties.reverse();
                    }


                    for (var item in response.response.docs) {

                        doc = response.response.docs[item]


                        try {
                            //
                            console.log(response.highlighting[doc.id])
                            console.log(doc)
                            var s
                            s = response.highlighting[doc.id].label
                            if (s == undefined) {
                                s = response.highlighting[doc.id].synonym
                            }
                            var desc
                            if (doc.ontology_prefix == undefined) {
                                desc = "Origin Unknown"
                            }
                            else {
                                desc = doc.ontology_prefix
                            }
                            li.innerHTML = '<span class="label label-info"><span title="' + desc + '" style="color:black; padding-top:3px; padding-bottom:3px"/>' + doc.label + ' ' + '</span>' + ' - ' + '<span style="color:#158522">' + doc.obo_id + '</span></span>';
 //+ doc.ontology_prefix + ':'

                            $(li).attr('data-id', doc.id)
                            var styles = {
                                margin : "2px",
                                marginTop: '4px',
                                fontSize: "large",

                            };
                            $(li).css(styles)
                            $(li).attr('data-term_accession', doc.iri)
                            $(li).attr('data-annotation_value', doc.label)
                            var s = doc.obo_id
                            s = s.split(':')[0]  

                            $(li).attr('data-term_source', s)
                            //$(li).attr("data-autocomplete-value", response.highlighting[item].label_autosuggest[0].replace('<b>', '').replace('</b>', '') + ' - ' + item);

                            console.log($(li).data('label'))

                            ul.appendChild(li);
                            li = domCreate("li");
                        }
                        catch (err) {
                            console.log(err)
                            li = domCreate("li");
                        }
                    }
                    if (result.hasChildNodes()) {
                        result.childNodes[0].remove();
                    }

                    result.appendChild(ul);
                    }



                // this function is being called from within the do_select
                function ajax_post(variable){
                // Create our XMLHttpRequest object
                    alert ('this function works');  // passes
                    var hr = new XMLHttpRequest(); // how do we test whether this works? it could be that the XMLHttpRequest() might not be working.
                    // Create some variables we need to send to our PHP file
                    var url = "http://localhost:8888/my_parse_file1.php";
                    //var fn = document.getElementById("first_name").value;
                    var fn = variable;
                    alert ("the selected_po from ajax_post is " + fn); //passes
                    //var ln = document.getElementById("last_name").value;
                    var ln = variable;

                    var vars = "firstname="+fn+"&lastname="+ln;
                    

                    hr.open("POST", url, true);
                    // Set content type header information for sending url encoded variables in the request
                    hr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                    // Send the data to PHP now... 
                    hr.send(vars);   // actually exectue the request
                };


                    // Access the onreadystatechange event for the XMLHttpRequest object
                    /*hr.onreadystatechange = function() {
                        if(hr.readyState == 4 && hr.status == 200) {
                            var return_data = hr.responseText;
                            document.getElementById("status").innerHTML = return_data;
                        }
                    }
                    // Send the data to PHP now... and wait for response to update the status div
                    hr.send(vars); // Actually execute the request
                    document.getElementById("status").innerHTML = "processing...";


*/

            }; 