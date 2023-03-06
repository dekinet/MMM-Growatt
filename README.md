# MMM-Growatt
[Magic Mirror](https://github.com/MichMich/MagicMirror) module for displaying [Growatt](https://www.ginverter.com/) inverter data.

This module utilises the [Growatt npm package](https://www.npmjs.com/package/growatt) to pull data from the Growatt API and display as a simple table on the Magic Mirror.

## Installation
* Install [MagicMirror](https://docs.magicmirror.builders/)
* `cd <MagicMirrorInstallation>/modules`
* `git clone https://github.com/dekinet/MMM-Growatte.git`
* `cd MMM-Growatt`
* `npm install`

## Configuration
There are a number of configuration options available:

| Option               | Default          | Description  |
| ---------------------|------------------| -------------|
| `intervalSecs`       | 300              | Defines how often to poll the API for data. Don't do this too quickly, or your requests will be rejected by the server. |
| `plantName`          | false            | Display the plant name? |
| `lastUpdated`        | true             | Display the timestamp of the last time data was sent to the server by the inverter. |
| `currentPower`       | true             | Display the current power generated. |
| `dayTotalGenerated`  | true             | Display the amount of power generated today. |
| `monthTotalGenerated` | false           | Display the amount of power generated this month. |
| `totalGenerated`      | false           | Display the total amount of power generated. |

In addition, the MM config file must include you Growatt server username and password. There are no default values for these.

An entry in the module configuration file might look like this:
```
  {
    module: "MMM-Growatt",
    position: "top_right",
    config: {
      intervalSecs: 600,
      plantName: true,
      user: "my.username",
      password: "123456",
  },
```

## Dependencies
* [MagicMirror](https://github.com/MichMich/MagicMirror)
* [npm-growatt](https://www.npmjs.com/package/growatt): Used to retrieve data from the Growatt API server.

## Styling
A simple `styles.css` file is included. The generated data utilises the following classes:

| Class Name           | Used |
| ---------------------|------|
| `growatt-data`       | The whole generated div |
| `growatt-table`      | The table containing Growatt data |
| `growatt-row`        | All rows in the table |
| `growatt-cell`         | All cells in the table |

## Limitations
I only have access to one inverter, so recieved data from multiple interverters is not likely handled correctly. Fixes are welcome.
