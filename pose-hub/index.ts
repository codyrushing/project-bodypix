import cluster from 'cluster';
import ws from 'ws';
import { imagedataToSVG } from 'imagetracerjs';
import os = require('os');
const numCPUs = os.cpus().length;

if(cluster.isMaster){
  // MASTER
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on('exit', function(worker, code, signal){
    console.log(`Worker : [ ${worker.process.pid} ][ Status : Exit ][ Signal : ${signal} ][ Code : ${code} ]`);
    cluster.fork();
  })
}
else {
  // WORKER
  const wss = new ws.Server({ port: 8080 });

  wss.on('connection', function connection(client) {
    client.on('message', function incoming(message) {
      const now = Date.now();
      const {
        heatmap: bitmap,
        poses
      } = JSON.parse(message);
      console.log(poses);
      const width = bitmap[0].length;
      const height = bitmap.length;
      // flatten bitmap into single array of floats 0...255
      const pixels = bitmap.reduce(
        (acc, v) => {
          acc = acc.concat(v);
          return acc;
        },
        []
      );
      
      const data = new Uint8ClampedArray(pixels.length * 4);
  
      for(let i=0; i<pixels.length; i++){
        let start = i * 4;
        data[start] = 0;
        data[start+1] = 0;
        data[start+2] = 0;
        data[start+3] = pixels[i] 
          ? 255
          : 0;
      }
  
      const svg = imagedataToSVG(
        {
          data,
          width,
          height
        }
      );
  
      svg.toString();

      // const traceData = imagedataToTracedata(
      //   {
      //     data,
      //     width,
      //     height
      //   }
      // );

      // for(let layer of traceData.layers){
      //   console.log('start segments');
      //   for(let path of layer){
      //     console.log(path.segments);
      //   }
      // }

      console.log('ms elapsed', Date.now() - now);
    });
  });  
  // worker
}
