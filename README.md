![Logo](admin/smartgarden.png) 

# ioBroker.smartgarden

![Number of Installations](http://iobroker.live/badges/smartgarden-installed.svg) 
[![NPM version](http://img.shields.io/npm/v/iobroker.smartgarden.svg)](https://www.npmjs.com/package/iobroker.smartgarden)
[![Downloads](https://img.shields.io/npm/dm/iobroker.smartgarden.svg)](https://www.npmjs.com/package/iobroker.smartgarden)

[![NPM](https://nodei.co/npm/iobroker.smartgarden.png?downloads=true)](https://nodei.co/npm/iobroker.smartgarden/)

[![Build Status](https://travis-ci.org/jpgorganizer/ioBroker.smartgarden.svg?branch=master)](https://travis-ci.org/jpgorganizer/ioBroker.smartgarden)




## ioBroker smartgarden adapter for GARDENA smart system

An adapter for GARDENA smart system using official 
[GARDENA smart system API](https://developer.1689.cloud/apis/GARDENA+smart+system+API#/general) 
and service. 

The adapter allows the development of an application (e.g. with VIS) that 
can be used in parallel with the official GARDENA app. The adapter and 
its additional features do not affect any of the basic functions of the 
GARDENA app and vice versa.

The adapter is not a complete replacement for the GARDENA app, but an 
addition to integrate the GARDENA devices into a smart home with ioBroker. 
The most important actions can be carried out with the adapter. It also 
offers the opportunity to implement your own ideas that are not possible 
with the GARDENA app.

<table border="0"><tr><td valign="top">  

## Supported devices

  - GARDENA smart SILENO robotic lawnmowers
  - GARDENA smart Irrigation Control
  - GARDENA smart Pressure Pump
  - GARDENA smart Water Control
  - GARDENA smart Power Adapter
  - GARDENA smart Sensor 

  For more information about the devices see at [GARDENA German website](https://www.gardena.com/de/produkte/smart/smartsystem/) 
  and [here in English](https://www.gardena.com/uk/products/smart/smart-system/).
  

## Requirements

To use this adapter you need two things:
1. an GARDENA smart system account
1. an GARDENA application key
 
To get both things please go to 
[https://developer.1689.cloud/docs#/docs/getting-started/](https://developer.1689.cloud/docs#/docs/getting-started/). 

**Note:**
  - If you already have a Husqvarna Automower® Connect or a GARDENA smart system account, 
    you can Sign In with that account and continue with Step 2, Create application to get 
	the application key.
  - Make sure that you've connected the application (from Step 2) to the API's
    - Authentication API ***and***
	- GARDENA smart system API.

And of course you need a running ioBroker installation and you should own at least one 
[GARDENA smart device](#supported-devices).

</td><td valign="top">

## Table of Contents
  * [Supported devices](#supported-devices)
  * [Requirements](#requirements)
  * [Installation](#installation)
  * [Setup adapter](#setup-adapter)
  * [Data points of the adapter](#data-points-of-the-adapter)
     * [For SERVICE_MOWER](#for-service_mower)
     * [For SERVICE_VALVE_SET](#for-service_valve_set)
     * [For SERVICE_VALVE](#for-service_valve)
     * [For SERVICE_POWER_SOCKET](#for-service_power_socket)
     * [For SERVICE_SENSOR](#for-service_sensor)
     * [For SERVICE_COMMON](#for-service_common)
  * [Known Errors](#known-errors)
  * [Wishes for data points](#Wishes-for-data-points)
  * [Note](#note)
  * [Changelog](#changelog)
     * [0.5.0](#050)
     * [0.4.2](#042)
     * [0.4.1](#041)
     * [0.4.0](#040)
     * [older versions](#030)
  * [Credits](#credits)
  * [License](#license)  
  
</td></tr></table>

## Installation

Adapter is available 
- at npm: Install with `npm install jpgorganizer.smartgarden` 
- at GitHub under https://github.com/jpgorganizer/ioBroker.smartgarden. 
An description how to install from GitHub is available 
[here](https://www.iobroker.net/docu/index-235.htm?page_id=5379&lang=de#3_Adapter_aus_eigener_URL_installieren) (German language).

## Setup adapter

1. Install the adapter
2. Create an instance of the adapter
3. Edit username and password in instance configuration
4. Edit application key in instance configuration
5. Verify default values of other settings and switch on/off options in 
instance configuration. For most users the following values will be ok. 
    - ping frequence: 150 seconds (default: 150)
    - factor for token validity: 1.001 (default: 1.001)
	- PreDefineStates: *(new in v0.4.0)* switch on or off (default: off), 
	if switched on then all states of the GARDENA smart system API are 
	created regardless if they are currently transmitted by GARDENA service 
	or not.
    - use forecast ... : *(new in v0.5.0)* switch forecast charging and 
	mowing time of mower on/off: (default: off)

      - number of mower history cycles: *(new in v0.5.0)* you can use 
	  any number from 3 (minimum), but 10 (default) seems to be a good value; 
	  only relevant if the above 'use forecast ...' is on

    - testVariable: on/off (default: off), just for debugging/development
    - Loglevel: 0 (default)  [0 = no log, 1 = some logs, 2 = some more logs, 3 = all logs]
	- Authentication host URL: `https://api.authentication.husqvarnagroup.dev` (default)
	- Webservice Base-URL: `https://api.smart.gardena.dev` (default)

Please note that password and application key are encoded and stored within 
the adapter and become just decoded for authentication with the GARDENA 
application host.
  
If you change the value of those settings please restart your adapter.
  
## Data points of the adapter
The adapter is designed to monitor and control GARDENA smart system devices. 
For this there will be one `LOCATION` and one or many `DEVICE`'s. 
For each `DEVICE` there will be 
  - one `SERVICE_COMMON_<id>` and
  - one or more `SERVICE_<servicelink_type>_<id>`. 

Where `<servicelink_type>` is a type description for the 
device, for example MOWER or VALVE and `<id>` is a (encoded) 
GARDENA device id used by the API. 
See description for ServiceLink at 
[https://developer.1689.cloud/apis/GARDENA+smart+system+API#/swagger](https://developer.1689.cloud/apis/GARDENA+smart+system+API#/swagger).

Controlling/monitoring for each device is possible via the `SERVICE_<servicelink_type>` 
listed in the following table. The `SERVICE_COMMON` provides general information 
about the device.

  | device | SERVICE_<servicelink_type> |
  | - | - |
  | smart SILENO robotic lawnmower | SERVICE_MOWER and SERVICE_COMMON |
  | smart Irrigation Control | SERVICE_VALVE_SET, SERVICE_VALVE and SERVICE_COMMON |
  | smart Pressure Pump | SERVICE_VALVE and SERVICE_COMMON |
  | smart Water Control | SERVICE_VALVE and SERVICE_COMMON |
  | smart Power Adapter | SERVICE_POWER_SOCKET and SERVICE_COMMON |
  | smart Sensor | SERVICE_SENSOR and SERVICE_COMMON |

If you need more information about the data points please have a look at 
[https://developer.1689.cloud/apis/GARDENA+smart+system+API#/swagger](https://developer.1689.cloud/apis/GARDENA+smart+system+API#/swagger). 
There you'll find a description for every data point; except for those which 
are marked as data points of the adapter and not of the GARDENA smart system API.
  
### For SERVICE_MOWER
#### Controlling
To control the device use data point
- `activity_control_i`

  *This data point is generated by the adapter and is not required due to the GARDENA smart system API.*
  
  Change this data point to start the mower. 
  - To start for a defined time set the value to the planned duration in 
  seconds (please use multiples of 60)
  - for automatic operation set string `START_DONT_OVERRIDE`
  - to cancel the current operation and return to charging station use 
  string `PARK_UNTIL_NEXT_TASK`
  - to cancel the current operation, return to charging station and ignore 
  schedule use string `PARK_UNTIL_FURTHER_NOTICE`

#### Monitoring
All other data points are just for monitoring and information.

Special data points:
- `activity_mowing_i`

  *This data point is generated by the adapter and is not required due to the GARDENA smart system API.*

  This data point shows two different states for the mower: 
  - `true`: mowing or 
  - `false`: not mowing. 
  
  This data point can be used for further actions where it is important to 
  know whether the mower is safely on the lawn or not.
  
  Depending on the value of data point `activity_value` this data point is set. 
  Please see following table for details.

  | `activity_value` | `activity_mowing_i` |
  | - | - |
  |`OK_CHARGING` The mower has to be mowing but insufficient charge level keeps it in the charging station. | false |
  |`PARKED_TIMER` The mower is parked according to timer, will start again at configured time. | false |
  |`PARKED_PARK_SELECTED` The mower is parked until further notice. | false |
  |`PARKED_AUTOTIMER` The mower skips mowing because of insufficient grass height. | false |
  |`PAUSED` The mower is in a waiting state with hatch closed. | false |
  |`OK_CUTTING` The mower is cutting in AUTO mode (schedule). | true |
  |`OK_CUTTING_TIMER_OVERRIDDEN` The mower is cutting outside schedule. | true |
  |`OK_SEARCHING` The mower is searching for the charging station. | true |
  |`OK_LEAVING` The mower is leaving charging station. | true |
  |`NONE` No activity is happening, perhaps due to an error. | true |
  |all other values | true |

- `batteryState_chargingTime_remain_i` *(under SERVICE_COMMON...)* and <br/> 
`activity_mowingTime_remain_i` *(under SERVICE_MOWER...)*

  *Both data points are generated by the adapter and are not required due to the GARDENA smart system API.* 

  Those data points show an forecast for remaining charging and mowing time 
  in seconds of the mower. 

  To forecast a value an history of the last few charging and mowing cycles 
  is saved in two states `info.saveMowingHistory` and 
  `info.saveChargingHistory`. 

  This feature can be switched on/off in adapter instance configuration 
  along with the number of saved charging and mowing cycles in history. 

  To put this function into operation, please make sure that at least one 
  cycle of mowing and loading runs without errors (e.g. not interrupted 
  manually). It is better if at least three runs are completed without 
  errors. This function tries to recognize the normal case and initially 
  assumes that the next process is a normal case. If this is faulty, then 
  this faulty run is regarded as a normal case and the runs that then pass 
  through normally as a fault case. If there is an error during the run, 
  please stop the adapter, delete the two data points and start again.
  
  For more information about general forecasting mechanisms see 
  [FORECAST.md](FORECAST.md).
  
  **Notes:** 
    1. Forecast values are only available if at least one complete 
	charging and mowing cycle is saved in history.
  
    2. The history is saved under `info` so that if the `LOCATION` needs 
	to be deleted, e.g. in the event of a future update, it is not lost.

    3. If you disconnect your mower from the GARDENA smart system and 
	reconnect it again the history is lost, because your mower get's a new 
	id within the GARDENA smart system. This means that the adapter cannot 
	recognize the mower as the previous mower - may be it's a second one. 
	In this case it is recommended to delete these two data points and to 
	restart the adapter so that the previous (now old) history sets are not 
	constantly read and written. The adapter then begins to build a new 
	history.
	
	4. This function should work for more than one mower, but it is 
	not tested *(I can't do that, because I've only one mower)*. 
	If you have more than one mower please test and report errors 
	and of course report if it works as intended. Thanks in advance for that.
  
- `lastErrorCode_value`

  Please pay special attention to data point `lastErrorCode_value`. 
  A description of possible values can be found at 
  https://developer.1689.cloud/apis/GARDENA+smart+system+API#/swagger, 
  see "MowerService - lastErrorCode"

### For SERVICE_VALVE_SET
#### Controlling
To control the device use data point
- `stop_all_valves_i`

  *This data point is generated by the adapter and is not required due to the GARDENA smart system API.* 

  Change this data point to stop all valves. 
  - To stop all valves immediately use string `STOP_UNTIL_NEXT_TASK`
  
  **Note:** Do not display the value of this data point in your application, 
  as the value is mostly undefined. Furthermore, this data point cannot 
  serve as a trigger for your own actions, because it is just set to value 
  *null* after the command was triggered.

#### Monitoring  
All other data points are just for monitoring and information.

 
### For SERVICE_VALVE
#### Controlling

To control the device use data point
- `duration_value`

  Change this data point to start the valve. 
  - To start for a defined time  set the value to the value in seconds 
  (please use multiples of 60). 
    
    **Note:** There are some limitations for the allowed values. 
    Please report if you see other limitations. 
	
    | device | limit |
    | - | - |
    |GARDENA smart Irrigation Control| 3540 seconds (59 minutes) |
    |GARDENA smart Pump | 36000 (10 hours) |
    |GARDENA smart Water Control | 36000 (10 hours) |
    
  - to cancel the current watering and continue with the schedule use string 
  `STOP_UNTIL_NEXT_TASK`
  - to skip automatic operation until specified time, the currently active 
  operation might or might 
  not be cancelled (depends on device model) use string `PAUSE` 
  - to restore automatic operation if it was paused use string `UNPAUSE`
  
#### Monitoring

All other data points are just for monitoring and information.

Special data point:
- `duration_leftover_i`

  *This data point is generated by the adapter and is not required due to the GARDENA smart system API.*
  
  The value describes the number of minutes till the valve is closed and 
  watering stops. 
    - An integer, one (`1`) or more.
    - `null` if undefined
   
 
### For SERVICE_POWER_SOCKET
#### Controlling
To control the device use data point
- `duration_value`

  Change this data point to start the power socket. 
  - To start for a defined time  set the value to the value in seconds 
  (please use multiples of 60)
  - To switch on the device forever please use the string `START_OVERRIDE`.
  - To stop the device use `STOP_UNTIL_NEXT_TASK`.

#### Monitoring

All other data points are just for monitoring and information.

Special data point:
- `duration_leftover_i`

  *This data point is generated by the adapter and is not required due to the GARDENA smart system API.*
  
  The value describes the number of minutes till the power socket is shut off.  
    - An integer, one (`1`) or more.
    - `null` if undefined
  

### For SERVICE_SENSOR
#### Controlling
No control functions available.

#### Monitoring
All data points are just for monitoring and information.


### For SERVICE_COMMON

The `SERVICE_COMMON` provides general information about the device. 
Description is integrated into description of other SERVICE_... where necessary.


## Known Errors
- the received value for mower data point `operationHours_value` is different 
to that reported in GARDENA app. It's currently not clear  which one is correct.

## Wishes for data points

This adapter reports every value as a data point that is supplied via the 
GARDENA smart system API. If someone wants more values, please contact GARDENA 
and inform them that this value will also be included in the API. To do this, 
please go to ***Contact us & Leave feedback*** in the footer on the 
[Developer Portal](https://developer.1689.cloud).


## Note
This is a private project. I am not in any association with GARDENA or Husqvarna.

  
## Changelog
### 0.5.0
* (jpgorganizer) 
  - MOWER: forecast for remaining charging time and remaining mowing time 
  integrated
  - **IMPORTANT CHANGE** for existing users: the id for LOCATION, all 
    DEVICE's and all SERVICE's has changed due to support of History adapter. 
	(History adapter cannot handle id's with `%` (percent) character within id's, 
	although the `%` is not forbidden in id's in ioBroker), 
	e.g. [Issue 8](https://github.com/jpgorganizer/ioBroker.smartgarden/issues/8). 
  
    So you **must delete all states** of the adapter instance to 
    install this release and please check your application carefully for 
    necessary adjustments regarding the change of the id names.

  - devices *Water Control* and *Smart Pump* tested (many thanks to user 
  gammler2003 and xengosam at 
  [ioBroker Forum](https://forum.iobroker.net/topic/31289/neuer-adapter-smartgarden-adapter-for-gardena-smart-system/) for testing)
  - some code rework and improvement of documentation
  - dependency corrected, important for js-controller v3, 
    e.g. [Issue 7](https://github.com/jpgorganizer/ioBroker.smartgarden/issues/7)
  - adapter now available at npm
  
### 0.4.2
* (jpgorganizer) 
  - error *missing SENSOR data* fixed (many thanks to user dslraser and 
  muckel at 
  [ioBroker Forum](https://forum.iobroker.net/topic/31289/neuer-adapter-smartgarden-adapter-for-gardena-smart-system/) for testing)

### 0.4.1
* (jpgorganizer) 
  - Dependency get's resolved now
  
### 0.4.0
* (jpgorganizer) 
  - **NOTE:** with this version an additional dependency is necessary at runtime. 
  If it does not get installed together with the installation of this adapter, 
  please install seperately with 
  `npm install https://github.com/jpgorganizer/ioBroker.utils` or `npm i @jpgorganizer/utils`
  - **NOTE:** you **must delete all states** of the adapter instance to 
  install this release and please check your application carefully for 
  necessary adjustments regarding type/role changes (see below) 
  - data types of (nearly) all data points adjusted for compliance with 
  ioBroker guidance: 
    * states now have special ioBroker type and role instead of former 
	`string`/`text` where applicable, e.g. `number`/`value.battery` for 
	`batteryLevel_value`, see 
	[Issue 3](https://github.com/jpgorganizer/ioBroker.smartgarden/issues/3)
  - data point `activity_value_i` replaced by `activity_mowing_i` with type/role 
  `boolean`/`indicator.working`: `true` means *mowing*, `false` 
  means *not mowing*
  - possibility to pre-define states integrated, see new switch 
  `PreDefine States` in adapter/instance configuration, see 
  [Issue 2](https://github.com/jpgorganizer/ioBroker.smartgarden/issues/2)
  - states are readonly now; except states for commands, see 
  [Issue 4](https://github.com/jpgorganizer/ioBroker.smartgarden/issues/4)
  - input field for `useTestVariable` in adapter/instance configuration 
  switched to a *checkbox* (former: *text*); please check your settings
  - error in command  `stop_all_valves_i` in VALVE_SET fixed
  
### 0.3.0
* (jpgorganizer) 
  - create all states read/write 
  - error TypeError: Cannot read property 'val' of null with useTestVariable 
  fixed



### 0.2.0
* (jpgorganizer) 
  - **IMPORTANT** : data point for MOWER control (command) changed from  
  `duration_value` to `activity_control_i`
  - rework leftovertimer 
  - improved error handling
  - improved logging (see  loglevel in adapter configurations)

### 0.0.1
* (jpgorganizer) initial release


## Credits
smartgarden logo: http://www.freepik.com Designed by Freepik


## License

 Copyright (c) 2020 jpgorganizer, https://github.com/jpgorganizer 
 
 smartgarden by jpgorganizer is licensed under a 
 Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License 
 [(CC-BY-NC-SA-4.0)](https://creativecommons.org/licenses/by-nc-sa/4.0/)
 Based on a work at https://github.com/jpgorganizer/ioBroker.smartgarden.
 

<!--- SVN: $Rev: 2070 $ $Date: 2020-04-25 19:10:00 +0200 (Sa, 25 Apr 2020) $ --->