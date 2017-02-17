BASE_IMAGE_NAME=s2i-nodejs
ONBUILD_IMAGE_NAME=nodejs
NAMESPACE=bucharestgold
VERSIONS=4.7.3 5.12.0 6.9.5 7.5.0

include build/common.mk
