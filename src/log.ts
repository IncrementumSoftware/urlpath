import chalk from 'chalk';
import moment from 'moment';
type level = 'info' | 'warn' | 'error' | 'fatal' | 'access';
const log = (service: string, level: level, message: any, ip?: string, res?: number, route?: string) => {
    process.stdout.write(`${moment().format('hh:mm:ss')}.${moment().millisecond()} ${service}/${level}: ` + message + '\n')
    if (level === 'access') {
        if (!require('fs').existsSync(__dirname + '/../access.log', '')) {
            require('fs').writeFileSync(__dirname + '/../access.log', '');
        } 
        require('fs').appendFileSync(__dirname + '/../access.log', `${moment().format('DD/MMMM/yyyy hh:mm:ss')}.${moment().millisecond()} Access attempt from ` + ip + ` on route ${route}: ${res} \n`)
    }
}
export default log;