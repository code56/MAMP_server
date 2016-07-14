<?php
/**
 * @file
 * Plugin: CDNJS.
 */

namespace Drupal\libraries_cdn\Plugin\LibrariesCDN;

use Drupal\Component\Plugin\PluginBase;
use Drupal\libraries_cdn\Component\Annotation\LibrariesCDNPlugin;
use Drupal\libraries_cdn\Type\CDNBase;
use Drupal\service_container\Legacy\Drupal7;

/**
 * Class CDNJS.
 *
 * @LibrariesCDNPlugin(
 *  id = "cdnjs",
 *  description = "CDNJS Integration",
 *  arguments = {
 *    "@drupal7"
 *  }
 * )
 */
class CDNJS extends CDNBase {
  /**
   * {@inheritdoc}
   */
  public function __construct(array $configuration, $plugin_id, array $plugin_definition, Drupal7 $drupal7) {
    if (empty($configuration['urls'])) {
      $configuration['urls'] = array();
    }
    $configuration['urls'] += array(
      'isAvailable' => 'http://api.cdnjs.com/libraries?search=%s',
      'getInformation' => 'http://api.cdnjs.com/libraries/%s',
      'getVersions' => 'http://api.cdnjs.com/libraries/%s',
      'getFiles' => 'http://api.cdnjs.com/libraries/%s',
      'search' => 'http://api.cdnjs.com/libraries?search=%s',
      'convertFiles' => '//cdnjs.cloudflare.com/ajax/libs/%s/%s/',
    );

    parent::__construct($configuration, $plugin_id, $plugin_definition, $drupal7);
  }

  /**
   * {@inheritdoc}
   */
  public function formatData($function, array $data = array()) {
    switch ($function) {
      case 'search':
      case 'isAvailable':
        return isset($data['results']) ? (array) $data['results'] : $data;

      case 'getVersions':
      case 'getFiles':
        return isset($data['assets']) ? (array) $data['assets'] : $data;

      case 'getLatestVersion':
        return isset($data['version']) ? $data['version'] : NULL;

      default:
        return $data;
    }
  }

}
