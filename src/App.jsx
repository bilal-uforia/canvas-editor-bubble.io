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

                //showing A_FW Pages
                const pageList = [];
                A_Page_List && await new Promise((res, rej) => {
                    A_Page_List && A_Page_List.map(async (page_id, index) => {
                        const response = await axios.get(`/a_page(fw)/${page_id}`);
                        console.log(`Page ${index + 1} Data is: `, response?.data?.response);
                        pageList.push(response?.data?.response);
                        console.log("I-Canvas JSON is: ", response?.data?.response?.i_canvas_json_text);
                        A_Page_List.length - 1 == index && res(pageList)
                    });

                });
                setPageList(pageList);


                //showing A_Jobs_Used
                const jobsUsed = [];
                A_Jobs_Used &&  await new Promise((res, rej) => {
                    A_Jobs_Used && A_Jobs_Used.map(async (job_id, index) => {
                        const response = await axios.get(`/job/${job_id}`);
                        jobsUsed.push(response?.data?.response);
                        A_Jobs_Used.length - 1 == index && res(jobsUsed)
                    });
                });
                setJobsUsed(jobsUsed);
console.log("Uploads: ", AwsUploads);
                AwsUploads?.map((id)=>{
                    console.log("Aws id is: ", id);
                })

                //showing User Aws Uploads
                const uploadUrls = [];
                await new Promise((res, rej) => {
                    AwsUploads && Array.from(AwsUploads).forEach(async (upload_id, index) => {
                        const response = await axios.get(`/userawsuploads/${upload_id}`);
                        console.log(`Url ${index + 1} is: `, response?.data?.response?.url_to_use_text);
                        uploadUrls.push(response?.data?.response?.url_to_use_text);
                        AwsUploads.length - 1 == index && res(uploadUrls)
                    });
                });

                setUploadUrls(uploadUrls);


                // showing brand logos
                const logoUrls = [];
                await new Promise((res, rej) => {
                    brand?.logos_list_custom_brand_logos && brand?.logos_list_custom_brand_logos.map(async (logo_id, index) => {
                            const logoResponse = await axios.get(`/brandlogo/${logo_id}`);
                            const urlId = logoResponse.data.response?.logo_asset_custom_aws_urls;
                            if (urlId) {
                                const urlResponse = await axios.get(`/userawsuploads/${logoUrls}`);
                                logoUrls.push(urlResponse?.data?.response?.url_to_use_text);
                            }
                            brand?.logos_list_custom_brand_logos.length - 1 == index && res(logoUrls);
                        }
                    );
                });

                setBrandLogos(logoUrls);


                // showing brand logos
                const mediaUrls = [];
                await new Promise((res, rej) => {
                    brand?.media_list_custom_creative_data && brand?.media_list_custom_creative_data.map(async (creative_id, index) => {
                            const creativeResponse = await axios.get(`/creativedata/${creative_id}`);
                            const url = creativeResponse.data.response?.aws_url_text;
                            mediaUrls.push(url);
                            brand?.media_list_custom_creative_data.length - 1 == index && res(mediaUrls);
                        }
                    );
                });

                setMediaUrls(mediaUrls);

                //Getting workspace

                //Getting Job


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

                {/*<Header/>*/}
                {/*<CanvasRenderer/>*/}
                {/*<Toolbar/>*/}
                {/*<InspectPanel/>*/}
            </div>
        </CanvasProvider>
    )
}

export default App
