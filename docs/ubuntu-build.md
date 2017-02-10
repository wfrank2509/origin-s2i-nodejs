### Building your own Builder images on Ubuntu 16.04

### Install docker

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
```

#### Reboot

test:
```
docker search origin-s2i-nodejs
NAME                                DESCRIPTION         STARS     OFFICIAL   AUTOMATED
cloudstrap/origin-s2i-nodejs        origin-s2i-nodejs   0                    [OK]
redhatworkshops/nodejs-origin-s2i
```

### Install python-pip

```bash
sudo apt install python-pip
```

### Install [docker-squash](https://github.com/goldmann/docker-squash)

```bash
pip install docker-squash
cd ; echo 'PATH="$HOME/.local/bin/:$PATH"' >> .bashrc
```

### Install s2i

```bash
wget https://github.com/openshift/source-to-image/releases/download/v1.1.4/source-to-image-1.1.4-870b273-linux-amd64.tar.gz
tar xvzf source-to-image-1.1.4-870b273-linux-amd64.tar.gz
mv s2i .local/bin/ ; mv sti .local/bin/
source .bashrc
```

### Run `make test`

```bash
git clone git@github.com:bucharest-gold/origin-s2i-nodejs.git
cd origin-s2i-nodejs
make test
```