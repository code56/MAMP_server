<?php
/**
 * @file
 * Hooks provided by ApacheSolr Autocomplete.
 */

/**
 * Allows modules to alter the suggestions found.
 *
 * @param array &$suggestions
 *   Associative array of all the suggestions found. The keys are
 *   the suggestions, preceded by the character '*' to avoid a PHP
 *   bug with numeric keys ; the values are associative array
 *   themselves, containing the following keys:
 *   - theme: the theme function to call to render this result
 *   - suggestion: the suggested term
 *   - keys: the search part that lead to this suggestion
 *   - count: the number of matching documents.
 * @param string $keys
 *   The user input
 */
function hook_apachesolr_autocomplete_suggestions_alter(array &$suggestions, string $keys) {
  // Example. Never recommend the word 'foo'.
  if (isset($suggestions["*foo"])) {
    unset($suggestions["*foo"]);
  }
  // Example. Add a suggestion for 'cocoa' if one searches 'chocolate'.
  if ($keys == "chocolate") {
    $suggestions["*cocoa"] = array(
      'count' => 1,
      'keys' => $keys,
      'suggestion' => 'cocoa',
      'theme' => 'apachesolr_autocomplete_highlight',
    );
  }
}
