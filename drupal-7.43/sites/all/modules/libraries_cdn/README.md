[![Build Status](https://travis-ci.org/drupol/libraries_cdn.svg)](https://travis-ci.org/drupol/libraries_cdn)
[![Coverage Status](https://coveralls.io/repos/drupol/libraries_cdn/badge.svg?branch=phpunit-tests&service=github)](https://coveralls.io/github/drupol/libraries_cdn?branch=phpunit-tests)

# Libraries CDN API

Libraries CDN API is an API module to retrieve data from CDN like CDNJS or jsDelivr.

# API
```php
  // List available CDN plugins
  $plugins = \Drupal\libraries_cdn\LibrariesCDN::getAvailableCDN();

  // Check if a CDN plugin is available
  \Drupal\libraries_cdn\LibrariesCDN::isAvailableCDN($plugin_id);

  // Set the cdn you want to use
  \Drupal\libraries_cdn\LibrariesCDN::setPlugin('cdnjs');
  
  // Set the cdn and the library to use
  \Drupal\libraries_cdn\LibrariesCDN::setPlugin('cdnjs', 'ol3');

  // Set the cdn, the library and the configuration.
  \Drupal\libraries_cdn\LibrariesCDN::setPlugin('cdnjs', 'ol3', array('request' => array('timeout' => 5)));

  // Set the library you want to get data from
  \Drupal\libraries_cdn\LibrariesCDN::setLibrary('openlayers');
  
  // Check if the library is available
  \Drupal\libraries_cdn\LibrariesCDN::isAvailable();
  
  // Get information about the library
  \Drupal\libraries_cdn\LibrariesCDN::getInformation();

  // Get versions available
  \Drupal\libraries_cdn\LibrariesCDN::getVersions();
  
  // Get files available
  \Drupal\libraries_cdn\LibrariesCDN::getFiles();
  
  // Get latest version available
  \Drupal\libraries_cdn\LibrariesCDN::getLatestVersion();

  // Get array of CDN plugins ID where the library is available
  \Drupal\libraries_cdn\LibrariesCDN::find($library);

  // Perform a search on each CDN Plugins and return an array of results
  \Drupal\libraries_cdn\LibrariesCDN::search($library);
```
# Integration with Libraries API

This module provides a kind of autodiscovery for Libraries API through the ```hook_libraries_info_alter()```.
In order to have it working, add a new key to the library definition in ```hook_libraries_info()```.

Here's an example:

```
/*
 * Implementation of hook_libraries_info().
 */
function mymodule_libraries_info() {
  return array(
    'mylibrary' => array(
      'name' => 'MyLibrary library',
      'library path' => drupal_get_path('module', 'mymodule'),
      'version callback' => , // Set a callback here to get the version in use.
      'version arguments' => array(),
      'variants' => array(),
      'cdn' => array(
        'aliases' => array('mlib', 'mylib'),
        'limit' => 3,
        'options' => array(
          'weight' => -2,
          'group' => 'MyLib',
        ),
        'download' => array(
          'versions' => array('3.8.1'),
          'plugins' => array(
            'cdnjs' => array('latest'),
        ),
        'request' => array(
          'timeout' => 5,
        ),
      )
    )
  );
}
```

Details of this new sub-array:
- plugins: array, the list of cdn plugins to search the library from. Will use all if not set.
- aliases: array, if the library has different names.
- limit: integer, set this to limit the number of results. If set to 3, it will return the 3 latest versions available.
- options: array, this array will be applied to each file definition, see ```drupal_add_TYPE()``` (js or css) to see which are the keys.
- download: array, options to download a local copy of the library
  - versions: array, version to download on any CDN when available.
  - plugins: array, keys are CDN plugin ids. Values are versions to download when available. The special keyword: 'latest' can be used to download the latest version available.
- request: array, this array will be the configuration that will be passed to the request function. See drupal_http_request() for a list of key values.

To include a library variant selection in your module, here's an example of code that you can use:

```
$library = libraries_detect('openlayers3');
$options_variants = array();
foreach ($library['variants'] as $version => $variant) {
  list($optgroup) = explode(':', $version, 2);
  if (empty($optgroup)) {
    $optgroup = t('Other');
  }
  $optgroup = drupal_strtoupper($optgroup);
  $options_variants[$optgroup][$version] = (isset($variant['name'])) ? $variant['name'] : $version;
}
$form['library'] = array(
  '#type' => 'select',
  '#title' => 'Select version of the library you want to use',
  '#options' => $options_variants,
);
```

# Integration using #attached

Use the ```#attached``` key of a render array to attach any CDN libraries, just like any other regular libraries.

```
$form['#attached'] = array(
 'libraries_cdn_load' => array(
   array('ol3', 'cdnjs', '3.8.2'),
 ),
);
```

The parameters are:
- String, required: The library name 
- String, optional: The CDN to get the library from. (use ```*``` to query all CDN available and use the first who has it)
- String, optional: The version. Will get the latest version if omitted.

# Extend the module

Create a simple drupal module.

Your module's info file must contains:

```
dependencies[] = registry_autoload
registry_autoload[] = PSR-4
```

Create directory structure that follows this one in your module:

```
src/Plugin/LibrariesCDN
```

Pay attention to the case, it's important.

Then, create your file containing your class in that directory.
Have a look at the files provided in the original module to inspire yours.

# TODO
* Do not use ```drupal_http_request```.
* More CDNs.
* More documentation.
* Better ```Libraries API``` integration.
* Permit the download and installation of libraries
