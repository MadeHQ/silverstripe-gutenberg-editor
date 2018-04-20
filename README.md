# SilverStripe Module Starter

A starter kit that has everything you need to get underway with a new module for [SilverStripe v4][silverstripe].

## Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Issues](#issues)
- [Contribution](#contribution)
- [Maintainers](#maintainers)
- [License](#license)

## Requirements

- Git
- PHP
- Node.js
- Yarn (or npm)

## Installation

Using `git`, clone the repo to a location of your choice:

```bash
$ git clone https://github.com/praxisnetau/silverstripe-module-starter ./my-repo-name
```

After the repo has cloned, you will need to run the `setup.php` script:

```bash
$ cd my-repo-name
$ php ./setup.php
```

The setup script will ask a series of questions to gather data about
your new module:

```bash
$ php ./setup.php
================================================================================
SILVERSTRIPE MODULE SETUP
================================================================================
> Loading config file...
> Checking files...
> Files OK!
> Gathering setup data...
Vendor (default "vendor"): examplecorp
Module (default "module"): awesome-module
Repository name (default "examplecorp/awesome-module"):
Repository URL (default "https://github.com/examplecorp/awesome-module"):
Module name (default "My SilverStripe Module"): My Awesome Module
Namespace (PSR-4) (default "Vendor\Module"): Example\Awesome
Description: An awesome new SilverStripe module.
Author (default "My Name"): Jane Bloggs
Email (default "name@example.com"): jane@example.com
Organisation (default "My Organisation"): Example Corp
Homepage (default "https://www.example.com"):
Keywords (comma-separated): silverstripe, example
```

If a question has a default value, just hit enter to accept the default.

After answering each question, the script will then process the necessary
files by replacing named tokens in each file with the corresponding setup value.

By default, these files are:

- `_config.php`
- `_config/config.yml`
- `admin/client/src/bundles/bundle.js`
- `admin/client/src/styles/_variables.scss`
- `admin/client/src/styles/bundle.scss`
- `client/src/bundles/bundle.js`
- `client/src/styles/_variables.scss`
- `client/src/styles/bundle.scss`
- `composer.json`
- `package.json`
- `webpack.config.js`

Each file needs to readable and writable. The setup script will first
verify that it can process each file before proceeding.

## Configuration

The setup script supports a `setup.json` file kept in the same location
as `setup.php`. Using this file, you can override any of the default
configuration settings. By forking the repo and adding your own settings
to this file, you can save yourself even more typing. For example:

```json
{
  "default-vendor": "examplecorp",
  "default-author": "Jane Bloggs",
  "default-email": "jane@example.com",
  "default-organisation": "Example Corp",
  "default-homepage": "https://www.example.com"
}
```

## Usage

The module comes pre-configured with everything you need to get underway. Frontend resources
are processed and bundled using [webpack][webpack], and the included config is ready to create bundles for
both the website and the CMS. Your admin bundles will be included in the CMS automatically
(see [config.yml](_config/config.yml)), however you will need to handle loading the website bundles yourself,
e.g. by using `Requirements` in your controller.

A `yarn.lock` file is included with the repo. To install build dependencies, run:

```bash
$ yarn install
```

This will download all of the build dependencies into the `node_modules` folder. Two scripts are pre-configured
for Yarn, `watch` for development, and `build` for production:

```bash
$ yarn watch
```

This will watch your source files and automatically recompile when a change is detected.

```bash
$ yarn build
```

This will prepare your files for distribution by clearing the `dist/` folders and compiling + optimising the
created bundles.

### Bundles

Using the default webpack config, bundle files will be created from your source files in two locations:

- `admin/client/dist/`
- `client/dist/`

These folders are exposed by default within the `composer.json` file, so that when your module is installed into
a SilverStripe v4 app, these folders are automatically exposed in the `resources/` folder.

To include your module bundles for the website, you'll need to load your `dist/` bundles, for example
by using the SilverStripe `Requirements` class in your controller (where `vendor/module` is your repository name):

```php
use SilverStripe\View\Requirements;

Requirements::css('vendor/module: client/dist/styles/bundle.css');
Requirements::javascript('vendor/module: client/dist/js/bundle.js');
```

### Source

The webpack build relies on two pairs of source bundle files for the CMS and website:

- `admin/client/src/bundles/bundle.js`
- `admin/client/src/styles/bundle.scss`
- `client/src/bundles/bundle.js`
- `client/src/styles/bundle.scss`

Each `bundle.js` file will pull in any required JavaScript and Sass styles. By default, each `bundle.js`
requires the `bundle.scss` file to load your styles. Each `bundle.scss` file imports variables from the
`_variables.scss` file by default.

The general idea is to add your own JavaScript under each `src/` folder for anything you need, and to add your styles
as `.scss` files under the `src/styles/` folder. Then edit each bundle to require or import your source files. For
example:

#### Example Script Bundle

```js
/* Module Bundle
===================================================================================================================== */

// Load Styles:

require('styles/bundle.scss');

// Load Scripts:

require('pages/MyPage.js');
```

This would require the file `src/pages/MyPage.js`.

#### Example Style Bundle

```sass
/* Module Bundle
===================================================================================================================== */

// Import Variables:

@import "variables";

// Import Styles:

@import "pages/MyPage";
```

This would import the file `src/styles/pages/MyPage.scss`.

### Icons

Copy any icon files required for your SilverStripe page classes into the `admin/client/src/images/icons/` folder.
These images will be copied to the `admin/client/dist/` folder upon `watch` or `build`. You can reference these icons
in your classes by using the following notation (where `vendor/module` is your repository name):

```php
class MyPage extends Page
{
    private static $icon = 'vendor/module: admin/client/dist/images/icons/MyPage.png';
}
```

## Issues

Please use the [GitHub issue tracker][issues] for bug reports and feature requests.

## Contribution

Your contributions are gladly welcomed to help make this project better.
Please see [contributing](CONTRIBUTING.md) for more information.

## Maintainers

[![Colin Tucker](https://avatars3.githubusercontent.com/u/1853705?s=144)](https://github.com/colintucker) | [![Praxis Interactive](https://avatars2.githubusercontent.com/u/1782612?s=144)](http://www.praxis.net.au)
---|---
[Colin Tucker](https://github.com/colintucker) | [Praxis Interactive](http://www.praxis.net.au)

## License

[BSD-3-Clause](LICENSE.md) &copy; Praxis Interactive

[silverstripe]: https://github.com/silverstripe/silverstripe-framework
[webpack]: https://webpack.js.org
[issues]: https://github.com/praxisnetau/silverstripe-module-starter/issues
