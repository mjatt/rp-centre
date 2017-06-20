# Norrland Role Play Centre [![wercker status](https://app.wercker.com/status/19facae1dd72a7502349e3c35b04dcb4/m/master "wercker status")](https://app.wercker.com/project/byKey/19facae1dd72a7502349e3c35b04dcb4)

## Usage

---

You can find the live version [here](http://rpcentre.bancey.xyz)

You can find the indev version [here](http://rpcentre-indev.bancey.xyz), please be aware that this is _*not*_ stable.

### Vagrant

---
We recommend using using vagrant to run this rp-centre locally, you can find more info about vagrant and how to set it up [here](https://atlas.hashicorp.com/help/vagrant/features).

```bash
# Bring the vagrant vm online
vagrant up

# The machine will run the scripts/provisioner.sh script at startup
# The script runs the development server and then detaches from the vm.
# You can browse to http://localhost:3000 on the host machine and you can access the running node application.
# The app utilised nodemon which will reload the server if any files change.

# Connect to the vagrant machine
vagrant ssh
# If the machine asks for a password, try vagrant
```

Unless you modify the `Vagrantfile` then this project folder is shared with the vm simply navigate to `/vagrant_data`.

### Local system

---

#### Prerequisites

* Node (6.10.0 or greater)
* Npm (any recent version should be fine)

#### Installing

```bash
# We rely on a number of external modules, install them like so
npm install
```

#### Running

### Dev mode

```bash
# The server will spin up on port 3000, and reload if files are changed
# great for developing
npm run dev
```

### Normal usage

```bash
# The server will spin up on port 3000
npm run start
```

## Contributing

---
We are happy to accept both pull requests and issues requests. Before submitting your pull request please read the [contributing guidlines](./docs/CONTRIBUTING.md).
