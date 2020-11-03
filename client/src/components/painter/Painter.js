import React, {useState, useEffect, useRef} from 'react';
import './Painter.css';

const Painter = () => {

    const [Eraser_flag, setEraser_flag] = useState(false);
    
    const myCanvasRef = useRef();

    useEffect(() => {
        // preventing to scroll during drawing in mobile.
        myCanvasRef.current.addEventListener("touchstart", function (e) {
            if (e.target === myCanvasRef.current) {
            e.preventDefault();
            }
        }, false);
        myCanvasRef.current.addEventListener("touchend", function (e) {
            if (e.target === myCanvasRef.current) {
            e.preventDefault();
            }
        }, false);
        myCanvasRef.current.addEventListener("touchmove", function (e) {
            if (e.target === myCanvasRef.current) {
            e.preventDefault();
            }
        }, false);
        
    }, [])

    useEffect(() => {
        const myCanvas = myCanvasRef.current;
        const myCtx = myCanvas.getContext('2d');
        if(Eraser_flag === false) {
            myCtx.fillStyle = 'black';
            myCtx.strokeStyle = 'black';
            myCtx.lineWidth = 15;
        } else {
            myCtx.fillStyle = 'white';
            myCtx.strokeStyle = 'white';
            myCtx.lineWidth = 15;
        }
        
        const rectWidth = 3;
        myCtx.lineJoin = 'round';
        myCtx.lineCap = 'round';

        let prevX = 0;
        let prevY = 0;
        let currX = 0;
        let currY = 0;
        let forXCorrection = myCanvas.getBoundingClientRect().left;
        let forYCorrection = myCanvas.getBoundingClientRect().top;

        let path_flag = false;
        const drawing = (type, e) => {
            prevX = currX;
            prevY = currY;
            currX = e.clientX - forXCorrection;
            currY = e.clientY- forYCorrection;

            if (type === 'down') {
                path_flag = true;
                myCtx.fillRect(currX, currY, rectWidth, rectWidth);
            } else  if (type === 'move' && path_flag) {
                myCtx.beginPath();
                myCtx.moveTo(prevX, prevY);
                myCtx.lineTo(currX, currY);
                myCtx.stroke();
                myCtx.closePath();
            } else if (type === 'up' || type === 'out') {
                path_flag = false;
            }
        }

        // event listeners
        const mousedownListener = (e) => {
            drawing('down', e);
        }

        const mousemoveListener = (e) => {
            drawing('move', e);
        }

        const mouseupListener = (e) => {
            drawing('up', e);
        }

        const mouseoutListener = (e) => {
            drawing('out', e);
        }

        const touchstartListener = (e) => {
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent("mousedown", {
            clientX: touch.clientX,
            clientY: touch.clientY
            });
            myCanvas.dispatchEvent(mouseEvent);
        }
        const touchendListener = (e) => {
            const mouseEvent = new MouseEvent("mouseup", {});
            myCanvas.dispatchEvent(mouseEvent);
        }
        const touchmoveListener = (e) => {
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent("mousemove", {
            clientX: touch.clientX,
            clientY: touch.clientY
            });
            myCanvas.dispatchEvent(mouseEvent);
        }

        const resizeAndScrollListener = () => {
            forXCorrection = myCanvas.getBoundingClientRect().left;
            forYCorrection = myCanvas.getBoundingClientRect().top;
        };

        myCanvas.addEventListener('mousedown', mousedownListener);
        myCanvas.addEventListener('mousemove', mousemoveListener);
        myCanvas.addEventListener('mouseup', mouseupListener);
        myCanvas.addEventListener('mouseout', mouseoutListener);

        myCanvas.addEventListener("touchstart", touchstartListener);
        myCanvas.addEventListener("touchend", touchendListener);
        myCanvas.addEventListener("touchmove", touchmoveListener);

        window.addEventListener('resize', resizeAndScrollListener);
        window.addEventListener('scroll', resizeAndScrollListener);

        return () => {
            myCanvas.removeEventListener('mousedown', mousedownListener);
            myCanvas.removeEventListener('mousemove', mousemoveListener);
            myCanvas.removeEventListener('mouseup', mouseupListener);
            myCanvas.removeEventListener('mouseout', mouseoutListener);

            myCanvas.removeEventListener("touchstart", touchstartListener);
            myCanvas.removeEventListener("touchend", touchendListener);
            myCanvas.removeEventListener("touchmove", touchmoveListener);

            window.addEventListener('resize', resizeAndScrollListener);
            window.addEventListener('scroll', resizeAndScrollListener);
        }
    }, [Eraser_flag])

    return (
        <div className="painter-wrapper">
        <canvas ref={myCanvasRef} id="myCanvas" width="550px" height="250px">Error</canvas>
        <button type="button" onClick={() => {
            myCanvasRef.current.getContext('2d').clearRect(0,0,myCanvasRef.current.width,myCanvasRef.current.height);
        }}>Reset</button>
        <button type="button" onClick={() => {
            Eraser_flag ? setEraser_flag(false) : setEraser_flag(true);
        }}>{Eraser_flag ? 'Pen' : 'Eraser'}</button>
        </div>
    );
}

export default Painter;
