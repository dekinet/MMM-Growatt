function addCellsToRow(tr, firstText, secondText, thirdText, fourthText) {
  let td = document.createElement('td');
  td.setAttribute('class', 'growatt-cell');
  td.innerText = firstText;
  tr.appendChild(td);

  td = document.createElement('td');
  td.setAttribute('class', 'growatt-cell');
  td.innerText = secondText;
  tr.appendChild(td);

  td = document.createElement('td');
  td.setAttribute('class', 'growatt-cell');
  td.innerText = thirdText;
  tr.appendChild(td);

  td = document.createElement('td');
  td.setAttribute('class', 'growatt-cell');
  td.innerText = fourthText;
  tr.appendChild(td);
}

Module.register("MMM-Growatt", {
  // Default configs
  defaults: {
    intervalSecs: 300,
    plantName: false,
    lastUpdated: true,
    currentPower: true,
    dayTotalGenerated: true,
    monthTotalGenerated: false,
    totalGenerated: false,
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
    wrapper.innerText = 'PV-Anlage';
    let table = document.createElement('table');
    table.setAttribute('class', 'growatt-table');
    wrapper.appendChild(table);

    let tr = document.createElement('tr');
    tr.setAttribute('class', 'growatt-row');

    if (this.result) {
      const mydata = this.result.payload[0].data.devicesData[0].data;

      let td;

      if (this.config.plantName) {
        tr = document.createElement('tr');
        tr.setAttribute('class', 'growatt-row');
        addCellsToRow(tr, 'Plant:', mydata.deviceData.plantName);
        table.appendChild(tr);
      }

      if (this.config.lastUpdated) {
        tr = document.createElement('tr');
        td = document.createElement('td');
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
      }

      if (this.config.currentPower) {
        tr = document.createElement('tr');
        tr.setAttribute('class', 'growatt-row');
        addCellsToRow(tr, 'Aktuell', Math.round(mydata.deviceData.pac/100)/10 + ' kW');
        table.appendChild(tr);
      }

      if (this.config.dayTotalGenerated) {
        tr = document.createElement('tr');
        tr.setAttribute('class', 'growatt-row');
        addCellsToRow(tr, 'Heute', Math.round(mydata.deviceData.eToday), Math.round(mydata.totalData.etoGridToday),Math.round((mydata.deviceData.eToday - mydata.totalData.etoGridToday)*0.3318 + mydata.totalData.etoGridToday*0.086) + '€');
        table.appendChild(tr);
      }

      if (this.config.monthTotalGenerated) {
        tr = document.createElement('tr');
        tr.setAttribute('class', 'growatt-row');
        addCellsToRow(tr, 'Monat ', Math.round(mydata.deviceData.eMonth),'',''/*Math.round( mydata.deviceData.eMonth*0.33) + '€'*/);
        table.appendChild(tr);
      }

      if (this.config.totalGenerated) {
        tr = document.createElement('tr');
        tr.setAttribute('class', 'growatt-row');
        addCellsToRow(tr, 'Gesamt ', Math.round(mydata.deviceData.eTotal), Math.round(mydata.totalData.etogridTotal), Math.round((mydata.deviceData.eTotal - mydata.totalData.etogridTotal)*0.3318 + mydata.totalData.etogridTotal*0.086) + '€');
        table.appendChild(tr);

   	let table2 = document.createElement('table2');
    	table2.setAttribute('class', 'graphic-table');
    	wrapper.appendChild(table2);

    	tr = document.createElement ('tr');
	tr.setAttribute('class', 'graphic-row1');

	let td = document.createElement('td');
        td.setAttribute('class', 'graphic1');
        td.innerText = '\n'
        tr.appendChild(td);

        td = document.createElement('td');
        td.setAttribute('class', 'graphic2');
        td.innerText = '\n'
        tr.appendChild(td);

        td = document.createElement('td');
        td.setAttribute('class', 'graphic3');
        td.innerText = '\n'
        tr.appendChild(td);

        td = document.createElement('td');
        td.setAttribute('class', 'graphic4');
        td.innerText = mydata.statusData.pLocalLoad + '\n';
        let IconWrapper = document.createElement('i');
        IconWrapper.className = 'fa fa-long-arrow-right';
        td.appendChild(IconWrapper);
        tr.appendChild(td);

        td = document.createElement('td');
        td.setAttribute('class', 'graphic5');
        td.innerText = ''
	IconWrapper = document.createElement('i');
        IconWrapper.className = 'fa fa-plug';
        td.appendChild(IconWrapper);
        tr.appendChild(td);

	table2.appendChild(tr);

	tr = document.createElement ('tr');
        tr.setAttribute('class', 'graphic-row2');

	td = document.createElement('td');
        td.setAttribute('class', 'graphic1');
        td.innerText = ''
        IconWrapper = document.createElement('i');
        IconWrapper.className = 'fa fa-sun-o';
        td.appendChild(IconWrapper);
        tr.appendChild(td);

        td = document.createElement('td');
        td.setAttribute('class', 'graphic2');
      	td.innerText = mydata.statusData.ppv + '\n';
 	IconWrapper = document.createElement('i');
        IconWrapper.className = 'fa fa-long-arrow-right';
        td.appendChild(IconWrapper);
        tr.appendChild(td);

        td = document.createElement('td');
        td.setAttribute('class', 'graphic3');
        td.innerText = ''
 	IconWrapper = document.createElement('i');
        IconWrapper.className = 'fa fa-home';
        td.appendChild(IconWrapper);
        tr.appendChild(td);

        td = document.createElement('td');
        td.setAttribute('class', 'graphic4');
	if (mydata.statusData.pdisCharge1 > 0)	{
	        td.innerText = mydata.statusData.pdisCharge1 + '\n';
	        IconWrapper = document.createElement('i');
	        IconWrapper.className = 'fa fa-long-arrow-left';
		}
	else 	{

		td.innerText = mydata.statusData.chargePower + '\n';
                IconWrapper = document.createElement('i');
                IconWrapper.className = 'fa fa-long-arrow-right';
		}
        td.appendChild(IconWrapper);
        tr.appendChild(td);

        td = document.createElement('td');
        td.setAttribute('class', 'graphic4');
        td.innerText = mydata.statusData.SOC + '% \n'
        IconWrapper = document.createElement('i');
        IconWrapper.className = 'fa fa-battery-three-quarters';
        td.appendChild(IconWrapper);
        tr.appendChild(td);

        table2.appendChild(tr);

	tr = document.createElement ('tr');
        tr.setAttribute('class', 'graphic-row3');

	td = document.createElement('td');
        td.setAttribute('class', 'graphic5');
        td.innerText = '';
        IconWrapper = document.createElement('i');
        IconWrapper.className = 'fa fa-industry';
        td.appendChild(IconWrapper);
        tr.appendChild(td);

        td = document.createElement('td');
        td.setAttribute('class', 'graphic4');
        if (mydata.statusData.pactouser > 0) {
                td.innerText = mydata.statusData.pactouser + '\n'
                IconWrapper = document.createElement('i');
                IconWrapper.className = 'fa fa-long-arrow-right';
                }
        else    {
                td.innerText = mydata.statusData.pactogrid + '\n'
                IconWrapper = document.createElement('i');
                IconWrapper.className = 'fa fa-long-arrow-left';
                }
        td.appendChild(IconWrapper);
        tr.appendChild(td);

        td = document.createElement('td');
        td.setAttribute('class', 'graphic3');
        td.innerText = '\n';
        tr.appendChild(td);

// HEY YOU HAVE TO PUT IN CAR CHARGE VALUES DOWN BELOW

        td = document.createElement('td');
        td.setAttribute('class', 'graphic4');
        td.innerText =/* mydata.statusData.pLocalLoad + */ '0 \n';
        IconWrapper = document.createElement('i');
        IconWrapper.className = 'fa fa-long-arrow-right';
        td.appendChild(IconWrapper);
        tr.appendChild(td);

        td = document.createElement('td');
        td.setAttribute('class', 'graphic5');
        td.innerText = '';
        IconWrapper = document.createElement('i');
        IconWrapper.className = 'fa fa-car';
        td.appendChild(IconWrapper);
        tr.appendChild(td);

        table2.appendChild(tr);


	}
    } else {
      let td = document.createElement('td');
      td.setAttribute('class', 'growatt-cell');
      td.innerText = 'Daten werden geladen';
      tr.appendChild(td);
      table.appendChild(tr);
   }


    return wrapper;
  },
});

