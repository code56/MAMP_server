<?php
/**
 * @file
 * Interface CDNBaseInterface.
 */

namespace Drupal\libraries_cdn\Type;
use Drupal\Component\Plugin\PluginInspectionInterface;

/**
 * Interface CDNBaseInterface.
 */
interface CDNBaseInterface extends PluginInspectionInterface {
  /**
   * Check if library is available.
   *
   * @return bool
   *   Return TRUE if the library is available, otherwise, FALSE.
   */
  public function isAvailable();

  /**
   * Return all available version(s).
   *
   * @return array
   *   Return an array with available versions of the library.
   */
  public function getVersions();

  /**
   * Return all available file(s).
   *
   * @param array $version
   *   Filter the returning array with this one.
   *
   * @return array
   *   Return an array with available files of the library.
   */
  public function getFiles(array $version = array());

  /**
   * Set the library to work with.
   *
   * @param string $library
   *   The library to work with.
   */
  public function setLibrary($library);

  /**
   * Get the library in use.
   *
   * @return string
   *   The library name.
   */
  public function getLibrary();

  /**
   * Set a particular URL.
   *
   * @param string $identifier
   *   The identifier.
   * @param string $url
   *   The URL.
   */
  public function setURL($identifier, $url);

  /**
   * Get a particular URL.
   *
   * @return string
   *   The URL.
   */
  public function getURL($identifier);

  /**
   * Set URLs.
   *
   * @param array $urls
   *   An array of URLs for querying the service.
   */
  public function setURLs(array $urls = array());

  /**
   * Get URLs.
   *
   * @return array
   *   Return an array of URLs in use for querying the service.
   */
  public function getURLs();

  /**
   * Make an HTTP Request.
   *
   * TODO: Do not use drupal_http_request.
   *
   * @param string $url
   *   The URL.
   */
  public function request($url);

  /**
   * Request wrapper for querying a CDN.
   *
   * @param string $url
   *   The URL.
   */
  public function query($url);

  /**
   * Get library information.
   *
   * @return array
   *   Return an array containing information about the library.
   */
  public function getInformation();

  /**
   * Get latest version available of a library.
   *
   * @return string
   *   The latest available version of the library.
   */
  public function getLatestVersion();

  /**
   * Perform a search for a library.
   *
   * @return array
   *   The resulting array.
   */
  public function search($library);

  /**
   * Check if a file is available locally.
   *
   * @param string $file
   *   The file to check.
   * @param string $version
   *   The version to check the file against.
   *
   * @return bool
   *   Return TRUE if the file is available, FALSE otherwise.
   */
  public function isLocalAvailable($file, $version);

  /**
   * Get the local file name of a library file.
   *
   * @param string $file
   *   The file to check.
   * @param string $version
   *   The version to check the file against.
   *
   * @return string
   *   Return the file name.
   */
  public function getLocalFileName($file, $version);

  /**
   * Get the local directory name of a library.
   *
   * @param string $version
   *   The version to check the file against.
   *
   * @return string
   *   Return the directory name.
   */
  public function getLocalDirectoryName($version = NULL);

  /**
   * Copy a library from the CDN to the local filesystem.
   *
   * @param array $versions
   *   The library versions to copy.
   */
  public function getLocalCopy(array $versions = array());

  /**
   * Set default scheme for an url.
   *
   * @param string $default
   *   The scheme.
   */
  public function setScheme($default = 'http');

  /**
   * Get the default scheme.
   *
   * @param string $default
   *   The default scheme is none is set.
   */
  public function getScheme($default = 'http');

  /**
   * Return the configuration of the object.
   *
   * @param string $key
   *     A key of configuration.
   *
   * @return mixed
   *    If a configuration item has a value for the key parameter in the
   *    configuration array, then the function will return it, otherwise,
   *    the whole configuration array is returned.
   */
  public function getConfiguration($key = NULL);

  /**
   * Set the configuration of the object.
   *
   * @param array $configuration
   *   The configuration array.
   */
  public function setConfiguration(array $configuration = array());

  /**
   * Return the data to use in each method.
   *
   * @param string $function
   *   The method name.
   * @param array $data
   *   The data from query.
   *
   * @return array
   *   The resulting array.
   */
  public function formatData($function, array $data = array());

}
