import * as fs from 'fs';
import * as path from 'path';
import { userDataPath } from '@/utils/utils';
import { defaultConfig } from '@/options/defaultConfig';
import { remote } from 'electron';
import { VibrancyOptions } from 'electron-acrylic-window';
import PluginsManager from '@/plugins/pluginsManager';

export default class Options {

    // The singleton instance
    private static instance: Options;

    private options: IOptions;
    private readonly path: string;

    constructor() {

        this.path = path.join(userDataPath, 'settings.squid.json');
        this.options = this.loadOptions();
    }

    /**
     * Load the options from the path.
     *
     * @returns The IOptions options
     */
    private loadOptions(): IOptions {

        if(this.exist()) {

            const buffer: Buffer = fs.readFileSync(this.path);

            return JSON.parse(buffer.toString());

        } else
            return defaultConfig;
    }

    /**
     * Return if the options file exist.
     *
     * @returns Return true if the file exist
     */
    public exist(): boolean {

        return fs.existsSync(this.path);
    }

    /**
     * Get the options.
     *
     * @returns The current options
     */
    public getOptions(): IOptions {

        return this.options;
    }

    /**
     * Set the options.
     *
     * @param options -The options to set
     */
    public setOptions(options: IOptions) {

        // Save the old options to trigger onOptionsUpdated later
        const oldOptions: IOptions = this.options;
        this.options = options;

        remote.getCurrentWebContents().send('reload', this.options);

        PluginsManager.get().trigger('onOptionsUpdated', {

            oldOptions,
            newOptions: options,
        });
    }

    /**
     * Get the path of the options.
     *
     * @returns The path of the options
     */
    public getPath(): string {

        return this.path;
    }

    /**
     * Save the options.
     */
    public save() {

        fs.writeFile(this.path, JSON.stringify(this.options, null, 2), () => console.log('file saved'));
    }

    /**
     * Get the instance.
     *
     * @returns The Options instance
     */
    public static get(): Options {

        if(!Options.instance)
            Options.instance = new Options();

        return Options.instance;
    }
}

export interface IOptions {

    /**
     * The theme interface.
     */
    theme: ITheme;
    /**
     * The cursor interface.
     */
    cursor: ICursor;
    /**
     * The font interface.
     */
    font: IFont;
    /**
     * The opacity of the window.
     */
    opacity: number;
    /**
     * A path to the shell you which to use.
     */
    shell: string;
    /**
     * The name of the current theme.
     */
    currentTheme: string;
    /**
     * The key to toggle the fast scroll.
     */
    fastScrollModifier: 'alt' | 'ctrl' | 'shift';
    /**
     * WebGL rendering.
     */
    webGlRendering: boolean;
    /**
     * Vibrancy settings.
     */
    vibrancy: VibrancyOptions;
    /**
     * A list of the shortcuts.
     */
    shortcuts: IShortcut[];
}

export interface ITheme {

    /**
     * The theme name.
     */
    name: string;
    /**
     * Bellow are the colors of the theme.
     */
    background: string;
    foreground: string;
    cursor: string;
    cursorAccent: string;
    selection: string;
    border: string;
    black: string;
    red: string;
    green: string;
    yellow: string;
    blue: string;
    magenta: string;
    cyan: string;
    white: string;
    brightBlack: string;
    brightRed: string;
    brightGreen: string;
    brightYellow: string;
    brightBlue: string;
    brightMagenta: string;
    brightCyan: string;
    brightWhite: string;
}

interface ICursor {
    /**
     * The style of the cursor.
     */
    style: 'block' | 'underline' | 'bar';
    /**
     * Does the cursor should blink or not.
     */
    blink: boolean;
}

interface IFont {

    /**
     * The size of the font in the terminal.
     */
    size: number;
    /**
     * The family of the font in the terminal.
     */
    family: string;
}

export type ShortcutAction = 'pane:open' | 'pane:close' | 'pane:switchLeft' | 'pane:switchRight' | 'devtools' | string;

export interface IShortcut {

    /**
     * The keys that needs to be pressed.
     */
    keys: string;
    /**
     * The desired action.
     */
    action: ShortcutAction;
}
