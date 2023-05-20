import {MhZ14b} from "../lib/mh-z14b";

const mhz14b = new MhZ14b({
  path: "/dev/serial0",
  baudRate: 9600,
  autoOpen: false
})

;(async () => {
  await mhz14b.open();

  await mhz14b.calibrate();

  await mhz14b.close();
})()