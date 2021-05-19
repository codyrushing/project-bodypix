import ws from 'ws';
import { imagedataToSVG } from 'imagetracerjs';

const wss = new ws.Server({ port: 8080 });

wss.on('connection', function connection(client) {
  client.on('message', function incoming(message) {
    const now = Date.now();
    const bitmap = JSON.parse(message);
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
      data[start+3] = 255 * pixels[i];
    }

    const svg = imagedataToSVG(
      {
        data,
        width,
        height
      }
    );

    console.log(svg);


    // const traceData = imagedataToTracedata(
    //   {
    //     data,
    //     width,
    //     height
    //   }
    // );

    // console.log(traceData.layers[0][0]);
    console.log('ms elapsed', Date.now() - now);
  });
});