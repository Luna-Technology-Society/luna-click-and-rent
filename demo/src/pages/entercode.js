import React, { useState } from 'react';
import { useRequestDevice } from 'react-web-bluetooth';

const UUID = "19b10000-e8f2-537e-4f6c-d104768a1214";
function EnterCode() {
    const [chrtstc, setChrtstc] = useState();

    const { onClick, device } = useRequestDevice({
        acceptAllDevices: true,
        optionalServices: [UUID]
    });

    // This function connects the door lock to the device
    const handleConnect = e => {
        console.log("Button was clicked")
        // Following the ble protocol first I connect the device creating a server
        device.gatt.connect().then((server) => {
            console.log(server);
            // then find primary service with uuid "UUID"
            server.getPrimaryService(UUID).then(service => {
                console.log(service)
                // then fetch all characteristics with the service. Only one for our door lock (check /arduino-demo/lock-program.ino)
                service.getCharacteristics().then(characteristics => {
                    try {
                        console.log(characteristics);
                        // Get the first characteristic from characteristics array and save it in the state for later use.
                        setChrtstc(characteristics[0])
                    } catch (err) {
                        console.log(err);
                    }
                }).catch(err => console.log(err))
            }
            ).catch(err => console.log(err))
        }).catch((err) => {
            console.log(err)
        })
    }

    const handleDisconnect = () => {
        try {
            // Disconnects the paired door lock and resets chrtstc in state.
            device.gatt.disconnect()
            setChrtstc(undefined);
            console.log("Device disconnected successfully");
        } catch (err) {
            console.log("Failed to disconnect device", err)
        }
        
    }

    const switchLED = (val) => {
        console.log(chrtstc);
        let output, view;
        // Create buffer required to send data through ble
        const buffer = new ArrayBuffer(16);
        switch(val){
            case 0:
                // if you want to turn the led off set output to buffer with fist value of 0
                view = new DataView(buffer);
                view.setInt32(0, 0);
                output = view;
                break;
            case 1:
                // if you want to turn the led on set output to buffer with fist value negative
                view = new DataView(buffer);
                view.setInt32(0, 30000000);
                output = view
                break;
            default:
                return;
        }
        // Sends the buffer to the connected bluetooth device
        chrtstc.writeValue(output).then(res=>{console.log(res)}).catch(err=>console.log(err))
    }

    return (<>
        {!device && <button style={buttonStyles} onClick={onClick}>Select device to pair</button>}
        {!chrtstc && device && <>
            <span style={labels}>Do you want to connect to device "{device.name}"?</span>
            <button style={buttonStyles} onClick={handleConnect}>Connect device</button>
        </>}
        {chrtstc && <>
            <span style={labels}>Control the door lock</span>
            <button style={buttonStyles} onClick={()=>{switchLED(1)}}>Lock Door</button> <button style={buttonStyles} onClick={()=>{switchLED(0)}}>Unlock door</button> 
        </>}
        <br/>
        <br/>
        {chrtstc && <button style={{...buttonStyles, backgroundColor: "#DB3B3B"}} onClick={handleDisconnect}>Disonnect device</button>}
    </>);
}


const labels = {
    fontWeight: "bold",
    fontSize: 16,
    verticalAlign: "5%",
    width: "100%",
  }
  
  const buttonStyles = {
    height: 36,
    width: "100%",
    fontSize: 17,
    marginTop: 15,
    border: "none",
    backgroundColor: "#0d96a8",
    cursor: "pointer",
    color: "white"
  }

export default EnterCode;