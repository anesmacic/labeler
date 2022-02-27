import { Fragment, useEffect, useRef, useState } from "react"
import { ImageI, ImagesI } from "./LabelViewer"
import '../App.css'
import { LabelTypes } from "../App"
import Slider from './Slider';

interface MainVeiwArgs {
    image: ImageI,
    focus: number,
    callback: Function
}

interface MousePosition {
    x: number,
    y: number
}

interface CanvasDimensions {
    width: number,
    height: number,
    scale: number
}

function MainView(ImageContainer: MainVeiwArgs) {

    const canvasRefTemp = useRef(null)
    const canvasRef = useRef(null)
    const [useCursor, setUseCursor] = useState<boolean>(true)
    const [doPolygon, setdoPolygon] = useState<boolean>(false)
    const [doPoint, setdoPoint] = useState<boolean>(false)
    const [doLine, setdoLine] = useState<boolean>(false)
    const [tempPolygonLabel, settempPolygonLabel] = useState<any>([])
    const [tempLineLabel, settempLineLabel] = useState<any>([])
    const [brightnessValue, setBrigthnessValue] = useState<number>(100)
    const [brightnessSliderVisible, setBrightnessSliderVisible] = useState<boolean>(false)
    const resetBrightness = () => (setBrigthnessValue(100))
    const [contrastValue, setContrastValue] = useState<number>(100)
    const [contrastSliderVisible, setContrastSliderVisible] = useState<boolean>(false)
    const resetContrast = () => (setContrastValue(100))
    const [invertValue, setInvertValue] = useState<number>(0)
    const [invertSliderVisible, setInvertSliderVisible] = useState<boolean>(false)
    const resetInvert = () => (setInvertValue(100))
    const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 })
    const [LabelerIsCollapsed, setLabelerIsCollapsed] = useState<boolean>(false)
    const [dimensions, setDimensions] = useState<CanvasDimensions>({
        width: 800,
        height: 800,
        scale: 2
    })

    useEffect(() => {
        console.log(ImageContainer.image.labels)
    }, [ImageContainer.image.labels])

    useEffect(() => {
        ImageContainer.callback(ImageContainer.focus, ImageContainer.image.labels ? { type: LabelTypes.Point, name: ImageContainer.focus + 1 } : { type: LabelTypes.Point, name: ImageContainer.focus + 1 })
    }, [ImageContainer.focus])

    return <Fragment>
        <div className="labeler-container">
        <div className="toolbar">
            <button className={"btn-tool"} onClick={() => { LabelerIsCollapsed ? setLabelerIsCollapsed(false) : setLabelerIsCollapsed(true) }}>
                {LabelerIsCollapsed ? <img width="20px" className="toolbar-img" src={process.env.PUBLIC_URL + "/fullscreen-undo.png"} alt="Polygon Selector" /> : <img width="20px" className="toolbar-img" src={process.env.PUBLIC_URL + "/fullscreen-do.png"} alt="Polygon Selector" />}
            </button>
            <button className={useCursor ? "btn-tool-active" : "btn-tool"} onClick={() => { useCursor ? setUseCursor(false) : setdoLine(false); setdoPolygon(false); setUseCursor(true); setdoPoint(false); }}>
                <img width="20px" style={{ filter: "grayscale(1)" }} className="toolbar-img" src={process.env.PUBLIC_URL + "/cursor.png"} alt="Polygon Selector" />
            </button>
            <button className={doPoint ? "btn-tool-active" : "btn-tool"} onClick={() => { doPoint ? setdoPolygon(false) : setdoLine(false); setdoPolygon(false); setUseCursor(false); setdoPoint(true); }}>
                <img width="20px" style={{ filter: "grayscale(1)" }} className="toolbar-img" src={process.env.PUBLIC_URL + "/points.png"} alt="Polygon Selector" />
            </button>
            <button className={doPolygon ? "btn-tool-active" : "btn-tool"} onClick={() => { doPolygon ? setdoPolygon(false) : setdoLine(false); setdoPolygon(true); setUseCursor(false); setdoPoint(false); }}>
                <img width="20px" className="toolbar-img" src={process.env.PUBLIC_URL + "/square-3.png"} alt="Polygon Selector" />
            </button>
            <button className={doLine ? "btn-tool-active" : "btn-tool"} onClick={() => { doLine ? setdoLine(false) : setdoLine(true); setdoPolygon(false); setUseCursor(false); setdoPoint(false); }}>
                <img width="20px" className="toolbar-img" src={process.env.PUBLIC_URL + "/line-segment.png"} alt="Polygon Selector" />
            </button>
            <button className={brightnessSliderVisible ? "btn-tool-active" : "btn-tool"} onDoubleClick={() => resetBrightness()} onClick={() => { brightnessSliderVisible ? setBrightnessSliderVisible(false) : setBrightnessSliderVisible(true) }}>
                <img width="20px" className="toolbar-img" src={process.env.PUBLIC_URL + "/brightness.png"} alt="Polygon Selector" />
            </button>
            <button className={contrastSliderVisible ? "btn-tool-active" : "btn-tool"} onDoubleClick={() => resetContrast()} onClick={() => { contrastSliderVisible ? setContrastSliderVisible(false) : setContrastSliderVisible(true) }}>
                <img width="20px" className="toolbar-img" src={process.env.PUBLIC_URL + "/contrast.png"} alt="Polygon Selector" />
            </button>
            <button className={invertSliderVisible ? "btn-tool-active" : "btn-tool"} onDoubleClick={() => resetInvert()} onClick={() => { invertSliderVisible ? setInvertSliderVisible(false) : setInvertSliderVisible(true) }}>
                <img width="20px" className="toolbar-img" src={process.env.PUBLIC_URL + "/invert.png"} alt="Polygon Selector" />
            </button>
        </div>
        <Slider visible={brightnessSliderVisible} value={brightnessValue} onChange={(e) => { setBrigthnessValue(parseInt(e.target.value)) }} />
        <Slider visible={contrastSliderVisible} value={contrastValue} onChange={(e) => { setContrastValue(parseInt(e.target.value)) }} />
        <Slider visible={invertSliderVisible} max={100} value={invertValue} onChange={(e) => { setInvertValue(parseInt(e.target.value)) }} />

        <div className="outer-container">
            <div className="main-view-container " style={{ width: dimensions.width + "px", height: dimensions.height + "px" }} >
                <img width={dimensions.width + "px"} height={dimensions.height + "px"} src={ImageContainer.image.blobURL} style={{ filter: `invert(${invertValue}%) contrast(${contrastValue}%) brightness(${brightnessValue}%)` }} />
                <canvas ref={canvasRef} style={{ width: dimensions.width + "px", height: dimensions.height + "px" }} width={dimensions.width * dimensions.scale} height={dimensions.height * dimensions.scale} />
                <canvas ref={canvasRefTemp} style={{ width: dimensions.width + "px", height: dimensions.height + "px" }} width={dimensions.width * dimensions.scale} height={dimensions.height * dimensions.scale} />
            </div>
        </div>
        </div>
        <button onClick={(e) => { ImageContainer.callback(ImageContainer.focus, ImageContainer.image.labels ? { type: LabelTypes.Point, name: ImageContainer.focus + 1 } : { type: LabelTypes.Point, name: ImageContainer.focus + 1 }) }}></button>

    </Fragment>
}

export default MainView