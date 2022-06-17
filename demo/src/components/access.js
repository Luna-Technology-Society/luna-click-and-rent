import React, { useState, useEffect } from 'react';
import { Redirect } from '@reach/router'
import { useRequestDevice, useGetDevices } from 'react-web-bluetooth';

const ENCRYPTION_KEY = "2ce0b20d-f4cf-40b5-9a8e-6cb0859f3dc6"; // temporary encryption
const SERVICE_UUID = "19b10000-e8f2-537e-4f6c-d104768a1214"; // UUID of the ble service used by the arduino

const getDecodedData = (encdata) => {
    let data = {};
    try {
        data = decodeURIComponent(encdata);
        data = JSON.parse(data);
    } catch (err) {
        console.log(err);
        data = {};
    }
    console.log(data);
    return data;
}

function DoorLockBLE() {
    const [chrtstc, setChrtstc] = useState();
    const [errorM, setErrorM] = useState();
    const [activeDevice, setActiveDevice] = useState(undefined);
    const [lockStatus, setLockStatus] = useState(true);
    const [lockData, setLockData] = useState({});

    useEffect(() => {
        if (typeof window !== undefined) {
            const pathname = window.location.pathname;
            const encdata = pathname.replace("/app/access/", "").replace(/\/$/, "");
            console.log(getDecodedData(encdata));
            setLockData(getDecodedData(encdata));
        }
    }, [])

    const { onClick, device } = useRequestDevice({
        acceptAllDevices: true,
        optionalServices: [SERVICE_UUID],
    });

    const devices = useGetDevices();

    useEffect(() => {
        if (device && device.name && device.name === lockData.deviceName) {
            setActiveDevice(device);
            handleConnect(device);
        }
        // else if (devices && devices.length > 0 && lockData.deviceName && !activeDevice) {
        //     for (let i = 0; i < devices.length; i++) {
        //         if (devices[i] && devices[i].name && devices[i].gatt && devices[i].name === lockData.deviceName) {
        //             console.log("Found device: ", devices[i].name, devices[i]);
        //             setActiveDevice(devices[i]);
        //             handleConnect(devices[i]);
        //         }
        //     }
        // }
        // else if (devices && devices.length > 0 && !activeDevice) {
        //     setActiveDevice(devices[0]);
        // }
    })

    const handlePair = (e) => {
        if (!activeDevice) {
            onClick(e);
        }
    }

    // This function connects the door lock to the device
    const handleConnect = (connectToDevice) => {
        console.log("Attempting to connect to device...");
        // Following the ble protocol first I connect the device creating a server
        console.log("Device: ", connectToDevice)
        connectToDevice.gatt.connect().then((server) => {
            console.log(server);
            // then find primary service with uuid "SERVICE_UUID"
            server.getPrimaryService(SERVICE_UUID).then(service => {
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
                }).catch(err => {
                    console.log(err)
                    setErrorM(err.message);
                })
            }
            ).catch(err => {
                console.log(err)
                setErrorM(err.message);

            })
        }).catch((err) => {
            console.log(err)
            setErrorM("Could not connect to lock. Make sure bluetooth is turned on, and the lock is on and in range.");
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
        switch (val) {
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
        chrtstc.writeValue(output).then(res => {
            console.log(res);
            setErrorM("");
        }).catch(err => {
            console.log(err.message);
            setErrorM("Device disconnected from bluetooth. Try connecting again.");
            handleDisconnect();
        })
    }

    return (
        <div style={container}>
            {!activeDevice && <button style={buttonStyles} onClick={handlePair}>Select device to pair</button>}
            {!chrtstc && activeDevice && <>
                <span style={labels}>Automatically connecting to device... "{activeDevice.name}"?</span>
                <button style={buttonStyles} onClick={()=>{handleConnect(activeDevice)}}>Connect device</button>
                {/* Not working yet. Will work soon. */}
                {/* <button style={{...buttonStyles, backgroundColor: "#DB3B3B"}} onClick={handleUnpair}>Unpair device</button> */}
            </>}
            {chrtstc && <>
                <span style={labels}>Your door is currently {lockStatus ? <b style={{ color: "#DB3B3B" }}>LOCKED</b> : <b style={{ color: "#1BAB1B" }}>UNLOCKED</b>}</span>
                <button style={buttonStyles} onClick={() => { switchLED(1) }}>Lock Door</button>
                <button style={buttonStyles} onClick={() => { switchLED(0) }}>Unlock door</button>
            </>}
            <br />
            <br />
            {chrtstc && <button style={{ ...buttonStyles, backgroundColor: "#DB3B3B" }} onClick={handleDisconnect}>Disonnect device</button>}
            <span style={{ ...labels, color: "#DB3B3B", textAlign: "center" }}>{errorM}</span>
        </div>
    );
}

const container = {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center"
}

const labels = {
    fontWeight: "bold",
    fontSize: 16,
    verticalAlign: "5%",
    width: "100%",
    textAlign: "center"
}

const buttonStyles = {
    // height: 36,
    // width: "100%",
    fontSize: 17,
    marginTop: 15,
    border: "none",
    backgroundColor: "#0d96a8",
    cursor: "pointer",
    color: "white",
    padding: "10px 30px"
}

export default DoorLockBLE;