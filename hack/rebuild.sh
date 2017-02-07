#!/bin/bash -e

LAST_RELEASE="$(grep 'NODE_VERSION=' nodejs.org/Dockerfile | cut -d'=' -f2 | cut -d' ' -f2)"
LAST_RELEASES="$VERSIONS"
LATEST_RELEASE="$(./hack/latest.js | cut -f4 -d' ')"
LATEST_RELEASES="$(node ./hack/latest.js)"
NUMS="$(seq 1 `echo $LAST_RELEASES | wc -w`)"
#Files with hard-coded version strings:
LAST_UPDATES_NEEDED="centos7-s2i-nodejs.json \
  image-streams-candidate.json \
  image-streams.json \
  README.md"
LATEST_UPDATES_NEEDED="hack/build.sh \
  nodejs.org/Dockerfile \
  nodejs.org/Dockerfile.onbuild"

echo "Latest release      : $LATEST_RELEASE"
echo "Last release        : $LAST_RELEASE"
echo
echo "All latest releases : $LATEST_RELEASES"
echo "All last releases   : $LAST_RELEASES"

if [ "${LAST_RELEASES}" != "${LATEST_RELEASES}" ] ; then
  echo "New NodeJS releases available!"
  sed -i -e "s/VERSIONS.*/VERSIONS = $LATEST_RELEASES/" Makefile

  for release in $NUMS ; do
    last="$( echo ${LAST_RELEASES} | cut -d' ' -f$release )"
    latest="$( echo ${LATEST_RELEASES} | cut -d' ' -f$release )"
    if [ $last != $latest ] ; then
      echo "Updating v$last to v$latest"
      for file in $LAST_UPDATES_NEEDED ; do
        sed -i -e "s/${last}/${latest}/g" $file
      done
    fi
  done

  if [ "${LAST_RELEASE}" != "${LATEST_RELEASE}" ] ; then
    for file in $LATEST_UPDATES_NEEDED ; do
      sed -i -e "s/${LAST_RELEASE}/${LATEST_RELEASE}/g" $file
    done
  fi

  docker pull openshift/base-centos7
else
  echo "No new NodeJS releases found"
fi
