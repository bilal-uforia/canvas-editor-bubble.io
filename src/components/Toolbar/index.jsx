import React from "react";

const Toolbar = () => {
    return <div className="min-h-[634px] absolute left-3 top-[15%]">
        <div className="w-[68px] bg-[#fff] rounded-[12px] border-[#e0e0e0] flex flex-col items-center min-h-[500px] p-1">
            <div className="flex flex-col items-center gap-2 hover:bg-[#ECEFFD] w-full rounded-[12px] cursor-pointer">
                <svg role="img" className="icon icon-mono icon-image w-5 h-5 text-current">
                    <use xlink:href="https://app-dev.glorify.com/assets/designer/static/media/icons-mono.svg?v=321#icon-image"></use>
                </svg>
                <p>Images</p>
            </div>
        </div>
    </div>
}


export default Toolbar;