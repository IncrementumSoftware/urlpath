import { NextFunction, Response, Request } from "express";
import config from "../config";
import log from "./log";
require('./stdin')
export class redirection {
    public middleware(req: Request, res: Response, next: NextFunction): void {
        if (req.path === '/favicon.ico') return;
        const route: string = req.path
        let routes = JSON.parse(JSON.stringify(require('../routes.json')))
            if (routes[route]) {
                res.status(200).redirect(routes[route])
                log('redirect', 'access', "Successful redirect on path " + req.path + " to " + routes[route], req.ip, 200, req.path )
                return;
            } else {
                res.status(404).send(require('fs').readFileSync(__dirname + '/res/no_redirect.html', 'utf8'))
                log('redirect', 'access', "Unknown redirect attempt on path " + req.path, req.ip, 404, req.path)
                return;
            }
    }

}