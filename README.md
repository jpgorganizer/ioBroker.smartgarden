![Logo](admin/smartgarden.png)
# ioBroker.smartgarden

![Number of Installations](http://iobroker.live/badges/smartgarden-installed.svg) 
[![NPM version](http://img.shields.io/npm/v/iobroker.smartgarden.svg)](https://www.npmjs.com/package/iobroker.smartgarden)
[![Downloads](https://img.shields.io/npm/dm/iobroker.smartgarden.svg)](https://www.npmjs.com/package/iobroker.smartgarden)

[![NPM](https://nodei.co/npm/iobroker.smartgarden.png?downloads=true)](https://nodei.co/npm/iobroker.smartgarden/)

[![Build Status](https://travis-ci.org/jpgorganizer/ioBroker.smartgarden.svg?branch=master)](https://travis-ci.org/jpgorganizer/ioBroker.smartgarden)


## ioBroker smartgarden adapter for GARDENA smart system

an adapter for Gardena smart system using official GARDENA smart system API and service


## Installation

tbd.


## Requirements

To use this adapter you need two things:
1. an GARDENA smart system account
1. an GARDENA application key

To get both things please go to https://developer.1689.cloud/docs#/docs/getting-started/

## Setup adapter

1. Install the adapter
1. Create an instance of the adapter
1. Edit username and password  in instance configuration
1. Edit application key in instance configuration
1. Verify default values of other settings in instance configuration. For most users the following values will be ok.
    - ping frequence: 150 seconds
    - factor for token validity: 1.001
    - testvariable: false (just for debugging/development)

Please note that password and application key are encoded and stored within the adapter 
and become just decoded for authentication with the Gardena application host.
  
  
## Datapoints of the adapter
The adapter is designed to monitor and control Gardena smart system devices. For this there
will be one 'LOCATION' and many 'DEVICEs'. For each DEVICE there will be one or more 
SERVICE_<servicelink_type>. Where <servicelink_type> is for example MOWER, POWER_SOCKET, VALVE
or VALVE_SET. See description for ServiceLink at 
https://developer.1689.cloud/apis/GARDENA+smart+system+API#/swagger

Supported devices:
  - mower (MOWER),
  - smart irrigation control (VALVE_SET and VALVE)
  - power socket (POWER_SOCKET)
 
### For MOWER
For controlling the device use datapoint
- duration_value

  Change this datapoint to start the power socket. 
  - To start for a defined time  set the value to the value in seconds (please use multiples of 60)
  - for automatic operation set string START_DONT_OVERRIDE
  - to cancel the current operation and return to charging station use string PARK_UNTIL_NEXT_TASK
  - to cancel the current operation, return to charging station, ignore schedule use string PARK_UNTIL_FURTHER_NOTICE
  

  
Special datapoints:
- activity_value_i
  This datapoint is generated by the adapter and not by Gardena api. 

  This datapoint shows two different states for the mower: MOWING or NOT_MOWING. Depending on the value
  in datapoint activity_value this datapoint is set.
  
  If activity_value is 
    - OK_CHARGING (The mower has to be mowing but insufficient charge level keeps it in the charging station.)
    - PARKED_TIMER (The mower is parked according to timer, will start again at configured time.)
    - PARKED_PARK_SELECTED (The mower is parked until further notice.)
    - PARKED_AUTOTIMER (The mower skips mowing because of insufficient grass height.)
    - PAUSED (The mower in a waiting state with hatch closed.)
	
  activity_value_i  is set to NOT_MOWING.

  If activity_value is 
    - OK_CUTTING (The mower id cutting in AUTO mode (schedule).)
    - OK_CUTTING_TIMER_OVERRIDDEN (The mower is cutting outside schedule.)
    - OK_SEARCHING (The mower is searching for the charging station.)
    - OK_LEAVING (The mower is leaving charging station.)
    - NONE (No activity is happening, perhaps due to an error.)
	- all other values
	
  activity_value_i  is set to NOT_MOWING.

- duration_leftover_i
  This datapoint is generated by the adapter and not by Gardena api. 

  Note: currently not supported


  
All other datapoints are just for monitoring and information.

### For VALVE_SET
For controlling the device use datapoint
- stop_all_valves_i
  This datapoint is generated by the adapter and not by Gardena api. 

  Change this datapoint to start the power socket. 
  - To stop all valves immediately use string STOP_UNTIL_NEXT_TASK

  
All other datapoints are just for monitoring and information.

 
### For VALVE
For controlling the device use datapoint
- duration_value

  Change this datapoint to start the power socket. 
  - To start for a defined time  set the value to the value in seconds (please use multiples of 60)
  - to cancel the current watering and continue with the schedule use string STOP_UNTIL_NEXT_TASK
  - to skip automatic operation until specified time, the currently active operation might or might not be cancelled (depends on device model) use string PAUSE 
  - to restore automatic operation if it was paused use string UNPAUSE
  
  
Special datapoint:
- duration_leftover_i
  This datapoint is generated by the adapter and not by Gardena api. 

  Note: currently not supported
  
All other datapoints are just for monitoring and information.

 
### For POWER_SOCKET
For controlling the device use datapoint
- duration_value

  Change this datapoint to start the mower. 
  - To start for a defined time  set the value to the value in seconds (please use multiples of 60)
  - To switch on the device forever please use the string START_OVERRIDE.
  - To stop the device use STOP_UNTIL_NEXT_TASK.
  
  
Special datapoint:
- duration_leftover_i
  This datapoint is generated by the adapter and not by Gardena api. 
  
  The value describes the number of minutes till the power socket is shut off. 
  
All other datapoints are just for monitoring and information.
  
## Known Errors
- the received value for mower operationHours is different to that reported in Gardena App. It's currently not clear  which one is correct.

## Note
This is a private project. I am not in any association with Gardena or Husqvarna.
  
## Changelog

### 0.0.1
* (jpgorganizer) initial release

## License
 Copyright (c) 2020 jpgorganizer, https://github.com/jpgorganizer 
 
 smartgarden by jpgorganizer is licensed under a 
 Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License [(CC BY-NC-SA4.0)](https://creativecommons.org/licenses/by-nc-sa/4.0/)
 Based on a work at https://github.com/jpgorganizer/ioBroker.smartgarden.
 
