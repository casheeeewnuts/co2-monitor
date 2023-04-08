import EventEmitter from "events";
import {SerialPort} from "serialport";

export class MhZ14b {
  private serial: SerialPort
  constructor(options: ConstructorParameters<typeof SerialPort>[0]) {
    this.serial = new SerialPort(options)
  }

  public read(): Promise<number | null> {
    return new Promise((resolve, reject) => {
      this.serial.write([0xFF, 0x01, 0x86, 0x00, 0x00, 0x00, 0x00, 0x00, 0x79], undefined, (err) => {
        if (err) {
          reject(err)
        }

        const bytes = this.serial.read(9) as Buffer | null

        if (!bytes) {
          resolve(bytes)
          return
        }

        const [startByte, command, high, low, ...rest] = bytes;

        resolve(high * 256 + low)
      })
    })
  }

  public calibrate(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.serial.write([0xFF, 0x01, 0x87, 0x00, 0x00, 0x00, 0x00, 0x00, 0x78], (err) => {
        if (err) {
          reject(err)
        }

        resolve()
      })
    })
  }

  private checksum(packet: number[]): number {
    const [startByte, ...bytes] = packet;
    let checksum = 0;

    for (let i = 0; i < 7; i++) {
      checksum += bytes[i];
    }

    checksum = 0xFF - checksum;

    return checksum + 0x01;
  }
}