import {SerialPort} from "serialport";

const sp = new SerialPort({
  path: "/dev/serial0",
  baudRate: 9600
})

sp.on("close", (err: Error) => {
  console.error(err)

  process.exit(1)
})

sp.on("data", (data: Buffer) => {
  console.log(data)
})

sp.write([0xFF, 0x01, 0x86, 0x00, 0x00, 0x00, 0x00, 0x00])