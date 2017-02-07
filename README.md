Origin S2I NodeJS
=================

This repository contains sources for an [s2i](https://github.com/openshift/source-to-image) builder image, based on CentOS7 and Node.js releases from nodejs.org.

If you are interested in developing against SCL-based nodejs releases, try [sti-nodejs](https://github.com/openshift/sti-nodejs).

[![docker hub stats](http://dockeri.co/image/bucharestgold/centos7-s2i-nodejs)](https://hub.docker.com/r/bucharestgold/centos7-s2i-nodejs/)

<!--
[![](https://images.microbadger.com/badges/image/bucharestgold/centos7-s2i-nodejs.svg)](https://microbadger.com/images/bucharestgold/centos7-s2i-nodejs "Get your own image badge on microbadger.com")
-->

For more information about using these images with OpenShift, please see the
official [OpenShift Documentation](https://docs.openshift.org/latest/using_images/s2i_images/nodejs.html).

Versions
---------------
[Node.JS versions currently provided are](https://hub.docker.com/r/ryanj/centos7-s2i-nodejs/tags/):

* `7.5.0` `current`
* `6.9.5`  `lts`
* `5.12.0`
* `4.7.3` `lts`

Usage
---------------------------------

OpenShift allows you to quickly start a build using the web console, or the CLI.

The [`oc` command-line tool](https://github.com/openshift/origin/releases) can be used to start a build, layering your desired nodejs `REPO_URL` sources into a centos7 image with your selected `RELEASE` of Node.js via the following command format:

    oc new-app bucharestgold/centos7-s2i-nodejs:RELEASE~REPO_URL

For example, you can run a build (including `npm install` steps), using my [`http-base`](http://github.com/bucharest-gold/http-base) example repo, and the `current` relase of nodejs with:

    oc new-app bucharestgold/centos7-s2i-nodejs:current~http://github.com/bucharest-gold/http-base

Or, to run the latest `lts` release:

    oc new-app bucharestgold/centos7-s2i-nodejs:lts~http://github.com/bucharest-gold/http-base

You can try using any of the available tagged Node.js releases, and your own repo sources - as long as your application source will init correctly with `npm start`, and listen on port 8080.

Builds
------

The [Source2Image cli tools](https://github.com/openshift/source-to-image/releases) are available as a standalone project, allowing you to [run builds outside of OpenShift](https://github.com/bucharestgold/origin-s2i-nodejs/blob/master/nodejs.org/README.md#usage).

This example will produce a new docker image named `webapp`:

    s2i build https://github.com/bucharest-gold/http-base bucharestgold/centos7-s2i-nodejs:current webapp

Installation
---------------

There are several ways to make this base image and the full list of tagged Node.js releases available to users during OpenShift's web-based "Add to Project" workflow.

#### For OpenShift Online Next Gen Developer Preview
Those without admin privileges can install the latest Node.js releases within their project context with:

    oc create -f https://raw.githubusercontent.com/bucharestgold/origin-s2i-nodejs/master/image-streams.json

To ensure that each of the latest Node.js release tags are available and displayed correctly in the web UI, try upgrading / reinstalling the image stream:

    oc delete is/centos7-s2i-nodejs ; oc create -f https://raw.githubusercontent.com/bucharestgold/origin-s2i-nodejs/master/image-streams.json

If you've (automatically) imported this image using the [`oc new-app` example command](#usage), then you may need to clear the auto-imported image stream reference and re-install it.

#### For Administrators

Administrators can make these Node.js releases available globally (visible in all projects, by all users) by adding them to the `openshift` namespace:

    oc create -n openshift -f https://raw.githubusercontent.com/bucharestgold/origin-s2i-nodejs/master/image-streams.json

To replace [the default SCL-packaged `openshift/nodejs` image](https://hub.docker.com/r/openshift/nodejs-010-centos7/) (admin access required), run:

    oc delete is/nodejs -n openshift ; oc create -n openshift -f https://raw.githubusercontent.com/bucharestgold/origin-s2i-nodejs/master/centos7-s2i-nodejs.json

Building your own Builder images
--------------------------------
Clone a copy of this repo to fetch the build sources:

    $ git clone https://github.com/bucharestgold/origin-s2i-nodejs.git
    $ cd origin-s2i-nodejs

To build your own S2I Node.JS builder images from scratch, run:

    $ docker pull openshift/base-centos7
    $ make build

You can also build a specific release, or try building the alternate `ONBUILD` version of this base:

    $ ONBUILD=true make VERSION=6.3.1

The `ONBUILD` base images are available at https://hub.docker.com/r/ryanj/centos7-nodejs

### Building your own Builder images on Ubuntu 16.04


### 1) docker required

```bash
sudo apt update
sudo apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D
sudo apt-add-repository 'deb https://apt.dockerproject.org/repo ubuntu-xenial main'
sudo apt update
sudo apt install -y docker-engine
sudo usermod -aG docker $(whoami)
```

test:
```
sudo systemctl status docker
● docker.service - Docker Application Container Engine
   Loaded: loaded (/lib/systemd/system/docker.service; enabled; vendor preset: e
   Active: active (running) since Ter 2017-02-07 15:19:21 BRT; 4min 35s ago
     Docs: https://docs.docker.com
 Main PID: 18126 (dockerd)
... 
```

#### Reboot

test:
```
docker search origin-s2i-nodejs
NAME                                DESCRIPTION         STARS     OFFICIAL   AUTOMATED
cloudstrap/origin-s2i-nodejs        origin-s2i-nodejs   0                    [OK]
redhatworkshops/nodejs-origin-s2i
```

### 2) python-pip required

```bash
sudo apt install python-pip
```

### 3) [docker-squash](https://github.com/goldmann/docker-squash) required

```bash
pip install docker-squash
cd ; echo 'PATH="$HOME/.local/bin/:$PATH"' >> .bashrc
```

### 4) s2i command required

```bash
wget https://github.com/openshift/source-to-image/releases/download/v1.1.4/source-to-image-1.1.4-870b273-linux-amd64.tar.gz
tar xvzf source-to-image-1.1.4-870b273-linux-amd64.tar.gz
mv s2i .local/bin/ ; mv sti .local/bin/
source .bashrc
```

### 5) Run `make test`

```bash
git clone git@github.com:bucharest-gold/origin-s2i-nodejs.git
origin-s2i-nodejs ; git checkout origin/lance-macos
make test
```

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
* **`nodejs.org/`**

    Dockerfile and scripts to build container images.

* **`hack/`**

    Folder containing scripts which are responsible for the build and test actions performed by the `Makefile`.

* ** `image-streams.json` **

    Use this file to add these runtimes to OpenShift's web-based **"Add to Project"** workflow.

* ** `Makefile` **

    See the [build your own builder images](#build_your_own_builder_images) section of the `README` for `build` and `test` usage details.
