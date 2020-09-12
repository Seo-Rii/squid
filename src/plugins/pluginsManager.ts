import SquidPlugin from '@/plugins/squidPlugin';
import fs from 'fs';
import { Terminal } from 'xterm';

export const PLUGINS_FOLDER = 'plugins';

export default class PluginsManager {

    private static instance: PluginsManager;
    private plugins: SquidPlugin[];

    constructor() {

        // Let's load all the plugins
        this.plugins = this.loadPlugins();

        //this.triggerEvent('AllInited');
    }

    /**
     * Load all the plugin in the PLUGINS_FOLDER directory.
     *
     * @returns The loaded plugins
     */
    private loadPlugins(): SquidPlugin[] {

        const plugins: SquidPlugin[] = [];

        // We read the PLUGINS_FOLDER folder
        fs.readdirSync(PLUGINS_FOLDER).forEach((file: string) => {

            // Let's load the plugin thanks to his path
            const plugin: SquidPlugin = this.loadPlugin(file);

            // Trigger the onSelfInit method
            plugin.onSelfInit();

            plugins.push(plugin);
        });

        return plugins;
    }

    /**
     * Load a single plugin for the given name.
     *
     * @param pluginName - The name of the plugin
     * @returns The loaded plugin
     */
    private loadPlugin(pluginName: string): SquidPlugin {

        // We require the plugin's main file
        return require('../../' + PLUGINS_FOLDER + '/' + pluginName + '/' + pluginName).default;
    }

    /**
     * Hook a terminal with all the plugins, and
     * return it back.
     *
     * NOTE: Need rewrite
     *
     * @param terminal - The terminal to hook
     * @returns The hooked terminal
     */
    public hookTerminal(terminal: Terminal): Terminal {

        this.plugins.forEach((plugin: SquidPlugin) => {

            plugin.hookTerminal(terminal);
        });

        return terminal;
    }

    /**
     * Get the PluginsManager instance. If not exist,
     * we create it and return it.
     *
     * @returns The instance of PluginsManager
     */
    public static getInstance(): PluginsManager {

        if(!PluginsManager.instance)
            PluginsManager.instance = new PluginsManager();

        return PluginsManager.instance;
    }
}