import React, { useState, useEffect } from 'react';
import { useGetDevices, useGetCharacteristic, useGetPrimaryService, useGetServer, useReadValue, useRequestDevice, writeValue } from 'react-web-bluetooth';
import { v4 as uuidv4 } from 'uuid';

const UUID = "19b10000-e8f2-537e-4f6c-d104768a1214";
function EnterCode() {
    const [inputVal, setInputVal] = useState("");
    const [chrtstc, setChrtstc] = useState();

    // const {myDevices} = useGetDevices();
    const { onClick, device } = useRequestDevice({
        acceptAllDevices: true,
        optionalServices: [UUID]
    });

    // const service = useGetPrimaryService({device: device})
    // const characteristic = useGetCharacteristic({service, bluetoothCharacteristicUUID: "19b10000-e8f2-537e-4f6c-d104768a1214"}, ()=> {
    //     console.log("this is a promise")
    // });



    const handleChange = (e) => {
        setInputVal(e.target.value);
    }
    const handleKeyDown = (e) => {
        if (e.keyCode === 13) {
            handleClick();
        }
    }
    const handleClick = e => {
        console.log("Button was clicked")
        console.log(inputVal)
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
            console.log("Device disconnected successfully");
        } catch (err) {
            console.log("Failed to disconnect device")
        }
        
    }

    const switchLED = (val) => {
        console.log(chrtstc);
        console.log(val);
        let output, view;
        const buffer = new ArrayBuffer(16);
        switch(val){
            case "0":
                view = new DataView(buffer);
                view.setInt32(0, 0);
                output = view;
                console.log("Case is 0")
                break;
            case "1":
                console.log("Case is 1")
                view = new DataView(buffer);
                view.setInt32(0, 30000000);
                output = view
                break;
            default:
                return;
        }
        chrtstc.writeValue(output).then(res=>{console.log(res)}).catch(err=>console.log(err))
    }

    return (<>
        {!device && <button onClick={onClick}>Select device to pair</button>}
        {device && <>
            <span>Do you want to connect to device "{device.name}"?</span>
            <button onClick={handleClick}>Connect device</button>
        </>}
        {/* <ul>
            {myDevices && myDevices.map((device)=>(<li>{device}</li>))}
        </ul> */}
        {chrtstc && <>
            <span>Enter code:</span>
            <input value={inputVal} onChange={handleChange} name="code" placeholder="0 or 1" onKeyDown={handleKeyDown} />
            <button onClick={()=>{switchLED(inputVal)}}>Send value</button>
        </>}
        <br/>
        <br/>
        <button onClick={handleDisconnect}>Disonnect device</button>
    </>);
}

export default EnterCode;