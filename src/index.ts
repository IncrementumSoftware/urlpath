import e, { Application } from 'express';
import config from '../config';
import log from './log';
import { redirection } from './route';
if (require('fs').existsSync('../routes.json')) {
    require('fs').writeFileSync('../routes.json', JSON.stringify("{}"))
    log('routes', 'info', 'routes.json not found; created new routes file')
}
    verifyIntegrityOfRoutesFile();
const srv: Application = e().use(require('express').urlencoded({ extended: true }))
let _srv = undefined;
if (config.https_enabled) {
    log("https", 'info', "HTTPS enabled, registering HTTPS server")
    try {
        _srv = require('https').createServer({
            key: require('fs').readFileSync(__dirname + `/../ssl/${config.key_name}`),
            cert: require('fs').readFileSync(__dirname + `/../ssl/${config.crt_name}`)
        }, srv)
        log('https', 'info', "HTTPS server registered");
    } catch (e: unknown | Error) {
        log('https', 'fatal', "Error while registering HTTPS server: Error during crt-key implementation")
        console.error(String(e).split('\n')[0])
        require('process').exit(0)

    }
} else {
    log("https", 'warn', "HTTPS disabled (unrecommended), registering HTTP server")
    _srv = require('http').createServer(srv)
    log('https', 'info', "HTTP server registered");
}

srv.use((new redirection).middleware)

try {
    _srv.listen(config.port, () => {
        log('server', 'info', `Listening on port ${config.port}`)
        log('server', 'info', "HTTPS? " + Boolean(config.https_enabled))
    })
} catch (e: unknown | Error) {
    log('http', 'fatal', "Error during server listen attempt")
    console.error(String(e).split('\n')[0])
    require('process').exit(0)
}

function verifyIntegrityOfRoutesFile() {
    const conf: object = require('../routes.json')
    const verifyRegEx = /(http|https)?:\/\/(\S+)/
    const objkey = Object.keys(conf)
    for (let i = 0; i != objkey.length; i++) {
        if (verifyRegEx.test(toArray(conf)[i])) {
          log("RouteIntegrityChecker", "info", "Route " + objkey[i] + " passed integrity check.")
          continue;
        } else {
          log("RouteIntegrityChecker", "warn", "Route " + objkey[i] + " did not pass integrity check, issues may occur")
        }
    }
}
export function getServer(): Application {
    return srv;
}

function toArray(json: any): any[] {
  let objkeys = Object.keys(json);
  let i = 0;
  const array: any[] = []
  for (let prop in json) {
    array.push([objkeys[i], json[prop]])
    i++;
  }
  return array;
}
