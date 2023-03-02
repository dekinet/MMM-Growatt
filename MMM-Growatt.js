function addCellsToRow(tr, leftText, rightText) {
  let td = document.createElement('td');
  td.setAttribute('class', 'growatt-cell');
  td.innerText = leftText;
  tr.appendChild(td);

  td = document.createElement('td');
  td.setAttribute('class', 'growatt-cell');
  td.innerText = rightText;
  tr.appendChild(td);
}

Module.register("MMM-Growatt", {
  // Default configs
  defaults: {
    intervalSecs: 300,
  },

  start: function () {
    Log.log('Starting module: ' + this.name);
    me = this;
    this.result = null;

    me.getData();

    setInterval(function() {
      me.getData(me);
    }, me.config.intervalSecs * 1000);
  },

  getData: function (me = this) {
    Log.info(me.name + ': Getting data');
    me.sendSocketNotification("GROWATT_GET_DATA", {
      config: me.config,
    });
  },

  getStyles: function () {
    return [
      this.file('styles.css'),
    ];
  },

  socketNotificationReceived: function(notification, payload) {
    if (notification === "GROWATT_GOT_DATA") {
      Log.info('GROWATT_GOT_DATA: ' + JSON.stringify(payload));
      this.result = { payload: JSON.parse(payload) };
      this.updateDom();
    }
  },

  // Override the DOM generator
  getDom: function () {
    let wrapper = document.createElement('div');
    wrapper.setAttribute('class', 'growatt-data');
    wrapper.innerText = 'Growatt';
    let table = document.createElement('table');
    table.setAttribute('class', 'growatt-table');
    wrapper.appendChild(table);

    let tr = document.createElement('tr');
    tr.setAttribute('class', 'growatt-row');

    if (this.result) {
      const mydata = this.result.payload[0].data.devicesData[0].data;

      let td = document.createElement('td');
      td.setAttribute('class', 'growatt-cell');
      td.innerText = 'Updated:';
      tr.appendChild(td);

      td = document.createElement('td');
      td.setAttribute('class', 'growatt-cell');
      if (this.result.payload) {
        td.innerText = mydata.deviceData.lastUpdateTime.split(' ')[1];
      } else {
        td.innerText = 'Pending';
      }
      tr.appendChild(td);
      table.appendChild(tr);

      tr = document.createElement('tr');
      tr.setAttribute('class', 'growatt-row');
      addCellsToRow(tr, 'Current:', mydata.deviceData.pac + ' W');

      table.appendChild(tr);

      tr = document.createElement('tr');
      tr.setAttribute('class', 'growatt-row');
      addCellsToRow(tr, 'Today:',  mydata.totalData.eToday + ' kWh');
    } else {
      let td = document.createElement('td');
      td.setAttribute('class', 'growatt-cell');
      td.innerText = 'Pending...';
      tr.appendChild(td);
    }
    table.appendChild(tr);

    return wrapper;
  },
});

