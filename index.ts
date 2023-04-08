import {SerialPort} from "serialport";
import {MhZ14b} from "./mh-z14b";

const mhz14b = new MhZ14b({
  path: "/dev/serial0",
  baudRate: 9600
})

setInterval(async () => {
  const co2 = await mhz14b.read()
  if (co2) {
    console.log(`CO2 is ${co2} ppm`)
  }
}, 5000)