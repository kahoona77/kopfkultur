#!/usr/bin/env bash

apt-get update
apt-get install -y python git mercurial unzip wget curl bzip2

cd /home/vagrant
echo "Installing GO AppEngine SDK..."
# remove old downloads
rm -f go_appengine_sdk*
# download SDK
wget -q https://storage.googleapis.com/appengine-sdks/featured/go_appengine_sdk_linux_amd64-1.9.25.zip
unzip -oq go_appengine_sdk_linux_amd64-1.9.25.zip
echo "export GOPATH=/home/vagrant/go_appengine/gopath" >> /etc/profile
echo "export GOROOT=/home/vagrant/go_appengine/goroot" >> /etc/profile
echo "export PATH=$PATH:/home/vagrant/go_appengine" >> /etc/profile

echo "Running goapp get..."
cd /home/vagrant/go_appengine/gopath/src/github.com/kahoona77/kopfkultur/app
sudo goapp get
echo "Finished with goapp get..."

cd /home/vagrant
