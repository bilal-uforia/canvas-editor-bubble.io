import React, {useEffect, useMemo, useState} from "react";
import CanvasProvider from "./ContextProviders/CanvasProvider";
import axios from "./Axios";


const ShowData = ({title, data}) => {
    console.log("Data is: ", data);
    return <div className="mb-3">
        <h2>{title}</h2>
         <code>{ data? JSON.stringify(data): null}</code>
    </div>
}


function App() {
    const [userId, setUserId] = useState(null);
    const [fileId, setFileId] = useState(null);
    const [fileData, setFileData] = useState(null);
    const [pageList, setPageList] = useState([]);
    const [jobsUsed, setJobsUsed] = useState([]);

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
                const A_Page_List = response?.data?.response?.a2_page_list_list_custom_scene;
                const A_Jobs_Used = response?.data?.response?.a_jobs_used_list_custom_jobs;
                const AwsUploads = response?.data?.response?.uploaded_content_list_custom_aws_urls;
                console.log("Page List is : ", A_Page_List);

                //showing A_FW Pages
                A_Page_List && A_Page_List.map(async (page_id, index) => {
                    const response = await axios.get(`/a_page(fw)/${page_id}`);
                    console.log(`Page ${index + 1} Data is: `, response?.data?.response);
                    setPageList([...pageList,response?.data?.response])
                    console.log("I-Canvas JSON is: ", response?.data?.response?.i_canvas_json_text);
                });


                //showing A_Jobs_Used
                A_Jobs_Used && A_Jobs_Used.map(async (job_id, index) => {
                    const response = await axios.get(`/job/${job_id}`);
                    pageList.push(response?.data?.response);
                    setJobsUsed([...jobsUsed,response?.data?.response]);
                });


                //showing User Aws Uploads
                AwsUploads && AwsUploads.map(async (upload_id, index) => {
                    const response = await axios.get(`/userawsuploads/${upload_id}`);
                    console.log(`Url ${index + 1} is: `, response?.data?.response?.url_to_use_text);
                });

            })();

        }
    }, [fileId])



    return (
        <CanvasProvider>
            <div>
                <ShowData title="Page (FW) List: " data={pageList}/>
                <ShowData title="Jobs used: " data={jobsUsed}/>

                {/*<Header/>*/}
                {/*<CanvasRenderer/>*/}
                {/*<Toolbar/>*/}
                {/*<InspectPanel/>*/}
            </div>
        </CanvasProvider>
    )
}

export default App
