import SquidPlugin from '@/plugins/squidPlugin';
import fs from 'fs';

export const PLUGINS_FOLDER = 'plugins';

export default class PluginsManager {

    private static instance: PluginsManager;
    private plugins: SquidPlugin[];

    constructor() {

        // Let's load all the plugins
        this.plugins = this.loadPlugins();

        this.trigger('onAllInited');
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
            if(plugin.onSelfInit)
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
     * Hook a object with a hookName and return it back.
     * See {@link SquidPlugin} to get all the possible
     * events.
     *
     * @param hookName - The name of the hook to trigger
     * @param object - The object to hook
     */
    public hook<T>(hookName: string, object: T): T {

        this.trigger(hookName, object);

        return object;
    }

    /**
     * Trigger a new event with optional parameters,
     * see {@link SquidPlugin} to get all the possible
     * events.
     *
     * @param eventName - The name of the event to trigger
     * @param object - Optional parameters to pass in the event
     */
    public trigger<T>(eventName: string, object?: T) {

        // Trigger for all plugins
        this.plugins.forEach((plugin: SquidPlugin) => {

            // Only execute event if the method
            // is implemented
            // @ts-ignore
            if(plugin[`${eventName}`])
                // @ts-ignore
                plugin[`${eventName}`](object);
        });
    }

    /**
     * Get the PluginsManager instance. If not exist,
     * we create it and return it.
     *
     * @returns The instance of PluginsManager
     */
    public static get(): PluginsManager {

        if(!PluginsManager.instance)
            PluginsManager.instance = new PluginsManager();

        return PluginsManager.instance;
    }
}