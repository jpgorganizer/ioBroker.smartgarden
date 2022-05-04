/**
 * Adapter for integration of Gardena Smart System to ioBroker
 * based on official GARDENA smart system API (https://developer.1689.cloud/)
 * Support:             https://forum.iobroker.net/...
 * Autor:               jpgorganizer (ioBroker) | jpgorganizer (github)
 * SVN:                 $Rev: 2755 $ $Date: 2022-05-02 13:18:33 +0200 (Mo, 02 Mai 2022) $
 * contains some functions available at forum.iobroker.net, see function header
 */
'use strict';

/*
 * Created with @iobroker/create-adapter v1.17.0
 */
const mainrev ='$Rev: 2755 $';
const adapterversion = '1.0.6';

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
const utils = require('@iobroker/adapter-core');
const ju = require('@jpgorganizer/utils').utils;

// Load your modules here, e.g.:
const gardena_api = require(__dirname + '/lib/api');

let configUseMowerHistory;

function updateAdapter010004(adapter, previousAdapterVersion, currentAdapterVersion, dotfactor) {
	// delete smartgarden.0.testVariable
	let updateAdapterVersion = '1.0.4';
	let arr = updateAdapterVersion.split('.');
	let relevantAdapterVersion  = arr[0] * dotfactor * dotfactor + arr[1] * dotfactor + arr[2];

	if (previousAdapterVersion < relevantAdapterVersion) {
		let id = adapter.name + '.' + adapter.instance + '.testVariable'
		adapter.getState(id, function(err, state) {
			if (!err && state) {
				adapter.delState(id, function (err) {
					if (!err) {
						adapter.delObject(id);
						ju.adapterloginfo(1, 'update: ' + id + ' removed');
						ju.adapterloginfo(1, 'update for version ' + updateAdapterVersion + ' done with ' + adapterversion);
					}
				});
			}
		});
	}
}

function updateAdapter010005(adapter, previousAdapterVersion, currentAdapterVersion, dotfactor, callback) {
	// change data type for some data points
	// just delete the data points, they will get recreated in normal process
	let updateAdapterVersion = '1.0.5';
	let arr = updateAdapterVersion.split('.');
	let relevantAdapterVersion  = arr[0] * dotfactor * dotfactor + arr[1] * dotfactor + arr[2];
	
	if (previousAdapterVersion < relevantAdapterVersion) {
	//	- for all devices: `rfLinkLevel_value` 
	//  - for mower: `batteryLevel_value`, `operatingHours_value` 
	//  - for sensor: `batteryLevel_value`, `soilHumidity_value`, `soilTemperature_value`, `lightIntensity_value`, `ambientTemperature_value`
	
		let arrPattern = [];
		arrPattern.push('*.name_value');
		arrPattern.push('*.batteryLevel_value');
		arrPattern.push('*.batteryLevel_timestamp');
		arrPattern.push('*.batteryState_value');
		arrPattern.push('*.batteryState_timestamp');
		arrPattern.push('*.rfLinkLevel_value');
		arrPattern.push('*.rfLinkLevel_timestamp');
		arrPattern.push('*.serial_value');
		arrPattern.push('*.modelType_value');
		arrPattern.push('*.rfLinkState_value');
		arrPattern.push('*.rfLinkState_timestamp');
		
		arrPattern.push('*.state_value');
		arrPattern.push('*.state_timestamp');
		arrPattern.push('*.activity_value');
		arrPattern.push('*.activity_timestamp');
		arrPattern.push('*.lastErrorCode_value');
		arrPattern.push('*.lastErrorCode_timestamp');
		arrPattern.push('*.operatingHours_value');
		
		arrPattern.push('*.duration_value');
		arrPattern.push('*.duration_timestamp');
		
		arrPattern.push('*.soilHumidity_value');
		arrPattern.push('*.soilHumidity_timestamp');
		arrPattern.push('*.soilTemperature_value');
		arrPattern.push('*.soilTemperature_timestamp');
		arrPattern.push('*.lightIntensity_value');
		arrPattern.push('*.lightIntensity_timestamp');
		arrPattern.push('*.ambientTemperature_value');
		arrPattern.push('*.ambientTemperature_timestamp');
		
		deleteStateWPatternList(adapter, arrPattern, 0, function(err) {
			ju.adapterloginfo(1, 'update for version ' + updateAdapterVersion + ' done with ' + adapterversion);
			if (callback) callback(err);
		});
	} else {
		if (callback) callback(0);
	}
}

function updateAdapter(adapter, callback) {
	let dotfactor = 100;
	let id = adapter.name + '.' + adapter.instance + '.info.adapterversion'
	
	let previousAdapterVersion = 0;
	
	let arr = adapterversion.split('.');
	let currentAdapterVersion = arr[0] * dotfactor * dotfactor + arr[1] * dotfactor + arr[2];
	
	adapter.getState(id, function(err, state) {
		if (!err) {
			if (state) {
				let arr = state.val.split('.');
				previousAdapterVersion = arr[0] * dotfactor * dotfactor + arr[1] * dotfactor + arr[2];
			} 

			updateAdapter010004(adapter, previousAdapterVersion, currentAdapterVersion, dotfactor);
			updateAdapter010005(adapter, previousAdapterVersion, currentAdapterVersion, dotfactor, function (err) {
				if (callback) callback(0);
			});
		}
		
		adapter.setObjectNotExists(id, {
			type: 'state',
			common: {
				name: 'adapterversion',
				type: 'string',
				role: 'text',
				read: true,
				write: false,
			},
			native: {},
		}, function (err) {
			if (err) {
				ju.adapterloginfo(1, 'ERROR updateAdapter: creating state info.adapterversion failed');
			} else {
				adapter.setState('info.adapterversion', adapterversion, true);
			}
		});
	});
}

function delStatesWList(adapter, arrId, idx, callback) {
	
	if (idx < arrId.length) {
	let id = arrId[idx];
	adapter.delState(id, function (err) {
		if (!err) {
			adapter.delObject(id, function (err) {
				ju.adapterloginfo(1, 'delStatesWList: ' + gardena_api.beautifyStateIdName(id) + ' removed');
				if (idx + 1 < arrId.length) {
					delStatesWList(adapter, arrId, idx + 1, function(err) {
						if (callback) callback(0);
					});
				} else {
					if (callback) callback(0);
				}
			});
		} else {
			if (callback) callback(0);
		}
	});
	} else {
		if (callback) callback(0);
	}
}

function deleteStateWPattern(adapter, namepattern, callback) {
	let pattern = adapter.name + '.' + adapter.instance + '.' + namepattern;
	let arrId = [];
	let arrIdBeautified = [];
	
	adapter.getStates(pattern, function(err, states) {
		if (!err && states) {
			for (let id in states) {
				arrId.push(id);
				arrIdBeautified.push(gardena_api.beautifyStateIdName(id));
			}
			ju.adapterloginfo(1, 'deleteStateWPattern: ' + namepattern + ' > found states=' + JSON.stringify(arrIdBeautified));
			
			if (arrId.length > 0) {
				delStatesWList(adapter, arrId, 0, function(err) {
					if (callback) callback(0);
				});
			} else {
				if (callback) callback(0);
			}
		} else {
			ju.adapterloginfo(1, 'deleteStateWPattern: ' + namepattern + ' > no states found');
			if (callback) callback(0);
		}
	});
}

function deleteStateWPatternList(adapter, patternlist, idx, callback) {
	let pattern = patternlist[idx];
	
	deleteStateWPattern(adapter, pattern, function(err) {
		if (idx + 1 < patternlist.length) {
			deleteStateWPatternList(adapter, patternlist, idx + 1, function(err) {
				if (callback) callback(0);
			});
		} else {
			if (callback) callback(0);
		}
	});
}


function main(adapter) {
    // Initialize your adapter here
    
    // Reset the connection indicator during startup
    adapter.setState('info.connection', false, true);
    
    // The adapters config (in the instance object everything under the attribute "native") is accessible via
    // this.config:
    ju.adapterloginfo(1, 'config authenticaton_host: ' + adapter.config.gardena_authentication_host);
    ju.adapterloginfo(1, 'config smart_host: ' + adapter.config.smart_host);
    //ju.adapterloginfo(1, 'config gardena_api_key: ' + adapter.config.gardena_api_key);
    //ju.adapterloginfo(1, 'config gardena_username: ' + adapter.config.gardena_username);
    //ju.adapterloginfo(1, 'config gardena_password: ' + adapter.config.gardena_password);
	configUseMowerHistory = adapter.config.useMowerHistory;

	gardena_api.setAdapter(adapter);
		
	updateAdapter(adapter, function(err) {
		gardena_api.setVer(mainrev);
		gardena_api.getConnection();
		
		if (configUseMowerHistory === true) {
			
			adapter.getState('info.saveMowingHistory', function (err, state) {
				if (!err && state) {
					if (state.val.length > 0) {
						let mowHistory = JSON.parse(state.val);
						gardena_api.setMowingHistory(mowHistory);
					}
				}
			});
			
			adapter.getState('info.saveChargingHistory', function (err, state) {
				if (!err && state) {
					if (state.val.length > 0) {
						let chargeHistory = JSON.parse(state.val);
						gardena_api.setChargingHistory(chargeHistory);
					}
				}
			});

		}
		
		// all states changes inside the adapters namespace are subscribed
		adapter.subscribeStates('*');
	});
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
        this.on('stateChange', this.onStateChange.bind(this));
        this.on('unload', this.onUnload.bind(this));
    }

    /**
     * Is called when databases are connected and adapter received configuration.
     */
	async onReady() {	 
		ju.adapterloginfo(1, "ready - Adapter: databases are connected and adapter received configuration");
		//ju.adapterloginfo(2, "config.gardena_password verschlüsselt: " + this.config.gardena_password);
		//ju.adapterloginfo(2, "config.gardena_api_key verschlüsselt: " + this.config.gardena_api_key);
		
		this.getForeignObject("system.config", (err, obj) => {
			if (obj && obj.native && obj.native.secret) {
				//noinspection JSUnresolvedVariable
				this.config.gardena_password = ju.decrypt(obj.native.secret, this.config.gardena_password);
				this.config.gardena_api_key = ju.decrypt(obj.native.secret, this.config.gardena_api_key);
			} else {
				//noinspection JSUnresolvedVariable
				let defkey = '"ZgAsfr5s6gFe87jJOx4M';
				this.config.gardena_password = ju.decrypt(defkey, this.config.gardena_password);
				this.config.gardena_api_key = ju.decrypt(defkey, this.config.gardena_api_key);
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
            ju.adapterloginfo(1, 'cleaned everything up...');
			gardena_api.stopAllTimer();
			
            callback();
        } catch (e) {
            callback();
        }
    }


    /**
     * Is called if a subscribed state changes
     * @param {string} id
     * @param {ioBroker.State | null | undefined} state
     */
    onStateChange(id, state) {
		if (state !== null && state !== undefined) {
			if (state.ack === false) {
				// The state was changed by user
				ju.adapterloginfo(3, '---> Command should be sent to device: state '+ gardena_api.beautifyStateIdName(id) + ' changed, ' + state.val + ' (ack = ' + state.ack + ')');
				gardena_api.sendCommand(id, state);
			} else {
				// The state was changed by system
				let arr = id.split('.');
				
				// print some logs, but for some large values it's not helpful to write the value itself
				switch (arr[arr.length - 1]) {
					case 'RateLimitCounter':
					case 'saveChargingHistory':
					case 'saveMowingHistory':
						ju.adapterloginfo(3, '---> State change by device: state ' + gardena_api.beautifyStateIdName(id) + ' changed, ' +  ' (ack = ' + state.ack + ')');
						break;
					default:
						ju.adapterloginfo(3, '---> State change by device: state ' + gardena_api.beautifyStateIdName(id) + ' changed: ' + state.val + ' (ack = ' + state.ack + ')');   
						break;
				}
			}
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