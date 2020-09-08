import { IOptions } from '@/options/options';

export const defaultConfig: IOptions = {
    theme: {
        name: 'default',
        background: '#0F0F0F',
        foreground: '#22da6e',
        cursor: '#22da6e',
        cursorAccent: '#22da6e',
        selection: '#22da6e',
        black: '#011627',
        red: '#EF5350',
        green: '#22da6e',
        yellow: '#addb67',
        blue: '#82aaff',
        magenta: '#c792ea',
        cyan: '#21c7a8',
        white: '#ffffff',
        brightBlack: '#575656',
        brightRed: '#ef5350',
        brightGreen: '#22da6e',
        brightYellow: '#ffeb95',
        brightBlue: '#82aaff',
        brightMagenta: '#c792ea',
        brightCyan: '#7fdbca',
        brightWhite: '#ffffff'
    },
    cursor: {
        style: 'block',
        blink: true
    },
    font: {
        size: 14,
        family:  '"Fira Code", monospace'
    },
    opacity: 1.0,
    bash: 'C:\\Windows\\System32\\wsl.exe',
    currentTheme: 'default',
    fastScrollModifier: 'shift',
    shortcuts: [
        {
            keys: 'CommandOrControl+Shift+T',
            action: 'pane:open'
        },
        {
            keys: 'CommandOrControl+Shift+W',
            action: 'pane:close'
        },
        {
            keys: 'CommandOrControl+Tab',
            action: 'pane:switch'
        }
    ]
};
