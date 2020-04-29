# StatDriver

A highscore hosting web application made for the "Angewandte Programmierung" course @ HAW Hamburg.


## Introduction

StatDriver enables game developers to host their own Scoreboards. All you need is a StatDriver account - you can create several scoreboards for your game and use the simple REST API inside your game's code to send and receive highscore entries to and from StatDriver.

If don't want to design your own scoreboards, StatDriver also provides pre-themed HTML embeds for your website or custom web view, which you can enable and disable for public access at any time.


## Getting up and running

This project required node-gyp as some of its dependencies are C++ projects which require compilation.

#### Installation for node-gyp requirements on Windows:
```powershell
# run this in powershell with administrative privileges!
npm install --global --production windows-build-tools
```

#### Installation for node-gyp requirements on macOS:
```sh
xcode-select --install
```

Afterwards, run `npm install` to download all dependencies.
Debug profiles for IntelliJ IDEA are provided.
If you are not using IntelliJ IDEA, the application entrypoint is located at `src/index.js`.

For further information, visit [https://github.com/nodejs/node-gyp#installation](https://github.com/nodejs/node-gyp#installation)


## Authors

This project was created by the following authors:

- Mouna Weitz ([GitHub][1])
- Jonas Sternberg ([GitHub][2])
- Philipp Molitor ([GitHub][3], [Website][4])

[1]: https://github.com/mounaweitz
[2]: https://github.com/N1keee
[3]: https://github.com/PhilsLab
[4]: https://phils-lab.io
