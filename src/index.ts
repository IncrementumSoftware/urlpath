import e, { Application } from 'express';
import config from '../config';
import log from './log';
import { redirection } from './route';
if (require('fs').existsSync('../routes.json')) {
    require('fs').writeFileSync('../routes.json', JSON.stringify("{}"))
    log('routes', 'info', 'routes.json not found; created new routes file')
    verifyIntegrityOfRoutesFile();
}
const srv: Application = e().use(require('express').urlencoded({ extended: true }))
let _srv;
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
    srv.listen(config.port, () => {
        log('server', 'info', `Listening on port ${config.port}`)
        log('server', 'info', "HTTPS? " + Boolean(config.https_enabled))
    })
} catch (e: unknown | Error) {
    log('http', 'fatal', "Error during server listen attempt")
    console.error(String(e).split('\n')[0])
    require('process').exit(0)
}

function verifyIntegrityOfRoutesFile() {
    const conf = require('../routes.json')
    for (var route in conf) {
        // match
    }
}
export function getServer(): Application {
    return srv;
}