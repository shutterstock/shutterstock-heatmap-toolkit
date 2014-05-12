shutterstock-heatmap-toolkit
============================

Shutterstock's interactive heatmap toolkit powered by heatmap.js and Solr

* [Heatmap.js](http://www.patrick-wied.at/static/heatmapjs/)
* [Apache Solr](https://lucene.apache.org/solr/)


## 1. Build and Run Solr

     # (note, you'll need to have java and maven installed to run solr)
     cd solr
     ./build.sh
     # (update run.sh if necessary to set your path to solr's config)
     ./run.sh

## 2. Index Sample Data

     ./index.sh


## 3. Build and run the web server

     install rockstack from http://www.rockstack.org/
     CENTOS/RHEL Instructions:

     bash -c "$(curl -fsSL https://raw.github.com/rockstack/utils/master/install)"
     sudo yum install rock-runtime-node010


     cd web
     rock build
     rock run bin/server.js

## 4. Install the Heatmap Tool Bookmarklet in Chrome or Firefox

     goto: http://yourserver:8080/install.html
     copy the bookmarklet code
     create a new bookmark
     edit the bookmark and copy the bookmarket code into the url



## 5. Try out the heatmap tool

     Open a browser to any site on the internet
     click on the bookmark in your browser to open the tool
     (Note: on HTTPS you may need to configure your browser 
     to load script from non-secure sources for this demo to run)

