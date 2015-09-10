# kopfkultur


### Vagrant
The AdminPort of the GAE-TestServer needs to be tunneld over ssh. The command for this is:
```sh
  vagrant ssh --L 8000:localhost:8000
```

The GAE-TestServer needs to be started so that it is not bound to loaclhost an dso that dirty-file-checking is working:
```sh
  goapp serve -host=:: -use_mti me_file_watcher
```
