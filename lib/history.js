/**
 * Adapter for integration of Gardena Smart System to ioBroker
 * based on official GARDENA smart system API (https://developer.1689.cloud/)
 * Support:             https://forum.iobroker.net/...
 * Autor:               jpgorganizer (ioBroker) | jpgorganizer (github)
 * SVN:                 $Rev: 2831 $ ($Date: 2022-06-13 13:00:32 +0200 (Mo, 13 Jun 2022) $)
 * contains classes for forecast history
 */

const maxHistoryInvalidCounter = 10; 
const maxHistorySetsDefault = 6;
const historySetLengthDef = 101;
const whiskerfaktor = 1.5;
const minIQR = 1;

const qualityForecastNotValid = 0;
//const qualityForecastBasedOnCalulatedValue = 1;
const qualityForecastBasedOnRealValue = 2;

// internal func
function createHistorySet (_this) {
	let o;
	_this.historySet = [];
	
	for (let i = 0; i <= (historySetLengthDef -1); i++) { // we need 101 elements 0..100
		o = new Object();
		o.timestamp = '';
		o.quality = qualityForecastNotValid;
		o.estimated_val = '';
		o.real_val = '';
		_this.historySet.push(o);
	}
}

// internal func
function boxplot(box, newval) {
	//let median = 0;  
	let lowerQuartil; 
	let upperQuartil; 
	let iqr; // interquartile range
	let minimumWhisker;
	let maximumWhisker;
	
	box.sort(function(a, b){return a-b});
	//median       = box[Math.round(box.length / 2)];
	switch (box.length) {
		case 0:   // this should never happen, just to be sure that we dont get wrong data
			return false;
		case 1:
		case 2:
			return true; // true by definition
		default: 
			lowerQuartil = box[Math.round(box.length / 4)]; // lowerQuartil is calculated with box.len 
			upperQuartil = box[Math.round((box.length - 1) / 4 * 3)];  // upperQuartil is calculated with box.len - 1
			break;
	}

	iqr = upperQuartil - lowerQuartil;
	if (iqr < minIQR) {  // if range is 0, then there is no chance to have a value other than upperQuartil/lowerQuartil
		iqr = minIQR;    // so we allow a small range
	}
	
	minimumWhisker = lowerQuartil - (whiskerfaktor * iqr);
	maximumWhisker = upperQuartil + (whiskerfaktor * iqr);
	
	if (newval < minimumWhisker || newval > maximumWhisker) {
		return false;
	} else {
		return true;
	}
}

//internal class
class historySet {
	constructor(hset) {
		this.valid = false;
		this.endRecognized = '';
		
		if (hset) {
			if (hset.valid === true) {
				if (hset.historySet.length === historySetLengthDef) {
					this.valid = hset.valid;
					if (hset.hasOwnProperty('endRecognized')) {
						this.endRecognized = hset.endRecognized;
					}
					this.historySet = hset.historySet;	
				} else { //given historySet had wrong size
					this.valid = false;
					createHistorySet(this);
				}
			} else { //given historySet was not valid
				this.valid = false;
				createHistorySet(this);
			}		
		} else {
			createHistorySet(this);
		}
	}
	
	setEndRecognized() {
		let d = new Date();			
		this.endRecognized =  d.toISOString();	
	}

	getEndRecognized() {
		return this.endRecognized;
	}

	setForecast(batteryVal, val) {
		this.historySet[batteryVal].estimated_val = val;
	}
	
	getForecastPeriod(batteryVal) {
		if (this.valid) {
			return 	{
						'val': this.historySet[batteryVal].estimated_val, 
						'quality': this.historySet[batteryVal].quality 
					};
		} else {
			return 	{
						'val': 0, 
						'quality': qualityForecastNotValid 
					};
		}
	}

	getRemainingPeriod (batteryVal) {
		
		if (this.valid) {
			return 	{
						'val': this.historySet[batteryVal].real_val, 
						'quality': this.historySet[batteryVal].quality 
					};
		} else {
			return 	{
						'val': 0, 
						'quality': qualityForecastNotValid 
					};
		}	
	}
	
	get getLastSetPeriod() {
		let i;
		let last;
		for (last = -1, i = 0; i < this.historySet.length; i++) {
			if (this.historySet[i].quality >= qualityForecastBasedOnRealValue) {
				last = i;
			}
		}
		return last;
	}
	
	get getFirstSetPeriod() {
		let i;
		let first;
		for (first = -1, i = 0; i < this.historySet.length; i++) {
			if (this.historySet[i].quality >= qualityForecastBasedOnRealValue) {
				first = i;
				break;
			}
		}
		return first;
		
	}
	
	get getCycleLength() {	
		let firstms;
		let lastms;
		let delta = 0;
		let first = this.getFirstSetPeriod;
		let last = this.getLastSetPeriod;
		
		if (first !== -1 && last !== -1 ) {
			firstms = Date.parse(this.historySet[first].timestamp);
			lastms  = Date.parse(this.historySet[last].timestamp);
			delta = lastms - firstms;
		} else {
			delta = 0;
		}
		
		return delta;
	}

	setInvalid() {
		this.valid = false;
		this.endRecognized = '';
		createHistorySet(this);
	}
	
	setValid() {
		let i;
		let endtime;
		let htime;
		let first = this.getFirstSetPeriod;
		let last = this.getLastSetPeriod;
		let ende = this.getEndRecognized();
		this.valid = false;

		if (first !== -1 && last !== -1 && last >= first && ende !== '') {
			this.valid = true;
			// const moonLanding = Date.parse('July 20, 69 00:20:18 GMT+00:00');
			// milliseconds since Jan 1, 1970, 00:00:00.000 GMT
			// compute real values for remaining time
			endtime = Date.parse(ende);
			for (i = first; i <= last; i++) {
				htime = Date.parse(this.historySet[i].timestamp);
				this.historySet[i].real_val = (endtime - htime)/1000;
			}
		}
	}
	
	get isValid () {
		return this.valid;
	}
	
	setTimestamp (batteryVal, timestamp) {
		if (this.historySet[batteryVal].timestamp === '') {
			this.historySet[batteryVal].timestamp = timestamp;
			this.historySet[batteryVal].quality = qualityForecastBasedOnRealValue;
		}
	}
}

class HistoryForecast {
	constructor(reverseorder, max_history_sets, data) {
		let o;
		
		if (!max_history_sets) {
			max_history_sets = maxHistorySetsDefault;
		}
		
		if (!reverseorder) {
			reverseorder = false;  // same as 'standard'
		}
		
		if (reverseorder === 'reverse' || reverseorder === true) { // 'standard', 'reverse'
			this.reverseorder = true;
		} else {
			this.reverseorder = false;
		}

		this.lastHistoryInvalidCounter = 0;

		this.historyData = [];
		
		if (data) {
			this.reverseorder = data.reverseorder;
			
			if (data.hasOwnProperty('lastHistoryInvalidCounter')) {
				this.lastHistoryInvalidCounter = data.lastHistoryInvalidCounter;
			}
			o = new historySet(); // first historySet has to be empty
			this.historyData.push(o);
			
			for (let i = 1; i < max_history_sets; i++) { // we dont use the first historySet, we start with the second one
				if (i < data.historyData.length) {
					o = new historySet(data.historyData[i]); 
				} else {
					o = new historySet(); 
				}
				this.historyData.push(o);
			}
		} else {
			for (let i = 0; i < max_history_sets; i++) {
				o = new historySet(); 
				this.historyData.push(o);
			}
		}
	}
	
	add(batteryVal, timestamp) {
		let fc;
		let q;
		let i;
		
		if (isNaN( parseInt(batteryVal) )) {
			batteryVal = 0;
		}
		
		if (batteryVal > 100) {
			batteryVal = 100;
		}
		
		if (batteryVal < 0) {
			batteryVal = 0;
		}
		
		if (this.reverseorder === true) {
			batteryVal = 100 - batteryVal;
		}
		
		if (timestamp === '') {
			let d = new Date();
			timestamp = d.toUTCString();
		}
		
		this.historyData[0].setTimestamp(batteryVal, timestamp);  // new timestamps are written to newest historySet
		
		// eval forecast
		for (fc = 0, q = 0, i = 1; i < this.historyData.length; i++) { // we don't use the newest historySet, because this is currently written
			if (this.historyData[i].isValid) {
				let p = this.historyData[i].getRemainingPeriod(batteryVal);
				if (p.val !== '') {
					fc = fc + (p.val * p.quality);
					q = q + p.quality;
				}
			}
		}
		
		if (q !== 0) {
			fc = Math.round(fc / q);
		} else {
			fc = '';
		}
		
		if (fc < 0 ) { // in case of wrong history data: maybe we get negative values
			fc = '';
		}
		
		this.historyData[0].setForecast(batteryVal, fc); // write to newest historySet				
		return fc;
	}
			
	shift() {
		let i;
		let box;    // box for boxplot
		
		// we assume new data is correct
		this.historyData[0].setValid();
		
		if (this.historyData[0].isValid) {
			box = [];
			// check if we have wrong data
			// create data for boxplot of battery
			for (i = 0; i < this.historyData.length; i++) {
				if (this.historyData[i].isValid === true) {
					box.push(this.historyData[i].getLastSetPeriod);
				}
			}
			
			if (boxplot(box, this.historyData[0].getLastSetPeriod) === false) {
				this.historyData[0].setInvalid();
			}
		}
		
		
//		if (this.historyData[0].isValid) {
//			box = [];
//			// check if we have wrong data
//			// create data for boxplot of cyclelength
//			for (i = 0; i < this.historyData.length; i++) {
//				if (this.historyData[i].isValid === true) {
//					box.push(this.historyData[i].getCycleLength);
//				}
//			}
//			
//			if (boxplot(box, this.historyData[0].getCycleLength) === false) {
//				this.historyData[0].setInvalid();
//			}
//		}

		
		if (this.historyData[0].isValid) {
			// reset counter of last invalid histories
			this.lastHistoryInvalidCounter = 0;
			
			// shift one by one, overwrite the last by last-1
			for (i = this.historyData.length - 1; i >= 1; i--) {
				this.historyData[i] = this.historyData[i - 1];
			}
			
			// and create one new history at the beginning
			this.historyData[0] = new historySet();
			
			return true;
		} else {
			this.historyData[0].setInvalid();
			
			// we increment a counter, if it gets too high we clear all histories and reset counter
			this.lastHistoryInvalidCounter = this.lastHistoryInvalidCounter + 1;
			if (this.lastHistoryInvalidCounter > maxHistoryInvalidCounter) {
				for (i = 0; i < this.historyData.length; i++) {
					this.historyData[i].setInvalid();
				}
				this.lastHistoryInvalidCounter = 0;
			}
			return false;
		}
	}

	discard() {
		this.historyData[0].setInvalid();
	}
	
	setEndRecognized() {
		this.historyData[0].setEndRecognized();
	}

	getEndRecognized() {
		this.historyData[0].getEndRecognized();
	}
}

module.exports = {
	HistoryForecast: HistoryForecast
}


