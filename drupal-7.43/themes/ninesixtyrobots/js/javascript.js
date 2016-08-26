/**
 * @file
 * Javascript for ninesixtyrobots theme.
 */
(function ($) {

// Prefill the search box with Search... text.
Drupal.behaviors.ninesixtyrobots = {
  attach: function (context) {
    $('#search-block-form input:text', context).autofill({
      value: "Search ..."
    });
  }
};

})(jQuery);
