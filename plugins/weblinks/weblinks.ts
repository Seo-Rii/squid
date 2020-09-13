import { Terminal } from 'xterm';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { shell } from 'electron';
import SquidPlugin from '../../src/plugins/squidPlugin';

export default new class Weblinks implements SquidPlugin {

    private weblinksAddon: WebLinksAddon;

    constructor() {

        // Instanciante the weblinks addon
        this.weblinksAddon = new WebLinksAddon((event: MouseEvent, uri: string) => {

            shell.openExternal(uri);
        });
    }

    /**
     * Called when the native addons are applied.
     *
     * We load the created weblinks addon to the
     * terminal instance.
     *
     * @param terminal - The terminal with loaded addons
     */
    public onAddonsApplies(terminal: Terminal) {

        terminal.loadAddon(this.weblinksAddon);
    }
}