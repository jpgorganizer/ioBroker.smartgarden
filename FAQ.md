![Logo](admin/smartgarden.png) 

# ioBroker.smartgarden

## FAQ


| Question | Answer |
| - | - |
| I always get `Error: 401` | Verify again username, password and API key |
| I updated my js-Controller to 3.x.y, since then I get an error `.... required adapter "@jpgorganizer/utils" not found!'` | The easiest way to fix that is to uninstall the adapter and reinstall it again.|
| I don't get values for forecast of mowing or charging time | delete datapoints `info.saveMowingHistory` and   `info.saveChargingHistory` and start again. Make sure that you have at least one mowing / charging cycle without errors |
| after an update from version < 0.5.0 to version >= 0.5.0 all id's have changed | yes, this was necessary due to support of History adapter. For more info see Changelog |
| I would like to have more/other values for my devices | please read chapter *Wishes for data points* in [README](README.md) |
| I get `invalid date` for each timestamp | this behaviour should be fixed with versions > 0.6.0 |
| I always get `Error: getlocations: no data` | this error was an error of the Gardena Smart API and is fixed by Gardena |
| Do I need the Gardena Bridge or is it possible to operate the Gardena smart system without the bridge | You need the bridge. The bridge connects your devices to the Gardena cloud and the smartgarden adapter communicates with the Gardena cloud |

 


<!--- SVN: $Rev: 2173 $ $Date: 2020-06-16 20:31:56 +0200 (Di, 16 Jun 2020) $ --->