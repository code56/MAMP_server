<?php

/**
 * @file
 * Contains \Drupal\Tests\Libraries_cdn\Plugin\LibrariesCDN\JSDelivrTest.
 */

namespace Drupal\Tests\libraries_cdn\Plugin\LibrariesCDN;
use Drupal\libraries_cdn\Plugin\LibrariesCDN\JSDelivr;
use Drupal\libraries_cdn\Type\CDNBaseInterface;
use Drupal\service_container\Legacy\Drupal7;

/**
 * @coversDefaultClass \Drupal\libraries_cdn\Plugin\LibrariesCDN\JSDelivr
 */
class JSDelivrTest extends \PHPUnit_Framework_TestCase {

  /* @var CDNBaseInterface $plugin */
  protected $plugin;

  /* @var Drupal7 $drupal7 */
  protected $drupal7;

  /**
   * {@inheritdoc}
   */
  protected function setUp() {
    parent::setUp();

    $this->drupal7 = \Mockery::mock('\Drupal\service_container\Legacy\Drupal7');
    $this->plugin = new JSDelivr(array(), 'jsdelivr', array(), $this->drupal7);
  }

  /**
   * @covers ::setLibrary()
   * @covers ::getLibrary()
   */
  public function test_setgetLibrary() {
    $this->plugin->setLibrary('jquery');
    $this->assertEquals('jquery', $this->plugin->getLibrary());
  }

  /**
   * @covers ::setScheme()
   * @covers ::getScheme()
   */
  public function test_setgetScheme() {
    $this->assertEquals('http', $this->plugin->getScheme());

    $this->assertEquals('ftp', $this->plugin->getScheme('ftp'));

    $this->plugin->setScheme('https');
    $this->assertEquals('https', $this->plugin->getScheme());

    $this->plugin->setScheme();
    $this->assertEquals('http', $this->plugin->getScheme());
  }

  /**
   * @covers ::setURL()
   * @covers ::getURL()
   */
  public function test_setgetURL() {
    $this->plugin->setURL('test', 'hello');
    $this->assertEquals('hello', $this->plugin->getURL('test'));
  }

  /**
   * @covers ::setURLs()
   * @covers ::getURLs()
   */
  public function test_setgetURLs() {
    $urls = array(
      'test1' => 'url1',
      'test2' => 'url2',
    );
    $this->plugin->setURLs($urls);
    $this->assertSame($urls, $this->plugin->getURLs());
  }

  /**
   * @covers ::setConfiguration()
   * @covers ::getConfiguration()
   */
  public function test_setgetConfiguration() {
    $configuration = array(
      'test1' => 'url1',
      'test2' => 'url2',
    );
    $this->plugin->setConfiguration($configuration);
    $this->assertSame($configuration + array('available' => NULL), $this->plugin->getConfiguration());
    $this->assertEquals('url2', $this->plugin->getConfiguration('test2'));
    $this->assertEmpty($this->plugin->getConfiguration('inexistant_property'));
  }

  /**
   * @covers ::isAvailable()
   */
  public function test_isAvailable() {
    // Test 1
    $this->plugin->setLibrary('jquery');

    $configuration = $this->plugin->getConfiguration();
    $url = sprintf($configuration['urls']['isAvailable'], $this->plugin->getLibrary());

    $this->drupal7->shouldReceive('drupal_http_request')
      ->once()
      ->with($url, array())
      ->andReturn(array(
        'code' => 200,
        'data' => '{"results":[{"name":"test1"},{"name":"test2"}]}',
      ));
    // This is executed twice to test $configuration['available'].
    $this->assertTrue($this->plugin->isAvailable());
    $this->assertTrue($this->plugin->isAvailable());

    // Test 2
    $this->plugin->setLibrary('Its a trap');

    $configuration = $this->plugin->getConfiguration();
    $url = sprintf($configuration['urls']['isAvailable'], $this->plugin->getLibrary());

    $this->drupal7->shouldReceive('drupal_http_request')
      ->once()
      ->with($url, array())
      ->andReturn(array('code' => 200, 'data' => '[]'));
    // This is executed twice to test $configuration['available'].
    $this->assertFalse($this->plugin->isAvailable());
    $this->assertFalse($this->plugin->isAvailable());

    // Test 3
    $this->plugin->setLibrary('jquery');

    $url = 'http://api.jsdelivr.com/fake_url?search=%s';
    $this->plugin->setURL('isAvailable', $url);

    $this->drupal7->shouldReceive('drupal_http_request')
      ->once()
      ->with(sprintf($url, $this->plugin->getLibrary()), array())
      ->andReturn(array('code' => 404));
    // This is executed twice to test $configuration['available'].
    $this->assertFalse($this->plugin->isAvailable());
    $this->assertFalse($this->plugin->isAvailable());


    // Test 4
    $this->plugin->setLibrary('jquery');

    $configuration = $this->plugin->getConfiguration();
    $url = sprintf($configuration['urls']['isAvailable'], $this->plugin->getLibrary());

    $this->drupal7->shouldReceive('drupal_http_request')
      ->with($url, array())
      ->andReturn(array(
        'code' => 200,
        'data' => '{"results":[{"name":"test1"},{"name":"test2"}]}',
      ));
    // This is executed twice to test $configuration['available'].
    $this->assertTrue($this->plugin->isAvailable());
    $this->assertTrue($this->plugin->isAvailable());
  }

  /**
   * @covers ::request()
   */
  public function test_request() {
    // Test 1
    $url = 'http://drupal.org/';
    $this->drupal7->shouldReceive('drupal_http_request')
      ->with($url, array())
      ->andReturn(array('code' => 200, 'data' => 'it works'));

    $request = $this->plugin->request($url);

    $this->assertEquals('it works', $request['data']);

    // Test 2
    $url = 'http://ThisUrlDoesntExists.org/';
    $this->drupal7->shouldReceive('drupal_http_request')
      ->with($url, array())
      ->andReturn(array('code' => 500));

    $request = $this->plugin->request($url);

    $this->assertEquals(500, $request['code']);
  }

  /**
   * @covers ::query()
   */
  public function test_query() {
    // Test 1
    $this->plugin->setLibrary('jquery');
    $configuration = $this->plugin->getConfiguration();

    $this->drupal7->shouldReceive('drupal_http_request')
      ->with(sprintf($configuration['urls']['getInformation'], $this->plugin->getLibrary()), array())
      ->andReturn(array('code' => 200, 'data' => '{"name":"jquery"}'));

    $data = $this->plugin->query($configuration['urls']['getInformation']);

    $this->assertEquals('jquery', $data['name']);

    // Test 2
    $this->plugin->setLibrary('jquery');
    $backup = $this->plugin->getURL('getInformation');
    $url = 'http://api.jsdelivr.com/fake_url?search=%s';
    $this->plugin->setURL('getInformation', $url);
    $configuration = $this->plugin->getConfiguration();

    $this->drupal7->shouldReceive('drupal_http_request')
      ->with(sprintf($configuration['urls']['getInformation'], $this->plugin->getLibrary()), array())
      ->andReturn(array('code' => 404));

    $data = $this->plugin->query($configuration['urls']['getInformation']);

    $this->assertEmpty($data);
    $this->plugin->setURL('getInformation', $backup);
  }

  /**
   * @covers ::convertFiles()
   */
  public function test_convertFiles() {
    $this->plugin->setLibrary('jquery');

    $urls = $this->plugin->getConfiguration('urls');

    $files = array(
      'file1.js',
      'file2.js',
    );

    $version = '1.0';

    $data = $this->plugin->convertFiles($files, $version);

    foreach ($data as $key => $file) {
      $url = sprintf($urls['convertFiles'], $this->plugin->getLibrary(), $version) . $files[$key];
      $this->assertEquals($url, $file);
    }
  }

  /**
   * @covers ::getLatestVersion()
   */
  public function test_getLatestVersion() {
    // Test 1
    $this->plugin->setLibrary('ol3');

    $results = array(
      array(
        'name' => 'ol3',
        'lastversion' => '3.8.2',
      ),
    );

    $urls = $this->plugin->getConfiguration('urls');
    $url = sprintf($urls['getInformation'], $this->plugin->getLibrary());

    $this->drupal7->shouldReceive('drupal_http_request')
      ->once()
      ->with($url, array())
      ->andReturn(
        array(
          'code' => 200,
          'data' => json_encode($results),
        )
      );

    $this->assertEquals('3.8.2', $this->plugin->getLatestVersion());


    // Test 2
    $this->plugin->setLibrary('ol3');

    $urls = $this->plugin->getConfiguration('urls');
    $url = sprintf($urls['getInformation'], $this->plugin->getLibrary());

    $this->drupal7->shouldReceive('drupal_http_request')
      ->once()
      ->with($url, array())
      ->andReturn(array('code' => 500));

    $this->assertEmpty($this->plugin->getLatestVersion());


    // Test 3
    $this->plugin->setLibrary('ol3');

    $urls = $this->plugin->getConfiguration('urls');
    $url = sprintf($urls['getInformation'], $this->plugin->getLibrary());

    $this->drupal7->shouldReceive('drupal_http_request')
      ->once()
      ->with($url, array())
      ->andReturn(array('code' => 200, 'data' => '{"name":"ol3"}'));

    $this->assertEmpty($this->plugin->getLatestVersion());
  }

  /**
   * @covers ::getInformation()
   */
  public function test_getInformation() {
    // Test 1
    $this->plugin->setLibrary('ol3');

    $results = array(
      array(
        'name' => 'ol3',
        'lastversion' => '3.8.2',
      ),
    );

    $urls = $this->plugin->getConfiguration('urls');
    $url = sprintf($urls['getInformation'], $this->plugin->getLibrary());

    $this->drupal7->shouldReceive('drupal_http_request')
      ->once()
      ->with($url, array())
      ->andReturn(
        array(
          'code' => 200,
          'data' => json_encode($results),
        )
      );

    $data = $this->plugin->getInformation();

    $this->assertNotEmpty($data['name']);
  }

  /**
   * @covers ::search()
   */
  public function test_search() {
    // Test 1
    $this->plugin->setLibrary('jquery');

    $results = array(
        array('name' => 'test1'),
        array('name' => 'test2'),
        array('name' => 'test3'),
    );

    $urls = $this->plugin->getConfiguration('urls');

    $url = sprintf($urls['isAvailable'], $this->plugin->getLibrary());
    $this->drupal7->shouldReceive('drupal_http_request')
      ->with($url, array())
      ->andReturn(array(
        'code' => 200,
        'data' => json_encode($results),
      ));

    $url = sprintf($urls['search'], $this->plugin->getLibrary());
    $this->drupal7->shouldReceive('drupal_http_request')
      ->with($url, array())
      ->andReturn(array(
        'code' => 200,
        'data' => json_encode($results),
      ));

    $data = $this->plugin->search($this->plugin->getLibrary());
    $results = $this->plugin->formatData('search', $results);

    foreach ($data as $key => $result) {
      $this->assertEquals($results[$key]['name'], $result);
    }

    // Test 2
    $this->plugin->setLibrary('It\'s a trap');

    $urls = $this->plugin->getConfiguration('urls');

    $url = sprintf($urls['isAvailable'], $this->plugin->getLibrary());
    $this->drupal7->shouldReceive('drupal_http_request')
      ->with($url, array())
      ->andReturn(array(
        'code' => 200,
        'data' => json_encode($results),
      ));

    $url = sprintf($urls['search'], $this->plugin->getLibrary());
    $this->drupal7->shouldReceive('drupal_http_request')
      ->with($url, array())
      ->andReturn(array(
        'code' => 500,
      ));

    $data = $this->plugin->search($this->plugin->getLibrary());
    $this->assertEmpty($data);
  }


  /**
   * @covers ::getVersions()
   */
  public function test_getVersions() {
    // Test 1
    $this->plugin->setLibrary('jquery');

    $results = array(
        array('name' => 'jquery', 'files' => array('test1.js', 'test1.css'), 'version' => '1.0', 'assets' => array(array('version' => '1.10.0'))),
    );

    $urls = $this->plugin->getConfiguration('urls');

    $url = sprintf($urls['isAvailable'], $this->plugin->getLibrary());
    $this->drupal7->shouldReceive('drupal_http_request')
      ->once()
      ->with($url, array())
      ->andReturn(array(
        'code' => 200,
        'data' => json_encode($results),
      ));

    $url = sprintf($urls['getVersions'], $this->plugin->getLibrary());
    $this->drupal7->shouldReceive('drupal_http_request')
      ->once()
      ->with($url, array())
      ->andReturn(array(
        'code' => 200,
        'data' => json_encode($results),
      ));


    $data = $this->plugin->getVersions();
    $results = $this->plugin->formatData('getVersions', $results);

    foreach ($data as $key => $result) {
      $this->assertEquals($results[$key]['version'], $result);
    }

    // Test 2

    $results = array(
      array('name' => 'jquery', 'files' => array('test1.js', 'test1.css'), 'version' => '1.0', 'assets' => array(array('version' => '1.10.0'))),
    );

    $this->plugin->setLibrary('jquery');
    $urls = $this->plugin->getConfiguration('urls');

    $url = sprintf($urls['isAvailable'], $this->plugin->getLibrary());
    $this->drupal7->shouldReceive('drupal_http_request')
      ->once()
      ->with($url, array())
      ->andReturn(array(
        'code' => 200,
        'data' => json_encode($results),
      ));

    $url = sprintf($urls['getVersions'], $this->plugin->getLibrary());
    $this->drupal7->shouldReceive('drupal_http_request')
      ->once()
      ->with($url, array())
      ->andReturn(array(
        'code' => 200,
        'data' => '{"assets":"bonjour"}',
      ));

    $this->assertEmpty($this->plugin->getVersions());

    // Test 3
    $this->plugin->setLibrary('jquery');
    $this->plugin->setURL('isAvailable', 'http://api.jsdelivr.com/fake_url?search=%s');
    $urls = $this->plugin->getConfiguration('urls');

    $this->drupal7->shouldReceive('drupal_http_request')
      ->once()
      ->with(sprintf($urls['isAvailable'], $this->plugin->getLibrary()), array())
      ->andReturn(array('code' => 404));

    $this->assertEmpty($this->plugin->getVersions());
  }


  /**
   * @covers ::getFiles()
   */
  public function test_getFiles() {
    // Test 1
    $this->plugin->setLibrary('jquery');

    $results = array(
      'assets' => array(
        array('files' => array('test1.js', 'test1.css'), 'version' => '1.0'),
        array('files' => array('test2.js', 'test2.css'), 'version' => '2.0'),
        array('files' => array('test3.js', 'test3.css'), 'version' => '3.0'),
      ),
    );

    $urls = $this->plugin->getConfiguration('urls');

    $url = sprintf($urls['isAvailable'], $this->plugin->getLibrary());
    $this->drupal7->shouldReceive('drupal_http_request')
      ->once()
      ->with($url, array())
      ->andReturn(array(
        'code' => 200,
        'data' => json_encode($results),
      ));

    $url = sprintf($urls['getFiles'], $this->plugin->getLibrary());
    $this->drupal7->shouldReceive('drupal_http_request')
      ->once()
      ->with($url, array())
      ->andReturn(array(
        'code' => 200,
        'data' => json_encode($results),
      ));

    $data = $this->plugin->getFiles();
    $results = $this->plugin->formatData('getFiles', $results);

    $this->assertCount(count($results), $data);


    // Test 2
    $this->plugin->setLibrary('jquery');
    $this->plugin->setURL('isAvailable', 'http://api.jsdelivr.com/fake_url?search=%s');
    $urls = $this->plugin->getConfiguration('urls');

    $this->drupal7->shouldReceive('drupal_http_request')
      ->once()
      ->with(sprintf($urls['isAvailable'], $this->plugin->getLibrary()), array())
      ->andReturn(array('code' => 404));

    $this->assertEmpty($this->plugin->getFiles());
  }

  /**
   * @covers ::getLocalDirectoryName()
   */
  public function test_getLocalDirectoryName() {
    $this->plugin->setLibrary('jquery');
    $version = 3.14;
    $this->assertEquals('public://libraries/' . $this->plugin->getPluginId() . '/' . $this->plugin->getLibrary() . '/' . $version, $this->plugin->getLocalDirectoryName($version));
  }

  /**
   * @covers ::getLocalFileName()
   */
  public function test_getLocalFileName() {
    $this->plugin->setLibrary('jquery');
    $filename = 'jquery.js';
    $version = 3.14;
    $this->assertEquals('public://libraries/' . $this->plugin->getPluginId() . '/' . $this->plugin->getLibrary() . '/' . $version . '/' . $filename, $this->plugin->getLocalFileName($filename, $version));
  }

}
