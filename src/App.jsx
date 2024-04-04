import React, {useState, useMemo, useEffect} from "react";
import CanvasProvider from "./ContextProviders/CanvasProvider";
import CanvasRenderer from "./components/Canvas/CanvasRenderer";
import Header from "./components/Header";
import Toolbar from "./components/Toolbar";
import InspectPanel from "./components/InspectPanel";

function App() {
    const [userId, setUserId] = useState(null);
    const [fileId, setFileId] = useState(null);

    useMemo(() => {
        window.addEventListener('message', function (event) {
            if (event.origin !== "https://hookbook.io") {
                return;
            }
            switch (event.data.type) {
                case "user file id":
                    console.log("Event data: ", event.data, event.origin);
                    console.log("Message received from the parent: " + event.data.message);
                    setFileId(event.data.message);
                    break;
                case "current user id":
                    console.log("Current user id is: ", event.data.message);
                    setUserId(event.data.message)
                    break;
            }

        });
    }, []);





    return (
        <CanvasProvider>
            <div>
                <Header/>
                <CanvasRenderer/>
                <Toolbar/>
                <InspectPanel/>
            </div>
        </CanvasProvider>
    )
}

export default App
