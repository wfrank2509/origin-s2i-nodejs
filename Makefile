BASE_IMAGE_NAME=s2i-nodejs
ONBUILD_IMAGE_NAME=nodejs
NAMESPACE=wolfgangfrank
VERSIONS=4.8.0 5.12.0 6.10.0 7.7.1

include build/common.mk
