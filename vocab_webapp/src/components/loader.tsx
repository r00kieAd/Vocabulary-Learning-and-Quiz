import { useEffect, useState } from 'react'
import server_gif from '../assets/server.webm';
import { useGlobal } from '../utils/global_context';

function Loader() {
    const msg1 = "Please wait...connecting to server...";
    const msg2 = "This may take upto 90s depending on your network connectivity";
    const [mainMsg, setMainMsg] = useState<string | undefined>(msg1);
    const { loaderActive, serverConnected } = useGlobal();

    useEffect(() => {
        if (loaderActive) {
            setTimeout(() => {
                if (!serverConnected) setMainMsg(mainMsg === msg1 ? msg2 : msg1);
                if (serverConnected) setMainMsg("Connection successfull!");
            }, 5000);
        }
    }, [mainMsg])
    return (
        <>
            <div id="loaderParent">
                <div id="loaderChild">
                    <div className='loader-image-contianer loader-container'>
                        <video autoPlay loop muted playsInline width="150" height="150">
                            <source src={server_gif} type="video/webm" />
                            Loading
                        </video>
                    </div>
                    <div className='loader-image-contianer loader-container'>
                        <p className="loader-msg">{mainMsg}</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Loader