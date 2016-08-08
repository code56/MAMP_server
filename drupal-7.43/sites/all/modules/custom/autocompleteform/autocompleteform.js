//<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>

$("input#autofill").autocomplete({
        source: function (request, response) {
            var term = request.term;
            var restUrl = 'http://www.ebi.ac.uk/ols/api/select?q='+term;

            $.getJSON(restUrl, function (data) {
                var items = [];
                $.each(data.results, function (key, val) {                          
                    var item = {
                        label: val.Label,
                        value: val.Value
                    };
                    items.push(item);
                });

                response(items);
            });
        }
    });