import AppTerminal from '@/app/appTerminal';
import { watchForChanges } from '@/options/watcher';
import Options, { IOptions, ShortcutAction } from '@/options/options';
import { clipboard, ipcRenderer, IpcRendererEvent, remote } from 'electron';
import PluginsManager from '@/plugins/pluginsManager';

export default class AppWatcher {

    // The app terminal instance
    private appTerminal: AppTerminal;

    constructor(appTerminal: AppTerminal) {

        this.appTerminal = appTerminal;

        this.watchOptions();
        this.watchContextMenu();
        this.watchDrop();
    }

    /**
     * Watch the option files.
     */
    private watchOptions() {

        watchForChanges(Options.get().getPath(), (options: IOptions) => {

            Options.get().setOptions(options);

            const opacity: string = String(options.opacity);
            const backgroundColor: string = String(options.theme.background);
            const borderColor: string = String(options.theme.border);

            const currentTerminal: HTMLElement = document.getElementById(`terminal-${this.appTerminal.getId()}`) as HTMLElement;
            currentTerminal.style.opacity = opacity;

            const nav: HTMLElement = document.querySelector('.nav') as HTMLElement;
            nav.style.backgroundColor = backgroundColor;
            nav.style.opacity = opacity;

            const tabs: HTMLElement = document.querySelector('.tabs') as HTMLElement;
            tabs.style.backgroundColor = backgroundColor;
            tabs.style.borderColor = borderColor;
            tabs.style.opacity = opacity;

            const border: HTMLElement = document.querySelector('.border') as HTMLElement;
            border.style.borderColor = borderColor;

            this.appTerminal.applyTheme(options.theme);
            this.appTerminal.setOption('cursorBlink', options.cursor.blink);
            this.appTerminal.setOption('cursorStyle', options.cursor.style);
            this.appTerminal.setOption('fontSize', options.font.size);
            this.appTerminal.setOption('fontFamily', options.font.family);
            this.appTerminal.setOption('fastScrollModifier', options.fastScrollModifier);

            if(options.vibrancy.enabled)
                // @ts-ignore
                remote.getCurrentWindow().setVibrancy(options.vibrancy);
            else
                // @ts-ignore
                remote.getCurrentWindow().setVibrancy();
        });
    }

    /**
     * Watch the context menu actions.
     */
    private watchContextMenu() {

        ipcRenderer.on('shortcutPerformed', (event: IpcRendererEvent, action: ShortcutAction) => {

            PluginsManager.get().trigger('onShortcut', action);
        });

        // Shortcuts
        ipcRenderer.on('shortcuts', (event: IpcRendererEvent, action: ShortcutAction) => {

            switch (action) {

                case 'paste':
                    this.appTerminal.onData(clipboard.readText());
                    break;

                case 'devtools':
                    remote.getCurrentWindow().webContents.openDevTools({ mode: 'detach' });
                    break;
            }
        });
    }

    /**
     * Watch files/folders dropping.
     */
    private watchDrop() {

        document.addEventListener('drop', (event: DragEvent) => {

            event.preventDefault();
            event.stopPropagation();

            if(event.dataTransfer == null || event.dataTransfer.files.length < 0)
                return;

            // We get the path of the first file
            const filePath: string = event.dataTransfer.files[0].path;

            // Write the path to the pty instance
            this.appTerminal.onData(filePath);
        });

        document.addEventListener('dragover', (event: DragEvent) => {

            event.preventDefault();
            event.stopPropagation();
        });
    }
}
