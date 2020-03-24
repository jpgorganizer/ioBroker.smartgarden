/**
 * Adapter for integration of Gardena Smart System to ioBroker
 * based on official GARDENA smart system API (https://developer.1689.cloud/)
 * Support:             https://forum.iobroker.net/...
 * Autor:               jpgorganizer (ioBroker) | jpgorganizer (github)
 * Version:             0.2.0 (23. January 2020)
 * SVN:                 $Rev: 1983 $
 * contains some functions available at forum.iobroker.net, see function header
 */
'use strict';

/*
 * Created with @iobroker/create-adapter v1.17.0
 */
const mainrev ='$Rev: 1983 $';

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
const utils = require('@iobroker/adapter-core');

// Load your modules here, e.g.:
const fs = require('fs');
const gardena_api = require(__dirname + '/lib/api');

/*
 * writes string val to adapter.log.info if level is lower or equal to global level 
 * @param    adapter  adapter object
 * @param    level    log integer 1..3, level for this string val
 * @param    val      val string 
 * @return   random integer from 0 to max-1 
 */
function loginfo(adapter, level, val) {
	if (level >=1 && level <=3 && level <= adapter.config.logLevel) {
		adapter.log.info(val);
	}
}

function decrypt(key, value) {
	let result = "";
	for (let i = 0; i < value.length; ++i) {
		result += String.fromCharCode(key[i % key.length].charCodeAt(0) ^ value.charCodeAt(i));
	}
	return result;
}

function make_printable(value) {
	var result = '';
	let startval = 4;
	let i;
	
	for (i=0; i < startval && i < value.length; ++i) {
		result += value[i];
	}
	
	for(i = startval ; i < value.length; ++i) {
		if (value[i] !== '.' && value[i] !== '-' ) {
			result += 'X';
		} else {
			result += value[i];
		}
	}
	return result;
}


function main(adapter) {
    // Initialize your adapter here
    
    // Reset the connection indicator during startup
    adapter.setState('info.connection', false, true);
    
    // The adapters config (in the instance object everything under the attribute "native") is accessible via
    // this.config:
    loginfo(adapter, 1, 'config authenticaton_host: ' + adapter.config.authentication_host);
    loginfo(adapter, 1, 'config smart_host: ' + adapter.config.smart_host);
    //loginfo(adapter, 1, 'config gardena_api_key: ' + adapter.config.gardena_api_key);
    //loginfo(adapter, 1, 'config gardena_username: ' + adapter.config.gardena_username);
    //loginfo(adapter, 1, 'config gardena_password: ' + adapter.config.gardena_password);

	let that = adapter;
	
	gardena_api.setAdapter(adapter);
	gardena_api.setVer(mainrev);
	gardena_api.connect(
		function(err, auth_data) {
			if(err) {
				that.log.error(err);
				that.setState('info.connection', false, true);
			} else {
				// don't write auth data to log, just first few chars
				loginfo(that, 1, 'connected ... auth_data=' + make_printable(auth_data));
				that.setState('info.connection', true, true);
				gardena_api.get_locations(function(err, locations) {
					if(err) {
						that.log.error(err);
						that.setState('info.connection', false, true);
					} else {
						loginfo(that, 1, 'get_locations ... locations=' + locations);
						that.setState('info.connection', true, true);
		
						gardena_api.get_websocket(function(err, websocket) {
							if(err) {
								that.log.error(err);
								that.setState('info.connection', false, true);
							} else {
								loginfo(that, 1, 'get_websocket ... websocket=' + websocket);
								that.setState('info.connection', true, true);
							}
						});
					}
				});
			}
		}
	);
	
	if (adapter.config.useTestVariable === 'true') {
		adapter.setObjectAsync('testVariable', {
			type: 'state',
			common: {
				name: 'testVariable',
				type: 'boolean',
				role: 'indicator',
				read: true,
				write: true,
			},
			native: {},
		});
	}
	
	// all states changes inside the adapters namespace are subscribed
	adapter.subscribeStates('*');
}


class Smartgarden extends utils.Adapter {

    /**
     * @param {Partial<ioBroker.AdapterOptions>} [options={}]
     */
    constructor(options) {
        super({
            ...options,
            name: 'smartgarden',
        });
        this.on('ready', this.onReady.bind(this));
        this.on('objectChange', this.onObjectChange.bind(this));
        this.on('stateChange', this.onStateChange.bind(this));
        // this.on('message', this.onMessage.bind(this));
        this.on('unload', this.onUnload.bind(this));
    }

    /**
     * Is called when databases are connected and adapter received configuration.
     */
	async onReady() {	 
		loginfo(this, 1, "ready - Adapter: databases are connected and adapter received configuration");
		loginfo(this, 2, "config.gardena_password verschlüsselt: " + this.config.gardena_password);
		loginfo(this, 2, "config.gardena_api_key verschlüsselt: " + this.config.gardena_api_key);
		
		this.getForeignObject("system.config", (err, obj) => {
			if (obj && obj.native && obj.native.secret) {
				//noinspection JSUnresolvedVariable
				this.config.gardena_password = decrypt(obj.native.secret, this.config.gardena_password);
				this.config.gardena_api_key = decrypt(obj.native.secret, this.config.gardena_api_key);
			} else {
				//noinspection JSUnresolvedVariable
				let defkey = '"ZgAsfr5s6gFe87jJOx4M';
				this.config.gardena_password = decrypt(defkey, this.config.gardena_password);
				this.config.gardena_api_key = decrypt(defkey, this.config.gardena_api_key);
			}
			main(this);
		});	 
	}
	 
	 

    /**
     * Is called when adapter shuts down - callback has to be called under any circumstances!
     * @param {() => void} callback
     */
    onUnload(callback) {
        try {
            loginfo(this, 1, 'cleaned everything up...');
            callback();
        } catch (e) {
            callback();
        }
    }

    /**
     * Is called if a subscribed object changes
     * @param {string} id
     * @param {ioBroker.Object | null | undefined} obj
     */
    onObjectChange(id, obj) {
        if (obj) {
            // The object was changed
            loginfo(this, 2, `object ${id} changed: ${JSON.stringify(obj)}`);
        } else {
            // The object was deleted
            loginfo(this, 2, `object ${id} deleted`);
        }
    }

    /**
     * Is called if a subscribed state changes
     * @param {string} id
     * @param {ioBroker.State | null | undefined} state
     */
    onStateChange(id, state) {
        if (state.ack === false) {
            // The state was changed by user
            loginfo(this, 2, `state ${id} changed: ${state.val} (ack = ${state.ack})`);
			loginfo(this, 3, `---> Command should be sent to device`);
			gardena_api.sendCommand(id, state);
        } else {
			// The state was changed by user
            loginfo(this, 2, `state ${id} changed: ${state.val} (ack = ${state.ack})`);
			loginfo(this, 3, `---> State change by device`);
        }
    }
}

// @ts-ignore parent is a valid property on module
if (module.parent) {
    // Export the constructor in compact mode
    /**
     * @param {Partial<ioBroker.AdapterOptions>} [options={}]
     */
    module.exports = (options) => new Smartgarden(options);
} else {
    // otherwise start the instance directly
    new Smartgarden();
}