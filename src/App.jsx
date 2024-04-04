import React, {useEffect, useMemo, useState} from "react";
import CanvasProvider from "./ContextProviders/CanvasProvider";
import CanvasRenderer from "./components/Canvas/CanvasRenderer";
import Header from "./components/Header";
import Toolbar from "./components/Toolbar";
import InspectPanel from "./components/InspectPanel";
import axios from "./Axios";

function App() {
    const [userId, setUserId] = useState(null);
    const [fileId, setFileId] = useState(null);
    const [fileData, setFileData] = useState(null);

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


    useEffect(() => {
        if (fileId) {
            (async () => {
                const response = await axios.get(`/a_contentasset/${fileId}`);
                console.log("File Data is: ", response?.data?.response);
                setFileData(response?.data?.response);
                const A_Page_List = response?.data?.response?.a2_page_list_list_custom_scene
                console.log("Page List is : ", A_Page_List);

                //showing A_FW Pages
                A_Page_List.map(async(page_id,index)=>{
                    const response = await axios.get(`/a_page(fw)/${page_id}`);
                    console.log(`Page ${index+1} Data is: `, response?.data?.response);
                    console.log("I-Canvas JSON is: ", response?.data?.response?.i_canvas_json_text);
                });

            })();

        }
    }, [fileId])


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
