import React, { useState, useEffect } from 'react';
import { useRequestDevice, useGetDevices, use } from 'react-web-bluetooth';

const UUID = "19b10000-e8f2-537e-4f6c-d104768a1214";
function EnterCode() {
    const [chrtstc, setChrtstc] = useState();
    const [errorM, setErrorM] = useState();
    const [activeDevice, setActiveDevice] = useState(undefined);
    const [lockStatus, setLockStatus] = useState(true)

    const { onClick, device } = useRequestDevice({
        acceptAllDevices: true,
        optionalServices: [UUID]
    });

    const devices = useGetDevices();

    useEffect(() => {

        if (device) {
            setActiveDevice(device);
        }
        else if (devices && devices.length > 0 && !activeDevice) {
            setActiveDevice(devices[0]);
        }
    })

    const handlePair = (e) => {
        if (!activeDevice) {
            onClick(e);
        }
    }

    const handleUnpair = e => {
        setActiveDevice(undefined);
    }

    // This function connects the door lock to the device
    const handleConnect = e => {
        console.log("Button was clicked")
        // Following the ble protocol first I connect the device creating a server
        activeDevice.gatt.connect().then((server) => {
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
                        setErrorM("");
                    } catch (err) {
                        console.log(err);
                        setErrorM("Paired with incorrect door. Please pair with correct door.");
                    }
                }).catch(err => console.log(err))
            }
            ).catch(err => console.log(err))
        }).catch((err) => {
            console.log(err)
            setErrorM("Could not connect to device. Make sure bluetooth is turned on.");
        })
    }

    const handleDisconnect = () => {
        try {
            // Disconnects the paired door lock and resets chrtstc in state.
            activeDevice.gatt.disconnect()
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
                setLockStatus(false);
                break;
            case 1:
                // if you want to turn the led on set output to buffer with fist value is not 0
                view = new DataView(buffer);
                view.setInt32(0, 30000000);
                output = view
                setLockStatus(true);
                break;
            default:
                return;
        }
        // Sends the buffer to the connected bluetooth device
        chrtstc.writeValue(output).then(res=>{
            console.log(res);
            setErrorM("");
        }).catch(err=>{
            console.log(err.message);
            setErrorM("Device disconnected from bluetooth. Try connecting again.");
            handleDisconnect();
        })
    }

    return (<>
        {!activeDevice && <button style={buttonStyles} onClick={handlePair}>Select device to pair</button>}
        {!chrtstc && activeDevice && <>
            <span style={labels}>Do you want to connect to device "{activeDevice.name}"?</span>
            <button style={buttonStyles} onClick={handleConnect}>Connect device</button>
            {/* Not working yet. Will work soon. */}
            {/* <button style={{...buttonStyles, backgroundColor: "#DB3B3B"}} onClick={handleUnpair}>Unpair device</button> */}
        </>}
        {chrtstc && <>
            <span style={labels}>Your door is currently {lockStatus ? <b style={{color: "#DB3B3B"}}>LOCKED</b> : <b style={{color: "#1BAB1B"}}>UNLOCKED</b>}</span>
            <button style={buttonStyles} onClick={()=>{switchLED(1)}}>Lock Door</button>
            <button style={buttonStyles} onClick={()=>{switchLED(0)}}>Unlock door</button> 
        </>}
        <br/>
        <br/>
        {chrtstc && <button style={{...buttonStyles, backgroundColor: "#DB3B3B"}} onClick={handleDisconnect}>Disonnect device</button>}
        <span style={{...labels, color: "#DB3B3B", textAlign: "center"}}>{errorM}</span>
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