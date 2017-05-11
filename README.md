# Norrland Role Play Centre

---

## Build Status [![wercker status](https://app.wercker.com/status/19facae1dd72a7502349e3c35b04dcb4/s/master "wercker status")](https://app.wercker.com/project/byKey/19facae1dd72a7502349e3c35b04dcb4)

---

## Usage

---

### Vagrant

---
We recommend using using vagrant to run this rp-centre locally, you can find more info about vagrant and how to set it up [here](https://atlas.hashicorp.com/help/vagrant/features).

```bash
# Bring the vagrant vm online
vagrant up

# Connect to the vagrant machine
vagrant ssh
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

```bash
# The server will spin up on port 3000
npm run start
```

## Contributing

---
We are happy to accept both pull requests and issues requests. Before submitting your pull request please read the [contributin guidlines](./docs/contrib.md).
