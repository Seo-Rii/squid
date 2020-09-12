import { Terminal } from 'xterm';

export default interface SquidPlugin {

    onSelfInit(): void;
    onAllInited(): void;
    hookTerminal(terminal: Terminal): void;
}