import { Terminal } from 'xterm';
import { IPty } from 'node-pty';
import {IOptions, ShortcutAction} from '@/options/options';

export default interface SquidPlugin {

    /**
     * Called when the plugin is loaded.
     */
    onSelfInit?(): void;
    /**
     * Called when all the plugin are loaded.
     */
    onAllInited?(): void;
    /**
     * Called when the options are updated. Contains
     * the old options and the new options.
     *
     * @param options - The old and new options
     */
    onOptionsUpdated?(options: { oldOptions: IOptions, newOptions: IOptions }): void
    /**
     * Called when the native addons are applied.
     *
     * @param terminal - The terminal with loaded addons
     */
    onAddonsApplies?(terminal: Terminal): void;
    /**
     * Called when a shortcut is executed.
     *
     * @param action - The shortcut action
     */
    onShortcut?(action: ShortcutAction): void
    /**
     * Hook a terminal.
     *
     * @param terminal - The terminal to hook
     */
    hookTerminal?(terminal: Terminal): void;
    /**
     * Hook a Pty process.
     *
     * @param pty - The Pty process to hook
     */
    hookPty?(pty: IPty): void;
}