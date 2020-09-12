import { Terminal } from 'xterm';

export default new class Weblinks {

    public onSelfInit() {

        console.log('weblinks inited');
    }

    public hookTerminal(terminal: Terminal) {

        console.log('hooked terminal');
    }
}