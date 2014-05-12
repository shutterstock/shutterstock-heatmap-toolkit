export HTTP_PORT=8990
export SOLR_MASTER_PORT=8990

# set this to point to the directory containing solr-config.xml
export SOLR_HOME_DIR=$HOME/shutterstock-heatmap-toolkit/solr/solr-home

# set this to the directory where solr's index should be stored
export SOLR_DATA_DIR=$HOME/shutterstock-heatmap-toolkit/solr-data
cd deps
java \
    -Xms${JAVA_MEMORY_MAX:-"1G"} \
    -Xmx${JAVA_MEMORY_MAX:-"1G"} \
    -XX:+UseG1GC \
    -XX:MaxGCPauseMillis=200 \
    -server \
    -da \
    -dsa \
    -d${JAVA_ARCH:-"64"} \
    -Denable.master=${SOLR_MASTER:-"true"} \
    -Denable.slave=${SOLR_SLAVE:-"false"} \
    -Dsolr.master-host=${SOLR_MASTER_HOST:-"localhost"} \
    -Dsolr.master-port=${SOLR_MASTER_PORT:-"8983"} \
    -Dsolr.solr.home=${SOLR_HOME_DIR} \
    -Dsolr.dataDir=${SOLR_DATA_DIR} \
    -Djetty.port=${HTTP_PORT:-"5000"} \
    -Djava.util.logging.config.file=${SOLR_HOME_DIR}/logging.properties \
    -jar 'start.jar'
