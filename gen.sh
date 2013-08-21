#!/bin/bash

if ! which exiv2 2> /dev/null
then
	echo 'Please install exiv2 before proceeding.'
	exit
fi

for x in *.jpg
do
	exiv2 -pt $x
done
