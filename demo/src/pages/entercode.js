import React, { useState } from 'react';
import { useRequestDevice } from 'react-web-bluetooth';

const UUID = "19b10000-e8f2-537e-4f6c-d104768a1214";
function EnterCode() {
    const [chrtstc, setChrtstc] = useState();
    // const [deviceFound, setIsConnected] = useState(false);

    // const {myDevices} = useGetDevices();
    const { onClick, device } = useRequestDevice({
        acceptAllDevices: true,
        optionalServices: [UUID]
    });

    // const handlePairDevice = () => {
    //     onClick();
    // }
    const handleConnect = e => {
        console.log("Button was clicked")
        device.gatt.connect().then((res) => {
            console.log(res);
            res.getPrimaryService(UUID).then(res => {
                console.log(res)
                res.getCharacteristics().then(res => {
                    try {
                        console.log(res);
                        setChrtstc(res[0])
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