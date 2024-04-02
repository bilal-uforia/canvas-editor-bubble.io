import React from "react";
import {createContext, useContext, useRef, useState} from "react"

// Creating canvas context
const CanvasContext = createContext({});

const CanvasProvider = ({children}) => {
    const canvasRef = useRef(null);
    const [canvas, setCanvas] = useState(null);
    const [activeObject, setActiveObject] = useState(null);


    return (
        <CanvasContext.Provider value={{canvasRef, canvas, setCanvas, activeObject, setActiveObject}}>
            {children}
        </CanvasContext.Provider>
    )
}

export default CanvasProvider;

// Consuming Canvas Context
export const useCanvasContext = () => {
    return useContext(CanvasContext);
}