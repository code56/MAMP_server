
/**
 * Adds the autocomplete widget behavior to specified elements.
 *
 * This uses the jQuery UI Autocomplete widget included with Drupal core.
 */
Drupal.apachesolr_autocomplete = {
  processOne: function(key, settings, context) {
    // Look for items with the data-apachesolr-autocomplete-id attribute.
    var jquery_version = jQuery.fn.jquery.split('.');
    var apachesolr_autocomplete_selector = ((jquery_version[0] == 1 && jquery_version[1] >= 7) || jquery_version[0] > 1) ? 'ui-autocomplete' : 'autocomplete';
    var apachesolr_autocomplete_search = jQuery(".apachesolr-autocomplete[data-apachesolr-autocomplete-id='"+ key +"']", context);
    apachesolr_autocomplete_search.autocomplete({
        // TODO: source should be a function, which should add any client-side filters to autocomplete request.
        source: settings.path,
        // TODO: autocomplete select event should handle more actions on select: filling/submitting the textfield, jumping to URL... others?
        select: function(event, ui) {
            console.log("autocomplete.select: " + ui.item.value); //TODO: Debug
            // ui.item.label, ui.item.value, ui.item.count, etc.
            // Handle selection of an element in the autocomplete widget.
            jQuery(this).get(0).value = ui.item.value;
            // We should submit the widget's parent form.
            jQuery(this).closest("form").submit()
        },
        search: function(event, ui) {
            jQuery(this).addClass('throbbing');
        },
        // The following doesn't fire--why??
        response: function( event, ui ) {
            console.log('autoccomplete.response fired');
            jQuery(this).removeClass('throbbing');
        },
        open: function(event,ui) {
            jQuery(this).removeClass('throbbing');
        },
        minLength: 2,
        delay: 400
    })
    .addClass('form-autocomplete');
    if (apachesolr_autocomplete_search.data(apachesolr_autocomplete_selector)) {
      apachesolr_autocomplete_search.data(apachesolr_autocomplete_selector)._renderItem = Drupal.apachesolr_autocomplete.renderItem;
    }
  },
    // TODO: USe JS-side theming. See http://engineeredweb.com/blog/11/5/javascript-theme-functions-drupal/
  renderItem: function (ul, item) {
      var theme_function = 'apachesolr_autocomplete_default';
      if (item.theme) {
          theme_function = item.theme;
      }
      theme_function = theme_function;
      var html = Drupal.theme(theme_function, item);
      return jQuery("<li>")
          .data("item.autocomplete", item)
          .append(html)
          .appendTo(ul);
  }
};

/**
 * Implements the Drupal behavior functions that trigger on page load.
 *
 * Uses the JS Drupal.settings.apachesolr_autocomplete object set by the
 * apachesolr_autocomplete module to change any relevant form elements currently
 * on the page to be autocomplete-enabled.
 */
Drupal.behaviors.apachesolr_autocomplete = {
  attach: function(context) {
    // Check that settings exist.
    if (!Drupal.settings.apachesolr_autocomplete || !Drupal.settings.apachesolr_autocomplete.forms) {
      return;
    }
    // Cycle thru the settings array which contains:
    //   key => settingsArray
    // where
    //   key: the data-apachesolr-autocomplete-id HTML attribute to look for
    //        (which was added on the form_alter)
    //   settings: and
    jQuery.each(Drupal.settings.apachesolr_autocomplete.forms, function(key, settings) {
      Drupal.apachesolr_autocomplete.processOne(key, settings, context);
    });
  }
};

/**
 * Default theming function.
 * @param item
 *   The item object.
 * @returns {string}
 */
Drupal.theme.prototype.apachesolr_autocomplete_default = function(item) {
    return item.label;
};
