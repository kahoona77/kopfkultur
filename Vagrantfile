Vagrant.configure(2) do |config|
  config.vm.box = "precise64"
  config.vm.synced_folder "./", "/home/vagrant/go_appengine/gopath/src/github.com/kahoona77/kopfkultur"
  config.vm.network "forwarded_port", guest: 8080, host: 8080
  config.vm.network "forwarded_port", guest: 8000, host: 8000
  config.vm.provision :shell, :path => "bootstrap.sh"
end
