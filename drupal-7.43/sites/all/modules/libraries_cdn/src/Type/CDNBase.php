<?php
/**
 * @file
 * Class CDNBase.
 */

namespace Drupal\libraries_cdn\Type;
use Drupal\Component\Plugin\PluginBase;
use Drupal\service_container\Legacy\Drupal7;

/**
 * Class CDNBase.
 */
abstract class CDNBase extends PluginBase implements CDNBaseInterface {
  /**
   * {@inheritdoc}
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition, Drupal7 $drupal7) {
    $this->drupal7 = $drupal7;
    parent::__construct($configuration, $plugin_id, $plugin_definition);
  }

  /**
   * {@inheritdoc}
   */
  public function setConfiguration(array $configuration = array()) {
    $this->configuration = $configuration;
    $this->configuration['available'] = NULL;
  }

  /**
   * {@inheritdoc}
   */
  public function getConfiguration($key = NULL) {
    if (isset($key) && is_string($key)) {
      if (isset($this->configuration[$key])) {
        return $this->configuration[$key];
      }
      else {
        return NULL;
      }
    }
    else {
      return $this->configuration;
    }
  }

  /**
   * {@inheritdoc}
   */
  public function setLibrary($library) {
    $this->configuration['library'] = $library;
    $this->configuration['available'] = NULL;
  }

  /**
   * {@inheritdoc}
   */
  public function getLibrary() {
    return $this->configuration['library'];
  }

  /**
   * {@inheritdoc}
   */
  public function setURL($identifier, $url) {
    $this->configuration['urls'][$identifier] = $url;
    $this->configuration['available'] = NULL;
  }

  /**
   * {@inheritdoc}
   */
  public function getURL($identifier) {
    return isset($this->configuration['urls'][$identifier]) ? $this->configuration['urls'][$identifier] : FALSE;
  }

  /**
   * {@inheritdoc}
   */
  public function setURLs(array $urls = array()) {
    $this->configuration['urls'] = $urls;
    $this->configuration['available'] = NULL;
  }

  /**
   * {@inheritdoc}
   */
  public function getURLs() {
    return $this->configuration['urls'];
  }

  /**
   * {@inheritdoc}
   */
  public function setScheme($default = 'http') {
    $this->configuration['scheme'] = trim(substr($default, 0, 5));
  }

  /**
   * {@inheritdoc}
   */
  public function getScheme($default = 'http') {
    return empty($this->configuration['scheme']) ? $default : $this->configuration['scheme'];
  }

  /**
   * {@inheritdoc}
   */
  public function request($url) {
    return (array) $this->drupal7->drupal_http_request($url, (array) $this->getConfiguration('request'));
  }

  /**
   * {@inheritdoc}
   */
  public function query($url) {
    list($scheme, $url) = explode('://', $url, 2);
    $request = $this->request(sprintf('%s://' . $url, $this->getScheme($scheme), $this->getLibrary()));
    if ($request['code'] != 200) {
      return array();
    }
    return json_decode($request['data'], TRUE);
  }

  /**
   * {@inheritdoc}
   */
  public function getLatestVersion() {
    return $this->formatData(__FUNCTION__, $this->getInformation());
  }

  /**
   * {@inheritdoc}
   */
  public function search($library) {
    $this->setLibrary($library);

    if (!$this->isAvailable()) {
      return array();
    }

    $data = $this->formatData(__FUNCTION__, $this->query($this->getURL(__FUNCTION__)));

    return array_map(function($v) {
      return $v['name'];
    }, $data);
  }

  /**
   * {@inheritdoc}
   */
  public function isAvailable() {
    if (isset($this->configuration['available'])) {
      return (bool) $this->configuration['available'];
    }

    $data = $this->query($this->getURL(__FUNCTION__));

    if (count($this->formatData(__FUNCTION__, $data)) !== 0) {
      $this->configuration['available'] = TRUE;
      return TRUE;
    }
    else {
      $this->configuration['available'] = FALSE;
      return FALSE;
    }
  }

  /**
   * {@inheritdoc}
   */
  public function getVersions() {
    if (!$this->isAvailable()) {
      return array();
    }

    $data = $this->formatData(__FUNCTION__, $this->query($this->getURL(__FUNCTION__)));

    return array_filter(array_map(function($v) {
      return isset($v['version']) ? $v['version'] : NULL;
    }, $data));
  }

  /**
   * {@inheritdoc}
   */
  public function getFiles(array $versions = array()) {
    if (!$this->isAvailable()) {
      return array();
    }

    $data = $this->formatData(__FUNCTION__, $this->query($this->getURL(__FUNCTION__)));

    $results = array();
    foreach ($data as $asset) {
      if (isset($asset['version']) && isset($asset['files']) && is_array($asset['files'])) {
        $results[$asset['version']] = $this->convertFiles($asset['files'], $asset['version']);
      }
    }

    return empty($versions) ? $results : array_intersect_key($results, array_combine(array_values($versions), array_values($versions)));
  }

  /**
   * {@inheritdoc}
   */
  public function getInformation() {
    return $this->formatData(__FUNCTION__, $this->query($this->getURL(__FUNCTION__)));
  }

  /**
   * {@inheritdoc}
   */
  public function convertFiles(array $files, $version) {
    $url = $this->getURL(__FUNCTION__);
    return array_map(function($v) use ($url, $version) {
      return sprintf($url, $this->getLibrary(), $version) . $v;
    }, $files);
  }

  /**
   * {@inheritdoc}
   */
  public function isLocalAvailable($file, $version) {
    return file_exists($this->getLocalFileName(basename($file), $version));
  }

  /**
   * {@inheritdoc}
   */
  public function getLocalFileName($file, $version) {
    return $this->getLocalDirectoryName($version) . '/' . basename($file);
  }

  /**
   * {@inheritdoc}
   */
  public function getLocalDirectoryName($version = NULL) {
    return implode(
      '/',
      array(
        'public:/',
        'libraries',
        $this->getPluginId(),
        $this->getLibrary(),
        $version,
      )
    );
  }

  /**
   * {@inheritdoc}
   */
  public function getLocalCopy(array $versions = array()) {
    $assets = $this->getFiles();

    if (!empty($versions)) {
      $assets = array_intersect_key($assets, array_combine($versions, $versions));
    }

    foreach ($assets as $version => $files) {
      foreach ($files as $file) {
        if (!$this->isLocalAvailable($file, $version)) {
          $directory = $this->getLocalDirectoryName($version);
          $this->drupal7->file_prepare_directory($directory, FILE_CREATE_DIRECTORY);
          $this->drupal7->file_prepare_directory($directory, FILE_MODIFY_PERMISSIONS);
          $request = $this->request($this->getScheme() . ':' . $file);
          if ($request['code'] == 200) {
            $this->drupal7->file_unmanaged_save_data($request['data'], $this->getLocalFileName($file, $version), FILE_EXISTS_REPLACE);
          }
        }
      }
    }
  }

  /**
   * {@inheritdoc}
   */
  public function formatData($function, array $data = array()) {
    return $data;
  }

}
