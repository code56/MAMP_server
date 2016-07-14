<?php
/**
 * @file
 * Contains LibrariesCDN.
 */

namespace Drupal\libraries_cdn;
use Drupal\libraries_cdn\Type\CDNBaseInterface;

/**
 * Class LibrariesCDN.
 */
class LibrariesCDN extends \Drupal {

  /* @var CDNBaseInterface $plugin */
  protected static $plugin;

  /**
   * Check if a CDN plugin is available.
   *
   * @param string $plugin_id
   *   The CDN Plugin ID, defined by the key 'id' in the plugins's annotation.
   *
   * @return bool
   *   TRUE if the plugin is available, otherwise, FALSE.
   */
  public static function isAvailableCDN($plugin_id) {
    return in_array($plugin_id, self::getAvailableCDN());
  }

  /**
   * Gets a list of available CDN plugins.
   *
   * @return array
   *   List of CDN plugins available.
   */
  public static function getAvailableCDN() {
    $options = array();
    $service_basename = 'libraries_cdn.LibrariesCDN';
    foreach (\Drupal::service($service_basename)->getDefinitions() as $service => $data) {
      $name = isset($data['label']) ? $data['label'] : $data['id'];
      $options[$data['id']] = $name;
    }
    asort($options);
    return $options;
  }

  /**
   * Return CDN Plugin id's of the CDN who provides a library.
   *
   * @param string $library
   *   The library to search.
   *
   * @return array $providers
   *   The array of providers who provides the searched library.
   */
  public static function find($library) {
    $providers = array();
    foreach (self::getAvailableCDN() as $cdn) {
      self::setPlugin($cdn, $library);
      if (self::isAvailable()) {
        $providers[] = $cdn;
      }
    }
    return $providers;
  }

  /**
   * Return CDN Plugin id's of the CDN who provides a library.
   *
   * @param string $library
   *   The library to search.
   *
   * @return array $providers
   *   The array of providers who provides the searched library.
   */
  public static function search($library) {
    $providers = array();
    foreach (self::getAvailableCDN() as $cdn) {
      self::setPlugin($cdn);
      $search = self::$plugin->search($library);
      if (!empty($search)) {
        $providers[$cdn] = $search;
      }
    }
    return $providers;
  }

  /**
   * Set the CDN plugin to use.
   *
   * @param string $plugin
   *   The Plugin ID to use.
   * @param string $library
   *   The library to work with.
   */
  public static function setPlugin($plugin, $library = NULL, $configuration = array()) {
    /* @var CDNBaseInterface $plugin */
    $plugin = self::service('libraries_cdn.LibrariesCDN')->createInstance($plugin, $configuration);
    if ($library) {
      $plugin->setLibrary($library);
    }
    self::$plugin = $plugin;
  }

  /**
   * Return the CDN Plugin object.
   *
   * @return \Drupal\libraries_cdn\Type\CDNBaseInterface
   *   The CDN Plugin object.
   */
  public static function getPlugin() {
    return self::$plugin;
  }

  /**
   * Set the library to work with.
   *
   * @param string $library
   *   The library to work with.
   */
  public static function setLibrary($library) {
    self::$plugin->setLibrary($library);
  }

  /**
   * Check if library is available.
   *
   * @return bool
   *   Return TRUE if the library is available on the CDN, FALSE otherwise.
   */
  public static function isAvailable() {
    return self::$plugin->isAvailable();
  }

  /**
   * Return all available version(s).
   *
   * @return array
   *   Return an array of versions.
   */
  public static function getVersions() {
    return self::$plugin->getVersions();
  }

  /**
   * Return all available file(s).
   *
   * @return array
   *   Return an array of files, keyed by library versions.
   */
  public static function getFiles() {
    return self::$plugin->getFiles();
  }

  /**
   * Get the library in use.
   *
   * @return string
   *   The library name.
   */
  public static function getLibrary() {
    return self::$plugin->getLibrary();
  }

  /**
   * Set a particular URL.
   *
   * @param string $identifier
   *   The identifier of the URL.
   * @param string $url
   *   The URL.
   */
  public static function setURL($identifier, $url) {
    self::$plugin->setURL($identifier, $url);
  }

  /**
   * Get a particular URL.
   *
   * @return string
   *   The URL.
   */
  public static function getURL($identifier) {
    return self::$plugin->getURL($identifier);
  }

  /**
   * Set URLs.
   *
   * @param array $urls
   *   An array of URLs for querying the service.
   */
  public static function setURLs(array $urls) {
    self::$plugin->setURLs($urls);
  }

  /**
   * Get URLs.
   *
   * @return array
   *   Return an array of URLs in use for querying the service.
   */
  public static function getURLs() {
    return self::$plugin->getURLs();
  }

  /**
   * Get library information.
   *
   * @return array
   *   Return an array containing information about the library.
   */
  public static function getInformation() {
    return self::$plugin->getInformation();
  }

  /**
   * Get latest version available of a library.
   *
   * @return string
   *   The latest available version of the library.
   */
  public static function getLatestVersion() {
    return self::$plugin->getLatestVersion();
  }

  /**
   * Generate an array for the variants of the Libraries API module.
   *
   * @return array
   *   The returned array can be applied to the 'variants' key in the library
   *   definition in hook_libraries_info().
   */
  public static function getLibrariesVariants() {
    $variants = array();

    $variants += self::getCDNLibrariesVariants();
    $variants += self::getLocalLibrariesVariants();

    return $variants;
  }

  /**
   * Generate an array for the variants of the Libraries API module.
   *
   * These variants are from the CDN plugins only.
   *
   * @return array
   *   The returned array can be applied to the 'variants' key in the library
   *   definition in hook_libraries_info().
   */
  public static function getCDNLibrariesVariants() {
    $variants = array();

    $module_path = drupal_get_path('module', 'libraries_cdn');
    $information = self::getInformation();
    $configuration = self::$plugin->getConfiguration();

    $name = isset($information['name']) ? $information['name'] : self::getLibrary();

    foreach (self::getFiles() as $version => $files) {
      foreach ($files as $file) {
        if (strpos($file, 'debug') !== FALSE || strpos($file, 'min') !== FALSE) {
          continue;
        }

        $variant = self::$plugin->getPluginId() . ':' . self::getLibrary() . ':' . $version;
        $ext = pathinfo($file, PATHINFO_EXTENSION);

        // Default CDN version.
        $variants[$variant]['name'] = sprintf("%s %s", $name, $version);
        $variants[$variant]['library path'] = $module_path;
        $variants[$variant]['files'][$ext][$file] = array(
          'type' => 'external',
          'data' => $file,
        ) + (array) self::$plugin->getConfiguration('options');
      }
    }

    if (isset($configuration['limit']) && is_int(intval($configuration['limit'])) && $configuration['limit'] > 0) {
      $variants = array_slice($variants, 0, $configuration['limit']);
    }
    return $variants;
  }

  /**
   * Generate an array for the variants of the Libraries API module.
   *
   * These variants are from the local installation only.
   *
   * @return array
   *   The returned array can be applied to the 'variants' key in the library
   *   definition in hook_libraries_info().
   */
  public static function getLocalLibrariesVariants() {
    $variants = array();
    $information = self::getInformation();

    $name = isset($information['name']) ? $information['name'] : self::getLibrary();

    foreach (self::getFiles() as $version => $files) {
      foreach ($files as $file) {
        $ext = pathinfo($file, PATHINFO_EXTENSION);

        if (strpos($file, 'debug') !== FALSE || strpos($file, 'min') !== FALSE) {
          continue;
        }

        if (isset($options['download'])) {
          $variant = 'local:' . self::$plugin->getPluginId() . ':' . self::getLibrary() . ':' . $version;

          if (isset($options['download']['versions'])) {
            $versions = array_map(function($version) {
              if ($version === 'latest') {
                return self::$plugin->getLatestVersion();
              }
              else {
                return $version;
              }
            }, (array) $options['download']['versions']);
            if (in_array($version, $versions)) {
              self::$plugin->getLocalCopy(array($version));
              $file = self::$plugin->getLocalFileName($file, $version);
              $variants[$variant]['name'] = sprintf("%s %s (cloned from %s)", $name, $version, self::$plugin->getPluginId());
              $variants[$variant]['library path'] = self::$plugin->getLocalDirectoryName($version);
              $variants[$variant]['files'][$ext][$file] = array(
                'type' => 'file',
                'data' => $file,
              ) + (array) self::$plugin->getConfiguration('options');
            }

          }

          if (isset($options['download']['plugins'])) {
            $options['download']['plugins'] = (array) $options['download']['plugins'];
            foreach ($options['download']['plugins'] as $plugin => $versions) {
              $versions = array_map(function($version) {
                if ($version === 'latest') {
                  return self::$plugin->getLatestVersion();
                }
                else {
                  return $version;
                }
              }, $versions);
              if (($plugin == self::$plugin->getPluginId() || $plugin == '*') && (in_array($version, $versions))) {
                self::$plugin->getLocalCopy(array($version));
                $file = self::$plugin->getLocalFileName($file, $version);
                $variants[$variant]['name'] = sprintf("%s %s (cloned from %s)", $name, $version, self::$plugin->getPluginId());
                $variants[$variant]['library path'] = self::$plugin->getLocalDirectoryName($version);
                $variants[$variant]['files'][$ext][$file] = array(
                  'type' => 'file',
                  'data' => $file,
                ) + (array) self::$plugin->getConfiguration('options');
              }
            }
          }
        }
      }
    }
    return $variants;
  }

}
