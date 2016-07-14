<?php
/**
 * @file
 * Administrative UI and functions for the OAuth2 Authentication module.
 */

/**
 * Form builder: Main administrative form.
 */
function oauth2_authentication_admin_form($form, &$form_state) {

  // Define the set of fields for the server settings.
  $form['server'] = array(
    '#type' => 'fieldset',
    '#title' => t('Server settings'),
    '#tree' => TRUE,
    '#weight' => 0,
    '#collapsible' => TRUE,
    '#collapsed' => FALSE,
  );

  // Add a text field for the token endpoint.
  $form['server']['token_endpoint'] = array(
    '#title' => t('Token endpoint URL'),
    '#type' => 'textfield',
    '#required' => TRUE,
    '#default_value' => variable_get('oauth2_authentication_token_endpoint', 'https://idp.example.com/token'),
    '#description' => t('A valid URL from where access tokens can be retrieved.'),
  );

  // Add a text field for the client ID.
  $form['server']['client_id'] = array(
    '#title' => t('Client ID'),
    '#type' => 'textfield',
    '#required' => TRUE,
    '#default_value' => variable_get('oauth2_authentication_client_id', ''),
    '#description' => t('This sites\'s ID for authenticating to the token server.'),
  );

  // Add a text field for the client secret.
  $form['server']['client_secret'] = array(
    '#title' => t('Client secret'),
    '#type' => 'textfield',
    '#required' => TRUE,
    '#default_value' => variable_get('oauth2_authentication_client_secret', ''),
    '#description' => t('This site\'s secret used for authenticating to the token server.'),
  );

  // Add a text field for the scope.
  $form['server']['scope'] = array(
    '#title' => t('Scope'),
    '#type' => 'textfield',
    '#default_value' => variable_get('oauth2_authentication_scope', ''),
    '#description' => t('The scope of the access request.'),
  );

  // Define the set of fields for the server settings.
  $form['user'] = array(
    '#type' => 'fieldset',
    '#title' => t('User settings'),
    '#tree' => TRUE,
    '#description' => t('By default, users will not be allowed to edit their passwords or e-mail addresses as these will normally be handled by a separate CRM-type system.  If you\'d like to make these fields user-editable, you may do so, but be warned that changes within Drupal will not be automatically sent to the other system.'),
    '#weight' => 10,
    '#collapsible' => TRUE,
    '#collapsed' => FALSE,
  );

  $form['user']['edit_email'] = array(
    '#type' => 'checkbox',
    '#title' => t('Allow users to edit their e-mail addresses'),
    '#default_value' => variable_get('oauth2_authentication_user_edit_email', FALSE),
  );

  $form['user']['edit_password'] = array(
    '#type' => 'checkbox',
    '#title' => t('Allow users to change their passwords'),
    '#default_value' => variable_get('oauth2_authentication_user_edit_password', FALSE),
  );

  // Define the set of fields for miscellaneous settings.
  $form['misc'] = array(
    '#type' => 'fieldset',
    '#title' => t('Miscellaneous settings'),
    '#tree' => TRUE,
    '#description' => t('These settings don\'t fit into any of the other major categories.'),
    '#weight' => 20,
    '#collapsible' => TRUE,
    '#collapsed' => FALSE,
  );

  // Add a text field for the name of the class to handle the authentication.
  $form['misc']['class'] = array(
    '#title' => t('Client class'),
    '#type' => 'textfield',
    '#required' => TRUE,
    '#default_value' => variable_get('oauth2_authentication_class', 'OAuth2AuthenticationClient'),
    '#description' => t('The name of the class that handles the authentication.  If you have extended the default one to make modifications, enter it here.'),
  );

  // Configure the form submission button.
  $form['actions']['#type'] = 'actions';
  $form['actions']['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Save configuration'),
    '#weight' => 30,
  );

  return $form;
}

/**
 * Validation handler for oauth2_authentication_admin_form.
 */
function oauth2_authentication_admin_form_validate($form, &$form_state) {

  // Fetch the form values.
  $token_endpoint = $form_state['values']['server']['token_endpoint'];
  $client_id      = $form_state['values']['server']['client_id'];
  $client_secret  = $form_state['values']['server']['client_secret'];
  $scope          = $form_state['values']['server']['scope'];
  $class          = $form_state['values']['misc']['class'];

  // Ensure that the token endpoint is a valid URL.
  if (!valid_url($token_endpoint, TRUE)) {
    form_set_error('server][token_endpoint', 'The token endpoint is not a valid URL.');
  }

  // Ensure that the class has been defined.
  if (!class_exists($class)) {
    form_set_error('misc][class', 'The authentication-handling class has not been defined.  It must exist before it can be used.');
  }
}

/**
 * Submit handler for oauth2_authentication_admin_form.
 */
function oauth2_authentication_admin_form_submit($form, &$form_state) {

  // Fetch the form values.
  $token_endpoint = $form_state['values']['server']['token_endpoint'];
  $client_id      = $form_state['values']['server']['client_id'];
  $client_secret  = $form_state['values']['server']['client_secret'];
  $scope          = $form_state['values']['server']['scope'];
  $class          = $form_state['values']['misc']['class'];
  $edit_email     = $form_state['values']['user']['edit_email'];
  $edit_password  = $form_state['values']['user']['edit_password'];

  // Save the token endpoint.
  if (!empty($token_endpoint)) {
    variable_set('oauth2_authentication_token_endpoint', $token_endpoint);
  }

  // Save the client ID.
  if (!empty($client_id)) {
    variable_set('oauth2_authentication_client_id', $client_id);
  }

  // Save the client secret.
  if (!empty($client_secret)) {
    variable_set('oauth2_authentication_client_secret', $client_secret);
  }

  // Save the scope.
  if (!empty($scope)) {
    variable_set('oauth2_authentication_scope', $scope);
  }

  // Save the class.
  if (!empty($class)) {
    variable_set('oauth2_authentication_class', $class);
  }

  // Save the user checkboxes.
  variable_set('oauth2_authentication_user_edit_email', $edit_email);
  variable_set('oauth2_authentication_user_edit_password', $edit_password);

  // Report status.
  drupal_set_message(t('The configuration options have been saved.'));
}
