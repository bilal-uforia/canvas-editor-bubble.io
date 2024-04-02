import React, {useEffect} from 'react'
import {fabric} from 'fabric';
import {useCanvasContext} from "../../ContextProviders/CanvasProvider";

const CanvasRenderer = () => {

    const {canvasRef, canvas, setCanvas, activeObject, setActiveObject} = useCanvasContext();
    console.log(canvas);


    // creating fabric canvas
    const initCanvas = () => {
        setCanvas(
            new fabric.Canvas(canvasRef.current, {
                selectionColor: 'blue',
                width: 800,
                height: 600,
                preserveObjectStacking: true,
                backgroundColor: "white"
            })
        )
    };


    useEffect(() => {
        initCanvas();
    }, [])


    useEffect(() => {

        if (canvas) {

            window.canvas = canvas;

            // canvas.on('selection:created', function (options) {
            //     setActiveObject(options?.selected[0]);
            // });
            //
            // canvas.on('selection:updated', function (options) {
            //     setActiveObject(options?.selected[0]);
            // });
            //
            //
            // canvas.on('selection:cleared', function (options) {
            //
            //     setActiveObject(null);
            //
            // });


        }

    }, [canvas]);


    return (
        <canvas id="c" ref={canvasRef} className='rounded-12px  !w-[80%]' />
    )
}

export default CanvasRenderer