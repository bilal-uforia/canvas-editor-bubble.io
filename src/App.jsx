import React, {useEffect, useMemo, useState} from "react";
import CanvasProvider from "./ContextProviders/CanvasProvider";
import axios from "./Axios";


const ShowData = ({title, data}) => {
    console.log("Data is: ", data);
    console.log(JSON.stringify(data));
    return <div className="mb-3">
        <h2>{title}</h2>
        <code>{data ? JSON.stringify(data, null, 2) : "Null"}</code>
    </div>
}


function App() {
    const [userId, setUserId] = useState(null);
    const [fileId, setFileId] = useState(null);
    const [fileData, setFileData] = useState(null);
    const [pageList, setPageList] = useState([]);
    const [jobsUsed, setJobsUsed] = useState([]);
    const [uploadUrls, setUploadUrls] = useState([]);
    const [brand, setBrand] = useState(null);
    const [brandLogos, setBrandLogos] = useState([]);
    const [mediaUrls, setMediaUrls] = useState([]);
    const [job, setJob] = useState(null);


    const fetchDataFromEndpoints = async (ids, endpoint) => {
        const promises = ids.map(async (id) => {
            const response = await axios.get(`${endpoint}/${id}`);
            return response.data.response;
        });
        return Promise.all(promises);
    };


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
                console.log("AwsUploads: ", AwsUploads);
                const brand = response?.data?.response?.i_brand_custom_brands;
                console.log("Brand is: ", brand);
                setBrand(brand);
                console.log("Page List is : ", A_Page_List);
                const A_JobInfo = response?.data?.response?.a_job_info_custom_jobs;
                setJob(A_JobInfo);
                console.log("Job is: ", A_JobInfo);


                //showing A_FW Pages
                const pageList = [];
                if (A_Page_List?.length > 0) {
                    const pageResponses = await fetchDataFromEndpoints(A_Page_List, '/a_page(fw)');
                    pageList.push(...pageResponses);
                }
                setPageList(pageList);


                //showing A_Jobs_Used
                const jobsUsed = [];
                if (A_Jobs_Used?.length > 0) {
                    const jobResponses = await fetchDataFromEndpoints(A_Jobs_Used, '/job');
                    jobsUsed.push(...jobResponses);
                }
                setJobsUsed(jobsUsed);

                //showing User Aws Uploads
                const uploadUrls = [];
                if (AwsUploads?.length > 0) {
                    const uploadResponses = await fetchDataFromEndpoints(AwsUploads, '/userawsuploads');
                    uploadUrls.push(...uploadResponses.map(response => response.url_to_use_text));
                }
                setUploadUrls(uploadUrls);

                // showing brand logos
                const logoUrls = [];
                if (brand?.logos_list_custom_brand_logos?.length > 0) {
                    const logoResponses = await fetchDataFromEndpoints(brand.logos_list_custom_brand_logos, '/brandlogo');
                    if (logoResponses?.length > 0) {
                        const logoAssetIds = logoResponses.map(response => response.logo_asset_custom_aws_urls);
                        const urlResponses = await fetchDataFromEndpoints(logoAssetIds, '/userawsuploads');
                        logoUrls.push(...urlResponses.map(response => response.url_to_use_text));
                    }
                }
                setBrandLogos(logoUrls);


                // showing brand logos
                const mediaUrls = [];
                if (brand?.media_list_custom_creative_data?.length > 0) {
                    const mediaResponses = await fetchDataFromEndpoints(brand.media_list_custom_creative_data, '/creativedata');
                    mediaUrls.push(...mediaResponses.map(response => response.aws_url_text));

                }
                setMediaUrls(mediaUrls);

                //Getting workspace

                //Getting Job A_Object FWS List


            })();

        }
    }, [fileId])


    return (
        <CanvasProvider>
            <div>
                <ShowData title="Page (FW) List | A_Page (FW) | I-Canvas JSON" data={pageList}/>
                <ShowData title="Jobs used: " data={jobsUsed}/>
                <ShowData title="User AWS Uploads: " data={uploadUrls}/>
                <ShowData title="Brand is: " data={brand}/>
                <ShowData title="Brand logos  are: " data={brandLogos}/>
                <ShowData title="Creative Data is : " data={mediaUrls}/>
                <ShowData title="job is : " data={job}/>

                {/*<Header/>*/}
                {/*<CanvasRenderer/>*/}
                {/*<Toolbar/>*/}
                {/*<InspectPanel/>*/}
            </div>
        </CanvasProvider>
    )
}

export default App
