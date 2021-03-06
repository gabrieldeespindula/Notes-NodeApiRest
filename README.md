# Notes Node API REST

Simple project with the intention of learning Rest API, node, unit tests.
To test, just use the insert user endpoint, login and use your token.

---
## Swagger
You can check the documentation on [Swagger](https://app.swaggerhub.com/apis-docs/gabrieldeespindula/Notes/0.1)

---
## Requirements

For development, you will only need Node.js and a node global package.

### Node
- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v8.11.3

    $ npm --version
    6.1.0

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install npm -g

---

## Install

    $ git clone https://github.com/gabrieldeespindula/Notes-NodeApiRest
    $ cd Notes-NodeApiRest
    $ npm install

## Configure app

Open `.env.exemple` then edit it with your settings.
Remove `.exemple`.

## Running the project

    $ npm start
