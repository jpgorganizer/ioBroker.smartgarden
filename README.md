![Logo](admin/smartgarden.png)
# ioBroker.smartgarden

[![NPM version](http://img.shields.io/npm/v/iobroker.smartgarden.svg)](https://www.npmjs.com/package/iobroker.smartgarden)
[![Downloads](https://img.shields.io/npm/dm/iobroker.smartgarden.svg)](https://www.npmjs.com/package/iobroker.smartgarden)
[![Dependency Status](https://img.shields.io/david/jpgorganizer/iobroker.smartgarden.svg)](https://david-dm.org/jpgorganizer/iobroker.smartgarden)
[![Known Vulnerabilities](https://snyk.io/test/github/jpgorganizer/ioBroker.smartgarden/badge.svg)](https://snyk.io/test/github/jpgorganizer/ioBroker.smartgarden)

[![NPM](https://nodei.co/npm/iobroker.smartgarden.png?downloads=true)](https://nodei.co/npm/iobroker.smartgarden/)

**Tests:**: [![Travis-CI](http://img.shields.io/travis/jpgorganizer/ioBroker.smartgarden/master.svg)](https://travis-ci.org/jpgorganizer/ioBroker.smartgarden)

## smartgarden adapter for ioBroker

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
1. Verify default values of other settings in instance configuration

Please note that password and application key are encoded and stored within the adapter 
and become just decoded for authentication with the Gardena application host.
  
  
## Datapoints of the adapter
The adapter is designed to monitor and control Gardena smart system devices. For this there
will be one 'LOCATION' and many 'DEVICEs'. For each DEVICE there will be one or more 
SERVICE_<servicelink_type>. Where <servicelink_type> is for example MOWER, POWER_SOCKET, VALVE
or VALVE_SET. See description for ServiceLink at 
https://developer.1689.cloud/apis/GARDENA+smart+system+API#/swagger

At this time only POWER_SOCKET is supported. Support for VALVES and MOWER will be integrated 
in spring 2020.
 

### For POWER_SOCKET
For controlling the device use datapoint
- duration_value

  Change this datapoint to the period time (in seconds) you like to start the power socket. 
  - To start for a defined time  set the value to the value in seconds (please use multiples of 60)
  - To switch on the device forever please use the string START_OVERRIDE.
  - To stop the device use STOP_UNTIL_NEXT_TASK.
  
  
Special datapoint:
- duration_leftover_i

  This datapoint is generated by the adapter and not by Gardena api. The value describes the 
  number of minutes till the power socket is shut off. 
  
All other datapoints are just for monitoring and information.
  

## Changelog

### 0.0.1
* (jpgorganizer) initial release

## License
 Copyright (c) 2020 jpgorganizer, https://github.com/jpgorganizer 
 
 smartgarden by jpgorganizer is licensed under a 
 Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License [(CC BY-NC-SA4.0)](https://creativecommons.org/licenses/by-nc-sa/4.0/)
 Based on a work at https://github.com/jpgorganizer/ioBroker.smartgarden.
 

