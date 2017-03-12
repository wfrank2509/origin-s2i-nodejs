Origin S2I NodeJS
=================

This repository contains sources for an [s2i](https://github.com/openshift/source-to-image) builder image, based on CentOS7 and Node.js releases from nodejs.org.

If you are interested in developing against SCL-based Node.js releases, try [sti-nodejs](https://github.com/openshift/sti-nodejs).

[![docker hub stats](http://dockeri.co/image/wolfgangfrank/centos7-s2i-nodejs)](https://hub.docker.com/r/wolfgangfrank/centos7-s2i-nodejs/)

[![](https://images.microbadger.com/badges/image/wolfgangfrank/centos7-s2i-nodejs.svg)](https://microbadger.com/images/wolfgangfrank/centos7-s2i-nodejs "Get your own image badge on microbadger.com")

For more information about using these images with OpenShift, please see the
official [OpenShift Documentation](https://docs.openshift.org/latest/using_images/s2i_images/nodejs.html).

Versions
---------------
Node.JS versions [currently provided](https://hub.docker.com/r/wolfgangfrank/centos7-s2i-nodejs/tags/):

<!-- versions.start -->
* **`7.7.1`**: (7.7.1, 7, 7.7, current, latest)
* **`6.10.0`**: (6.10.0, 6, 6.10, lts, Boron)
* **`5.12.0`**: (5.12.0, 5, 5.12)
* **`4.8.0`**: (4.8.0, 4, 4.8, lts, Argon)
<!-- versions.end -->

Usage
---------------------------------

OpenShift allows you to quickly start a build using the web console, or the CLI.

The [`oc` command-line tool](https://github.com/openshift/origin/releases) can be used to start a build, layering your desired nodejs `REPO_URL` sources into a centos7 image with your selected `RELEASE` of Node.js via the following command format:

    oc new-app wolfgangfrank/centos7-s2i-nodejs:RELEASE~REPO_URL

For example, you can run a build (including `npm install` steps), using  [`http-base`](http://github.com/bucharest-gold/http-base) example repo, and the `current` relase of nodejs with:

    oc new-app wolfgangfrank/centos7-s2i-nodejs:current~http://github.com/bucharest-gold/http-base

Or, to run the latest `lts` release:

    oc new-app wolfgangfrank/centos7-s2i-nodejs:lts~http://github.com/bucharest-gold/http-base

You can try using any of the available tagged Node.js releases, and your own repo sources - as long as your application source will init correctly with `npm start`, and listen on port 8080.

Environment variables
---------------------

Application developers can use the following environment variables to configure the runtime behavior of this image:

NAME        | Description
------------|-------------
NPM_RUN     | Select an alternate / custom runtime mode, defined in your `package.json` file's [`scripts`](https://docs.npmjs.com/misc/scripts) section (default: npm run "start")
NPM_MIRROR  | Sets the npm registry URL
NODE_ENV    | NodeJS runtime mode (default: "production")
HTTP_PROXY  | use an npm proxy during assembly
HTTPS_PROXY | use an npm proxy during assembly

One way to define a set of environment variables is to include them as key value pairs in your repo's `.s2i/environment` file.

Example: DATABASE_USER=sampleUser

#### NOTE: Define your own "`DEV_MODE`":

The following `package.json` example includes a `scripts.dev` entry.  You can define your own custom [`NPM_RUN`](https://docs.npmjs.com/cli/run-script) scripts in your application's `package.json` file.

### Using Docker's exec

To change your source code in a running container, use Docker's [exec](http://docker.io) command:
```
$ docker exec -it <CONTAINER_ID> /bin/bash
```

After you [Docker exec](http://docker.io) into the running container, your current directory is set to `/opt/app-root/src`, where the source code for your application is located.

### Using OpenShift's rsync

If you have deployed the container to OpenShift, you can use [oc rsync](https://docs.openshift.org/latest/dev_guide/copy_files_to_container.html) to copy local files to a remote container running in an OpenShift pod.

Builds
------

The [Source2Image cli tools](https://github.com/openshift/source-to-image/releases) are available as a standalone project, allowing you to [run builds outside of OpenShift](https://github.com/wfrank2509/origin-s2i-nodejs/blob/master/nodejs.org/README.md#usage).

This example will produce a new docker image named `webapp`:

    s2i build https://github.com/wfrank2509/s2i-nodejs wolfgangfrank/centos7-s2i-nodejs:current webapp

Installation
---------------

There are several ways to make this base image and the full list of tagged Node.js releases available to users during OpenShift's web-based "Add to Project" workflow.

#### For OpenShift Online Next Gen Developer Preview
Those without admin privileges can install the latest Node.js releases within their project context with:

    oc create -f https://raw.githubusercontent.com/wfrank2509/origin-s2i-nodejs/master/image-streams.json

To ensure that each of the latest Node.js release tags are available and displayed correctly in the web UI, try upgrading / reinstalling the image stream:

    oc delete is/centos7-s2i-nodejs ; oc create -f https://raw.githubusercontent.com/wfrank2509/origin-s2i-nodejs/master/image-streams.json

If you've (automatically) imported this image using the [`oc new-app` example command](#usage), then you may need to clear the auto-imported image stream reference and re-install it.

#### For Administrators

Administrators can make these Node.js releases available globally (visible in all projects, by all users) by adding them to the `openshift` namespace:

    oc create -n openshift -f https://raw.githubusercontent.com/wfrank2509/origin-s2i-nodejs/master/image-streams.json

To replace [the default SCL-packaged `openshift/nodejs` image](https://hub.docker.com/r/openshift/nodejs-010-centos7/) (admin access required), run:

    oc delete is/nodejs -n openshift ; oc create -n openshift -f https://raw.githubusercontent.com/wfrank2509/origin-s2i-nodejs/master/centos7-s2i-nodejs.json

Building your own Builder images
--------------------------------
Clone a copy of this repo to fetch the build sources:

    $ git clone https://github.com/wfrank2509/origin-s2i-nodejs.git
    $ cd origin-s2i-nodejs

To build your own S2I Node.JS builder images from scratch, run:

    $ docker pull openshift/base-centos7
    $ make build

You can also build a specific release, or try building the alternate `ONBUILD` version of this base:

    $ ONBUILD=true make VERSION=6.3.1

The `ONBUILD` base images are available at https://hub.docker.com/r/wolfgangfrank/centos7-nodejs

[Instructions for build own builder images on Ubuntu 1604](docs/ubuntu-build.md)

Test
---------------------
This repository also provides a [S2I](https://github.com/openshift/source-to-image) test framework,
which launches tests to check functionality of a simple Node.JS application built on top of the sti-nodejs image.

Users can choose between testing a Node.JS test application based on a RHEL or CentOS image.

*  **CentOS based image**

    ```
    $ cd sti-nodejs
    $ make test
    ```

Repository organization
------------------------
* **`Dockerfile`**

    CentOS based Dockerfile with 64bit nodejs binaries from nodejs.org.
    Used to create the `s2i` base images.

* **`Dockerfile.onbuild`**

    CentOS based Dockerfile with 64bit nodejs binaries from nodejs.org.

* **`build/`**

    Folder containing scripts which are responsible for the build and test actions performed by the `Makefile`.

* ** `image-streams.json` **

    Use this file to add these runtimes to OpenShift's web-based **"Add to Project"** workflow.

* ** `releases.json` **

    A JSON file containing metadata about the releases currently supported.

* **`s2i`**

    This folder contains scripts that are run by [`s2i`](https://github.com/openshift/source-to-image):

    *   **`assemble`**

        Used to install the sources into the location where the application
        will be run and prepare the application for deployment (eg. installing
        modules using npm, etc.)

    *   **`run`**

        This script is responsible for running the application, by using the
        application web server.

    *   **`usage`***

        This script prints the usage of this image.

* **`contrib/`**

    This folder contains a file with commonly used modules.

* **`test/`**

    This folder contains the [`s2i`](https://github.com/openshift/source-to-image)
    test framework with simple Node.JS echo server.

    * **`test-app/`**

        A simple Node.JS echo server used for testing purposes by the [S2I](https://github.com/openshift/source-to-image) test framework.

    * **`run`**

        This script runs the [S2I](https://github.com/openshift/source-to-image) test framework.

* ** `Makefile` **

    See the [build your own builder images](#build_your_own_builder_images) section of the `README` for `build` and `test` usage details.
