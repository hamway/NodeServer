#!/bin/bash

echo "Start only form project root."
echo "Press [Enter] to continue..."
read

PROJECT_ROOT=`pwd`
BOWER_PATH='bower_components'

if [ -d $PROJECT_ROOT/$BOWER_PATH ]; then
    cd $PROJECT_ROOT/$BOWER_PATH/
	for folder in *; do
	  if [ ! -d $PROJECT_ROOT/public/js/$folder ]; then
	   echo "Create link for {$folder}..."
	    ln -s $PROJECT_ROOT/$BOWER_PATH/$folder $PROJECT_ROOT/public/js
	  else
	    echo "Link for {$folder} allready exist"
	  fi
	done
else
	echo "Need run: bower init"
fi