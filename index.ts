import {SerialPort} from "serialport";

const READ_CO2 = [0xFF, 0x01, 0x86, 0x00, 0x00, 0x00, 0x00, 0x00];

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

sp.write([...READ_CO2, getCheckSum(READ_CO2)])

function getCheckSum(packet: number[]): number {
  const [startByte, ...bytes] = packet;
  let checksum = 0;

  for (let i = 0; i < 7; i++) {
    checksum += bytes[i];
  }

  checksum = 0xFF - checksum;

  return checksum + 0x01;
}