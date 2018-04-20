<?php
//
// /**
//  * SilverStripe Module Starter Setup Script.
//  *
//  * PHP version >=5.6.0
//  *
//  * For full copyright and license information, please view the
//  * LICENSE.md file that was distributed with this source code.
//  *
//  * @author Colin Tucker <colin@praxis.net.au>
//  * @copyright 2017 Praxis Interactive
//  * @license https://opensource.org/licenses/BSD-3-Clause BSD-3-Clause
//  * @link https://github.com/praxisnetau/silverstripe-module-starter
//  */
//
// use Exception;
//
// /**
//  * Singleton class which handles the setup of the module.
//  *
//  * @author Colin Tucker <colin@praxis.net.au>
//  * @copyright 2017 Praxis Interactive
//  * @license https://opensource.org/licenses/BSD-3-Clause BSD-3-Clause
//  * @link https://github.com/praxisnetau/silverstripe-module-starter
//  */
// class Setup
// {
//     /**
//      * Name of configuration file.
//      *
//      * @var string
//      * @const
//      */
//     const CONFIG_FILE = 'setup.json';
//
//     /**
//      * Default configuration settings.
//      *
//      * Create a configuration file (setup.json) in the root folder to customise.
//      *
//      * @var array
//      */
//     private static $default_config = [
//         'default-vendor' => 'vendor',
//         'default-module' => 'module',
//         'default-repo-name' => '{vendor}/{module}',
//         'default-repo-url' => 'https://github.com/{vendor}/{module}',
//         'default-module-name' => 'My SilverStripe Module',
//         'default-namespace' => 'Vendor\\Module',
//         'default-author' => 'My Name',
//         'default-email' => 'name@example.com',
//         'default-organisation' => 'My Organisation',
//         'default-homepage' => 'https://www.example.com',
//         'resource-path' => '/resources/{vendor}/{module}',
//         'files' => [
//             '_config.php',
//             '_config/config.yml',
//             'admin/client/src/bundles/bundle.js',
//             'admin/client/src/styles/_variables.scss',
//             'admin/client/src/styles/bundle.scss',
//             'client/src/bundles/bundle.js',
//             'client/src/styles/_variables.scss',
//             'client/src/styles/bundle.scss',
//             'composer.json',
//             'package.json',
//             'webpack.config.js'
//         ]
//     ];
//
//     /**
//      * Holds the singleton instance.
//      *
//      * @var Setup
//      */
//     private static $instance;
//
//     /**
//      * Configuration settings.
//      *
//      * @var array
//      */
//     private $config = [];
//
//     /**
//      * Setup data.
//      *
//      * @var array
//      */
//     private $data = [];
//
//     /**
//      * Answers the singleton instance.
//      *
//      * @return Setup
//      */
//     public static function inst()
//     {
//         if (!self::$instance) {
//             self::$instance = new Setup();
//         }
//
//         return self::$instance;
//     }
//
//     /**
//      * Executes the setup routine.
//      *
//      * @return void
//      */
//     public function run()
//     {
//         try {
//
//             $this->checkFiles();
//
//             $this->gatherData();
//
//             $this->writeFiles();
//
//         } catch (Exception $e) {
//
//             $this->outputError($e->getMessage());
//
//         }
//
//         $this->output('Setup complete!');
//     }
//
//     /**
//      * Defines either the named config value, or the config array.
//      *
//      * @param string|array $arg1
//      * @param string $arg2
//      *
//      * @return $this
//      */
//     public function setConfig($arg1, $arg2 = null)
//     {
//         if (is_array($arg1)) {
//             $this->config = $arg1;
//         } else {
//             $this->config[$arg1] = $arg2;
//         }
//
//         return $this;
//     }
//
//     /**
//      * Answers either the named config value, or the config array.
//      *
//      * @param string $name
//      *
//      * @return mixed
//      */
//     public function getConfig($name = null)
//     {
//         if (!is_null($name)) {
//             return isset($this->config[$name]) ? $this->config[$name] : null;
//         }
//
//         return $this->config;
//     }
//
//     /**
//      * Loads configuration from the specified file.
//      *
//      * @return void
//      */
//     public function loadConfig($file = self::CONFIG_FILE)
//     {
//         if (is_readable($file)) {
//
//             $this->output('Loading config file...');
//
//             $json = file_get_contents($file);
//
//             $config = json_decode($json, true);
//
//             if (is_array($config)) {
//                 $this->mergeConfig($config);
//             }
//
//         }
//     }
//
//     /**
//      * Merges the given array of configuration with the existing configuration.
//      *
//      * @param array $config
//      *
//      * @return $this
//      */
//     public function mergeConfig($config = [])
//     {
//         $this->config = array_merge($this->config, $config);
//
//         return $this;
//     }
//
//     /**
//      * Checks that the files are all valid.
//      *
//      * @throws Exception
//      *
//      * @return void
//      */
//     private function checkFiles()
//     {
//         $this->output('Checking files...');
//
//         foreach ($this->getConfig('files') as $path) {
//
//             if (!is_readable($path)) {
//                 throw new Exception(sprintf('file "%s" is not readable', $path));
//             }
//
//             if (!is_writable($path)) {
//                 throw new Exception(sprintf('file "%s" is not writable', $path));
//             }
//
//         }
//
//         $this->output('Files OK!');
//     }
//
//     /**
//      * Gathers data from the developer.
//      *
//      * @return void
//      */
//     private function gatherData()
//     {
//         $this->output('Gathering setup data...');
//
//         $this->ask('vendor', 'Vendor', $this->getConfig('default-vendor'));
//         $this->ask('module', 'Module', $this->getConfig('default-module'));
//         $this->ask('repo-name', 'Repository name', $this->getConfig('default-repo-name'));
//         $this->ask('repo-url', 'Repository URL', $this->getConfig('default-repo-url'));
//         $this->ask('module-name', 'Module name', $this->getConfig('default-module-name'));
//         $this->ask('namespace', 'Namespace (PSR-4)', $this->getConfig('default-namespace'));
//         $this->ask('description', 'Description', $this->getConfig('default-description'));
//         $this->ask('author', 'Author', $this->getConfig('default-author'));
//         $this->ask('email', 'Email', $this->getConfig('default-email'));
//         $this->ask('organisation', 'Organisation', $this->getConfig('default-organisation'));
//         $this->ask('homepage', 'Homepage', $this->getConfig('default-homepage'));
//         $this->ask('keywords', 'Keywords (comma-separated)', $this->getConfig('default-keywords'));
//
//         $this->cleanNamespace();
//
//         $this->processData();
//     }
//
//     /**
//      * Processes any special-case data values before writing to files.
//      *
//      * @return void
//      */
//     private function processData()
//     {
//         $this->data['year'] = date('Y');
//
//         $this->data['keywords-json'] = $this->getKeywordsJSON();
//
//         $this->data['namespace-psr4'] = $this->getNamespacePSR4();
//
//         if ($this->data['description']) {
//             $this->data['description'] = rtrim($this->data['description'], '.') . '.';
//         }
//     }
//
//     /**
//      * Answers a JSON string containing the module keywords.
//      *
//      * @return string
//      */
//     private function getKeywordsJSON()
//     {
//         $keywords = [];
//
//         if ($this->data['keywords']) {
//             $keywords = preg_split('/[, ]+/', $this->data['keywords'], -1, PREG_SPLIT_NO_EMPTY);
//         }
//
//         return json_encode($keywords);
//     }
//
//     /**
//      * Answers a PSR-4 compatible version of the module namespace for the composer.json file.
//      *
//      * @return string
//      */
//     private function getNamespacePSR4()
//     {
//         return str_replace('\\', '\\\\', $this->data['namespace']) . '\\\\';
//     }
//
//     /**
//      * Cleans up the entered namespace value.
//      *
//      * @return void
//      */
//     private function cleanNamespace()
//     {
//         $this->data['namespace'] = trim(preg_replace("/\\{2,}/", "\\", $this->data['namespace']), '/\\');
//     }
//
//     /**
//      * Writes the setup data to the files.
//      *
//      * @throws Exception
//      *
//      * @return void
//      */
//     private function writeFiles()
//     {
//         $this->output('Writing files...');
//
//         foreach ($this->getConfig('files') as $path) {
//
//             // Output Status:
//
//             $this->output(sprintf('Writing to "%s"...', $path));
//
//             // Read File Contents:
//
//             $contents = file_get_contents($path);
//
//             // Replace Tokens in Contents:
//
//             $contents = $this->replace($contents);
//
//             // Write File Contents:
//
//             file_put_contents($path, $contents);
//
//         }
//     }
//
//     /**
//      * Asks a question to the developer.
//      *
//      * @param string $key
//      * @param string $question
//      * @param string $default
//      *
//      * @return void
//      */
//     private function ask($key, $question, $default = null)
//     {
//         echo $question;
//
//         $default = $this->replace($default);
//
//         if ($default) {
//             echo sprintf(' (default "%s")', $default);
//         }
//
//         echo ": ";
//
//         $handle = fopen('php://stdin', 'r');
//
//         $value = trim(fgets($handle));
//
//         $this->data[$key] = $value ? $value : $default;
//
//         fclose($handle);
//     }
//
//     /**
//      * Outputs the given text to the console.
//      *
//      * @param string $text
//      *
//      * @return void
//      */
//     private function output($text)
//     {
//         echo "> " . $text . "\n";
//     }
//
//     /**
//      * Outputs the given error text to the console.
//      *
//      * @param string $text
//      *
//      * @return void
//      */
//     private function outputError($text)
//     {
//         echo "ERROR: {$text}\n";
//     }
//
//     /**
//      * Outputs the given header text to the console.
//      *
//      * @param string $text
//      *
//      * @return void
//      */
//     private function outputHeader($text)
//     {
//         $this->outputLine();
//
//         echo strtoupper($text) . "\n";
//
//         $this->outputLine();
//     }
//
//     /**
//      * Outputs a line consisting with the given character and length to the console.
//      *
//      * @param string $char
//      *
//      * @return void
//      */
//     private function outputLine($char = '=', $length = 80)
//     {
//         echo str_pad('', $length, $char) . "\n";
//     }
//
//     /**
//      * Replaces named tokens within the given text with values from the data and configuration.
//      *
//      * @param string $text
//      *
//      * @return string
//      */
//     private function replace($text)
//     {
//         // Replace Config Tokens:
//
//         foreach ($this->config as $key => $value) {
//
//             if (is_scalar($value)) {
//                 $text = str_ireplace("{{$key}}", $value, $text);
//             }
//
//         }
//
//         // Replace Data Tokens:
//
//         foreach ($this->data as $key => $value) {
//
//             if (is_scalar($value)) {
//                 $text = str_ireplace("{{$key}}", $value, $text);
//             }
//
//         }
//
//         // Answer Text:
//
//         return $text;
//     }
//
//     /**
//      * Constructs the object upon instantiation (private, in accordance with singleton pattern).
//      */
//     private function __construct()
//     {
//         $this->init();
//     }
//
//     /**
//      * Initialises the object from configuration.
//      *
//      * @return void
//      */
//     private function init()
//     {
//         // Output Header String:
//
//         $this->outputHeader('SilverStripe Module Setup');
//
//         // Define Default Config:
//
//         $this->setConfig(self::$default_config);
//
//         // Load Config File:
//
//         $this->loadConfig(self::CONFIG_FILE);
//     }
// }
//
// // Perform Setup:
//
// Setup::inst()->run();
