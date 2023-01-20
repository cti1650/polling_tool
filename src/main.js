const net = require('net');
const dgram = require('dgram');
const { polling_list } = require('./config');

polling_list.forEach(async item => {
  const mode = item.mode.toLocaleUpperCase();
  const address = item?.address;
  const port = item?.port ? Number(item?.port) : 0;
  if(!address || !port) {
    console.log(address + ":設定が有効ではありませんでした");
    return;
  }
  await (new Promise((resolve, reject) => {
    if(mode === 'TCP') {
      let client = new net.Socket();
      
      client.connect(port, address, function() {
          console.log("✅", `${mode} ${address}[${port}]`);
          resolve(true);
          client.destroy();
      });
      client.on('error', function(err) {
          console.log("❌", `${mode} ${address}[${port}]`);
          resolve(false);
      });
    }else if(mode === 'UDP'){
      let client = dgram.createSocket('udp4');
      client.on('error', (err) => {
          console.log("❌", `${mode} ${address}[${port}]`);
          resolve(false);
          client.close();
      });
      client.on('listening', () => {
          console.log("✅", `${mode} ${address}[${port}]`);
          resolve(true);
          client.close();
      });
      client.bind(port, address);
    }else{
      resolve(false);
    }
  }))
});