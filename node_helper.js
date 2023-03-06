const NodeHelper = require('node_helper');
const api = require('growatt');

const getJSONCircularReplacer = () => {
  const seen = new WeakMap();
  return (key, val) => {
    const value = val;
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return `loop on ${seen.get(value)}`;
      }
      seen.set(value, key);
    }
    return value;
  };
};

module.exports = NodeHelper.create({

  start: function() {
    console.log("Starting node helper: " + this.name);
  },

  socketNotificationReceived: async function(notification, payload) {
    let self = this;
    const options = { weather: false, historyLast: false };

    if (notification === "GROWATT_GET_DATA") {
      console.log(self.name + ': GROWATT_GET_DATA');

      const growatt = new api({});
      let data = [];
      let login = await growatt.login(payload.config.user, payload.config.password).catch(e => {console.log(e)});
      let getAllPlantData = await growatt.getAllPlantData(options).catch(e => {console.log(e)});
      if (getAllPlantData) {
        const keys = Object.keys(getAllPlantData);
        keys.forEach(key => {
          let { devices, ...rest } = getAllPlantData[key];
          const serialNumbers = Object.keys(devices);
          let devicesData = [];
          serialNumbers.forEach(sn => {
            devicesData.push({
              sn: sn,
              data: devices[sn],
            });
          });
          data.push({
            plantid: key,
            data: { ...rest, devicesData }
          })
        });
        
//        console.log(this.name + " GOT DATA", JSON.stringify(self, getJSONCircularReplacer(), 2));
        console.log('Publishing GROWATT data');
        self.sendSocketNotification("GROWATT_GOT_DATA", JSON.stringify(data));
        await growatt.logout().catch(e => {console.log(e)});
      }
    }
  }
});
