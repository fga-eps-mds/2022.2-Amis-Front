#!/bin/bash

HASH_COMMIT=$1
TIME=develop

git checkout $HASH_COMMIT
git checkout dev -- sonar-project.properties

npm run test:cov

docker run \
    --rm \
    -e SONAR_HOST_URL="https://sonarcloud.io/" \
    -e SONAR_SCANNER_OPTS=" -Dsonar.projectKey=fga-eps-mds_2022.2-Amis-Front" \
    -e SONAR_LOGIN="ef04f98fa8cabec4bb77b0c7841f067f75468e61" \
    -v "<Path_to_repo>:/usr/src" \
    sonarsource/sonar-scanner-cli


python3 sonar.py 2022.2-Amis-Service $TIME


