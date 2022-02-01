import { getServer } from ".";
import log from "./log";
import { redirection } from "./route";
const stdin = process.openStdin();
const commands: string[] = ["showroutes", "reload"]
stdin.addListener('data', (d: string) => {
    const command: string = d.toString().trim().split(' ')[0]
    const args: string[] = d.toString().split(' ')
    if (commands.includes(command)) {
        switch (command) {
            case 'showroutes': 
                const routes: any = JSON.parse(require('fs').readFileSync(__dirname + '/../routes.json', 'utf-8'))
                const objkeys = Object.keys(routes)
                let message = ""
                let num = 0
                for (var route in routes) {
                    message += `-- ${objkeys[num]} --> ${routes[route]}\n`
                    num++
                }
                process.stdout.write('\n' + message + '\n')
            case 'reload':
                getServer().use((new redirection).middleware)
        }
    } else {
        log('cli', 'error', 'Unknown command '+command);
    }
})
