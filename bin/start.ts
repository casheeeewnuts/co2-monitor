import {MhZ14b} from "../lib/mh-z14b";
import {mqtt5, iot} from "aws-iot-device-sdk-v2"
import {once} from "events"

const mhz14b = new MhZ14b({
  path: "/dev/serial0",
  baudRate: 9600,
  autoOpen: false
});

;(async () => {
  const config = iot.AwsIotMqtt5ClientConfigBuilder.newWebsocketMqttBuilderWithSigv4Auth(
    process.env.ENDPOINT!,
    {
      region: "ap-northeast-1"
    }
  ).build();

  const iotClient = new mqtt5.Mqtt5Client(config);

  iotClient.on("attemptingConnect", () => console.error("attempting to connect"))
  iotClient.on("connectionSuccess", () => console.error("connection success"))

  const started = once(iotClient, "connectionSuccess");

  iotClient.start();

  await Promise.all([
    started,
    mhz14b.open()
  ])

  setInterval(async () => {
    const co2 = await mhz14b.read()

    if (co2) {
      await iotClient.publish({
        qos: mqtt5.QoS.AtLeastOnce,
        topicName: "co2-concentration",
        payload: JSON.stringify({
          concentration: {
            co2,
            at: process.env.AT ?? "home"
          }
        })
      });
      console.log(`CO2 is ${co2} ppm`);
    }
  }, 10000);
})()