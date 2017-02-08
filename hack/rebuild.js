#!/usr/bin/env node

const fs = require('fs');
const spawn = require('child_process').spawn;

const roi = require('roi');
const semver = require('semver');
const _ = require('underscore');
const Promise = require('fidelity');

const files = ['centos7-s2i-nodejs.json:nodejs',
               'image-streams.json:centos7-s2i-nodejs'];

const versions = currentLocalVersions();
const current = _.chain(_.keys(versions))
                 .reduce((prev, cur) => Math.max(prev, cur)).value();

console.log('Local versions', versions);
console.log('Current version', current);

roi.get({ endpoint: 'https://nodejs.org/dist/index.json' })
   .then(response => findLatest(response.body))
   .then(writeFiles)
   .then(pullBase)
   .catch(console.error);

function pullBase () {
  return new Promise((resolve, reject) => {
    const docker = spawn('docker',
                         ['pull', 'openshift/base-centos7'],
                         { stdio: 'inherit' });
    docker.on('error', reject);
    docker.on('close', (code) => {
      if (code !== 0) {
        reject(`docker pull failed with ${code}`);
      } else {
        resolve('done');
      }
    })
  });
}

// creates an object that maps a major version to the latest
// release of that version found in `json`
function findLatest (json) {
  return _.reduce(JSON.parse(json),
    (result, release) => {
      const version = semver.clean(release.version);
      const major = semver.major(version);
      const current = result[major] || versions[major];
      if (current && semver.gte(version, current.version)) {
        result[major] = release;
      }
      return result;
    }, {});
}

function writeFiles (releases) {
  // TODO: Only do this if there are any changes
  return new Promise((resolve, reject) => {
    _.each(files, (f) => {
      const [file, name] = f.split(':');
      console.log('Rewriting', file, name, '...');
      const data = imageStream(releases, name);
      fs.writeFile(file, JSON.stringify(data, null, 2),
        (err) => err ? reject(err) : resolve());
    });
  });
}

function imageStream (releases, name) {
  console.log('processing', name);
  const data = {
        kind: 'ImageStream',
        apiVersion: 'v1',
        metadata: {
          name: name,
          creationTimestamp: `${new Date()}`
        },
        spec: {
          tags: []
        }
      };
    _.each(releases, (r) => {
      const version = semver.clean(r.version);
      const { major, minor } = majorMinor(version);

      data.spec.tags.push(dockerImageTag(version));
      data.spec.tags.push(imageStreamTag(major, version));
      data.spec.tags.push(imageStreamTag(minor, version));

      // if this node version is lts, tag it as such
      if (r.lts) {
        data.spec.tags.push(imageStreamTag('lts', version));
        data.spec.tags.push(imageStreamTag(r.lts, version));
      }

      // if this is the current/latest version of node, tag it so
      if (major === current) {
        data.spec.tags.push(imageStreamTag('current', version));
        data.spec.tags.push(imageStreamTag('latest', version));
      }
    });
    return data;
}

function dockerImageTag (version) {
  return {
    name: version,
    annotations: annotationsFor(version, version),
    from: {
            kind: 'DockerImage',
            name: `bucharestgold/centos7-s2i-nodejs:${version}`
          }
  };
}

function imageStreamTag (name, version) {
  return {
    name: `${name}`, // force string
    annotations: annotationsFor(name, version),
    from: {
            kind: 'ImageStreamTag',
            name: version
          }
  };
}

function annotationsFor (name, version) {
  const { major, minor } = majorMinor(version);
  return {
            description: 'Build and run Node.js applications',
            iconClass: 'icon-nodejs',
            tags: `builder, node, nodejs, nodejs-${version}, nodejs-${name}`,
            supports: `nodejs:${major}, nodejs:${minor}, nodejs`,
            sampleRepo: 'https://github.com/bucharest-gold/http-base.git'
          };
}

// creates an object that maps a major version to the latest
// release of that version, for each of process.env.VERSIONS
function currentLocalVersions () {
  const list = process.env.VERSIONS ? process.env.VERSIONS.split(' ') : [];
  return _.chain(list)
    .map(semver.major)
    .reduce((result, v) => {
      result[v] = { version: list.shift() };
      return result;
    }, {}).value();
}

function majorMinor (version) {
  return {
    major: semver.major(version),
    minor: version.split('.').slice(0,2).join('.')
  };
}
