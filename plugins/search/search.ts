import { Terminal } from 'xterm';
import { SearchAddon } from 'xterm-addon-search';
import SquidPlugin from '../../src/plugins/squidPlugin';
import { ShortcutAction } from '../../src/options/options';

export default new class Search implements SquidPlugin {

    private searchAddon: SearchAddon;

    constructor() {

        // Instanciante the search addon
        this.searchAddon = new SearchAddon();
    }

    /**
     * Called when the native addons are applied.
     *
     * We load the created search addon to the
     * terminal instance.
     *
     * @param terminal - The terminal with loaded addons
     */
    public onAddonsApplies(terminal: Terminal) {

        terminal.loadAddon(this.searchAddon);
    }

    /**
     * Called when a shortcut is executed.
     *
     * @param action - The shortcut action
     */
    public onShortcut?(action: ShortcutAction) {

        if(action === 'pane:search')
            console.log('search');
    }

    private searchNext(term: string) {

        this.searchAddon.findNext(term);
    }

    private searchPrevious(term: string) {

        this.searchAddon.findPrevious(term);
    }
}