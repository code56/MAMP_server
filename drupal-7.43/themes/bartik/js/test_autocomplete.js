jQuery(document).ready(function ($){
                
                auto_complete();
                auto_complete2();

            });

var auto_complete = function(){
                AutoComplete({
                    //_Render: function(response, ){
                    //    console.log(response)
                    //    response = JSON.parse(response)
                    //    this._Render(response.params)
                    //},
                    post: do_post,
                    select: do_select,
                    //_RenderResponseItems: do_renderresponse,
                    //_Select: do_select,
                    //autoFocus: true,
                    
                    })
//upon select choose what to do with it. 
                function do_select(input, item){
                    //console.log(input)
                    //console.log(item)
                    input.value = attr(item, "data-autocomplete-value", item.innerHTML);
                    console.log(input.value); // PO: antheridium jacket layer - is the element chosen in the input form
                    attr(input, {"data-autocomplete-old-value": input.value});
                    alert("you selected "+ input.value);
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
                            li.innerHTML = '<span class="label label-info"><span title="' + desc + '" style="color:black; padding-top:3px; padding-bottom:3px"/>' + doc.ontology_prefix + ':' + doc.label + ' ' + '</span>' + ' - ' + '<span style="color:#158522">' + doc.obo_id + '</span></span>';


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

                /*
                function do_post(response) {
                    console.log("response is " + response)
                    response = JSON.parse(response);
                    var properties = Object.getOwnPropertyNames(response); // ["responseHeader", "response", "highlighting"]

                    //create abstract dom objects
                    // element = {DOM element}
                    //length = response.length,
                    // var li = domCreate("li");
                    var li = document.createElement("li"); //<li>
                    var ul = document.createElement("ul");

                

                    for (var item in response.response.docs) {
                        doc = response.response.docs[item]

                        // error catching
                        try {
                            //
                            console.log(doc)
                            console.log(response.highlighting[doc.id])
                           
                            var s
                            s = response.highlighting[doc.id].label   
                            console.log("s is " + s)        //<b>Potato<b>  //
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

                            //customise this 

                            li.innerHTML = '<span class="label label-info"><span title="' + desc + '" style="color:white; padding-top:3px; padding-bottom:3px"><img style="height:15px; margin-right:10px"/>' + doc.ontology_prefix + ':' + doc.label + ' ' + '</span>' + ' - ' + '<span style="color:#fcff5e">' + doc.obo_id + '</span></span>';
                            
                            console.log(li.innerHTML); // works but change accordingly   //<span class="label label-info"><span title="PO" style="color:white; padding-top:3px; padding-bottom:3px"><img style="height:15px; margin-right:10px" src="/static/copo/img/ontology.png">PO:Potato </span> - <span style="color:#fcff5e">undefined</span></span> 


                          



                 */
                
                function do_render(response){
                    response = JSON.parse(response);
                    Autocomplete._Render(response)
                  
                }}


var auto_complete2 = function(){


    var data = [
        { value: "W", label: "Wheat" },
        { value: "R", label: "Rice" },
        { value: "B", label: "Barley" },

    ];

    $(function() {
        console.log('am working' + window.$);
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
    })(); //immediately invoked 


}
/*
// We define a function that takes one parameter named $.
(function ($) {
  // Use jQuery with the shortcut:
  console.log($.browser);
// Here we immediately call the function with jQuery as the parameter.
}(jQuery));
*/



