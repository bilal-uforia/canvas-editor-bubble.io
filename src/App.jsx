import React from "react";
import CanvasProvider from "./ContextProviders/CanvasProvider";
import CanvasRenderer from "./components/Canvas/CanvasRenderer";
import Header from "./components/Header";
import Toolbar from "./components/Toolbar";
import InspectPanel from "./components/InspectPanel";

function App() {

    return (
        <CanvasProvider>
            <div>
                <Header/>
                <CanvasRenderer />
                <Toolbar/>
                <InspectPanel />
            </div>
        </CanvasProvider>
    )
}

export default App
