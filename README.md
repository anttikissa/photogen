photogen
========

Simple static photo gallery generator

Requirements
------------

* A bunch of photos in a web-accessible directory
* `exiv2` (to extract EXIF metadata from the pictures)
* Being able to run bash scripts

Installation & usage
--------------------

1. Clone this repository somewhere, say into `~/photogen`.

2. `cd where/ever/photos/are`

3. Run `~/photogen/gen.sh`.  This will generate `photos.json` in the current directory.

4. Run `~/photogen/install.sh`.  This will install files `index.html`, `script.js`, `build/build.js`, and `style.css` into the current directory.

5. That's it!

Example gallery
---------------

http://anttisykari.kapsi.fi/photogen-example/

(Images from wallpaperdev.com, iwallscreen.com, mi9.com, fantom-xp.com, hdwallpaperbackgrounds.org)
