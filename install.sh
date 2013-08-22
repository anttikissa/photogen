#!/bin/bash
#
# install.sh -- install photogen in current directory.
# 
# The installation contains files index.html, build/build.js, script.js, and
# style.css.  If they exist in this directory, they will be overwritten.
#

dir=$(dirname $0)

(cd $dir && tar cf - index.html build/build.js script.js style.css) | tar xvf -

