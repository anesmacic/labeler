import { Fragment, Ref, useEffect, useRef, useState } from "react"
import { ImageI, ImagesI } from "./LabelViewer"
import '../App.css'
import { LabelTypes, Label } from "../App"
import Slider from './Slider';
import LabelObject from "./Label";

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

export interface Node {
    x: number,
    y: number
}

export interface Nodes extends Array<Node> { }

export interface Annotation {
    uniqueId: string,
    nodes: Nodes,
    name?: string,
    color?: string,
    type: LabelTypes
}

export interface Annotations extends Array<Annotation> { }

export interface LineAnnotation extends Annotation {
    type: LabelTypes.Line
}
export interface PointAnnotation extends Annotation {
    type: LabelTypes.Point
}
export interface PolygonAnnotation extends Annotation {
    type: LabelTypes.Polygon
}

function MainView(ImageContainer: MainVeiwArgs) {
    const placeholderPolygonAnnotation: Annotation = {
        uniqueId: "",
        nodes: [],
        color: "#0000FF6B",
        type: LabelTypes.Polygon
    }
    const placeholderLineAnnotation: Annotation = {
        uniqueId: "",
        nodes: [],
        color: "#0000FF6B",
        type: LabelTypes.Line
    }
    const placeholderPointAnnotation: Annotation = {
        uniqueId: "",
        nodes: [],
        color: "#0000FF6B",
        type: LabelTypes.Point
    }

    const drawingCanvasRef = useRef<HTMLCanvasElement>(null)
    const displayCanvasRef = useRef<HTMLCanvasElement>(null)
    const [modeCursor, setmodeCursor] = useState<boolean>(true)
    const [modePolygon, setmodePolygon] = useState<boolean>(false)
    const [modePoint, setmodePoint] = useState<boolean>(false)
    const [modeLine, setmodeLine] = useState<boolean>(false)
    const [temporaryPolygonAnnotation, settemporaryPolygonAnnotation] = useState<Annotation>(placeholderPolygonAnnotation)
    const [temporaryLineAnnotation, settemporaryLineAnnotation] = useState<Annotation>(placeholderLineAnnotation)
    const [temporaryPointAnnotation, settemporaryPointAnnotation] = useState<Annotation>(placeholderPointAnnotation)
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

    type Mode = [Annotation, React.Dispatch<React.SetStateAction<Annotation>>]

    const getMode = (): Mode => {
        if (modePolygon)
            return [temporaryPolygonAnnotation, settemporaryPolygonAnnotation]
        if (modeLine)
            return [temporaryLineAnnotation, settemporaryLineAnnotation]
        if (modePoint)
            return [temporaryPointAnnotation, settemporaryPointAnnotation]
        else {
            throw new Error("Invalid mode.")
        }
    }

    const reportClick = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        const target = event.target as HTMLElement;
        const rect = target!.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const [currentLabel, updateCurrentLabel] = getMode()
        const newNode: Node = { x: x / dimensions.width, y: y / dimensions.width }
        let current = Object.assign({}, currentLabel)
        current.nodes.push(newNode)
        current.uniqueId = Math.random().toString(36)
        if (modePoint) {
            updateCurrentLabel(placeholderPointAnnotation)
            ImageContainer.callback(ImageContainer.focus, [...ImageContainer.image.annotations, current])
        } else {
            updateCurrentLabel(current)
        }
    }

    const reportDoubleClick = () => {
        if (modePolygon)
            if (temporaryPolygonAnnotation) {
                let closedPath: Annotation = temporaryPolygonAnnotation;
                closedPath.nodes.push(closedPath.nodes[0]);
                closedPath.uniqueId = Math.random().toString(36)
                ImageContainer.callback(ImageContainer.focus, [...ImageContainer.image.annotations, closedPath])
                settemporaryPolygonAnnotation(placeholderPolygonAnnotation);
            }
        if (modeLine)
            if (temporaryLineAnnotation) {
                temporaryLineAnnotation.uniqueId = Math.random().toString(36)
                ImageContainer.callback(ImageContainer.focus, [...ImageContainer.image.annotations, temporaryLineAnnotation])
                settemporaryLineAnnotation(placeholderLineAnnotation)
            }
    }

    useEffect(() => {
        const canvas = drawingCanvasRef.current
        const context = canvas!.getContext('2d')
        if (context) {
            context.clearRect(0, 0, canvas!.width, canvas!.height);
            context.beginPath()
            temporaryPolygonAnnotation?.nodes.map(
                (node: Node) => {
                    context.fillStyle = temporaryPolygonAnnotation.color!
                    context.arc(node.x * dimensions.width * dimensions.scale, node.y * dimensions.height * dimensions.scale, 2, 0, 2 * Math.PI)
                    context.stroke()
                    context.strokeStyle = temporaryPolygonAnnotation.color!
                }
            )
            context.fill()
        }
    },[modePolygon, temporaryPolygonAnnotation])

    useEffect(() => {
        const canvas = drawingCanvasRef.current
        const context = canvas!.getContext('2d')
        if (context) {
            context.clearRect(0, 0, canvas!.width, canvas!.height);
            context.beginPath()
            temporaryLineAnnotation?.nodes.map(
                (node: Node) => {
                    context.lineWidth = 5
                    context.arc(node.x * dimensions.width * dimensions.scale, node.y * dimensions.height * dimensions.scale, 5, 0, 2 * Math.PI)
                    context.stroke()
                    context.strokeStyle = temporaryLineAnnotation.color!
                }
            )
        }
    },[modeLine, temporaryLineAnnotation])

    useEffect(() => {
        const canvas = displayCanvasRef.current
        const context = canvas!.getContext('2d')
        if (context) {
            context.clearRect(0, 0, canvas!.width, canvas!.height);
            ImageContainer.image.annotations.map(
                (label: Annotation) => {
                    switch (label.type) {
                        case LabelTypes.Point:
                            context.fillStyle = label.color!
                            context.beginPath()
                            context.arc(label.nodes[0].x * dimensions.width * dimensions.scale, label.nodes[0].y * dimensions.height * dimensions.scale, 10, 0, 2 * Math.PI)
                            context.fill()
                            break;
                        case LabelTypes.Line:
                            context.beginPath();
                            context.fillStyle = label.color!
                            context.strokeStyle = label.color!
                            context.lineWidth = 5;
                            label.nodes.map((node: Node) => {
                                context.arc(node.x * dimensions.width * dimensions.scale, node.y * dimensions.height * dimensions.scale, 5, 0, 2 * Math.PI)
                            })
                            context.stroke()
                            break;
                        case LabelTypes.Polygon:
                            context.beginPath();
                            context.fillStyle = label.color!
                            context.strokeStyle = label.color!
                            label.nodes.map((node: Node) => {
                                context.arc(node.x * dimensions.width * dimensions.scale, node.y * dimensions.height * dimensions.scale, 0.1, 0, 2 * Math.PI)
                                context.stroke()
                            })
                            context.fill()
                            break;
                        default:
                            break;
                    }
                }
            )

        }
    },[ImageContainer.image.annotations, dimensions])

   
    const removeAnnotation = (id : string) : void =>  {
        ImageContainer.callback(ImageContainer.focus, [...ImageContainer.image.annotations.filter((annotation: Annotation) => annotation.uniqueId!=id)])
    }

    const updateAnnotationColor = (id : string, color: string) : void =>  {
        let currentValue = Object.assign([],ImageContainer.image.annotations)
        ImageContainer.callback(ImageContainer.focus, [...currentValue.map((annotation: Annotation) => { if (annotation.uniqueId==id){
            let newAnnotation = Object.assign({}, annotation)
            newAnnotation.color = color + "8A"
            return newAnnotation
        }else{
            return annotation
        }})])
    }

    const updateAnnotationName = (id : string, name: string) : void =>  {
        let currentValue = Object.assign([],ImageContainer.image.annotations)
        ImageContainer.callback(ImageContainer.focus, [...currentValue.map((annotation: Annotation) => { if (annotation.uniqueId==id){
            let newAnnotation = Object.assign({}, annotation)
            newAnnotation.name = name
            return newAnnotation
        }else{
            return annotation
        }})])
    }

    return <Fragment>
        <div className="labeler-container">
            <div className="toolbar">
                <button className={"btn-tool"} onClick={() => { LabelerIsCollapsed ? setLabelerIsCollapsed(false) : setLabelerIsCollapsed(true) }}>
                    {LabelerIsCollapsed ? <img width="20px" className="toolbar-img" src={process.env.PUBLIC_URL + "/fullscreen-undo.png"} alt="Polygon Selector" /> : <img width="20px" className="toolbar-img" src={process.env.PUBLIC_URL + "/fullscreen-do.png"} alt="Polygon Selector" />}
                </button>
                <button className={modeCursor ? "btn-tool-active" : "btn-tool"} onClick={() => { modeCursor ? setmodeCursor(false) : setmodeLine(false); setmodePolygon(false); setmodeCursor(true); setmodePoint(false); }}>
                    <img width="20px" style={{ filter: "grayscale(1)" }} className="toolbar-img" src={process.env.PUBLIC_URL + "/cursor.png"} alt="Polygon Selector" />
                </button>
                <button className={modePoint ? "btn-tool-active" : "btn-tool"} onClick={() => { modePoint ? setmodePolygon(false) : setmodeLine(false); setmodePolygon(false); setmodeCursor(false); setmodePoint(true); }}>
                    <img width="20px" style={{ filter: "grayscale(1)" }} className="toolbar-img" src={process.env.PUBLIC_URL + "/points.png"} alt="Polygon Selector" />
                </button>
                <button className={modePolygon ? "btn-tool-active" : "btn-tool"} onClick={() => { modePolygon ? setmodePolygon(false) : setmodeLine(false); setmodePolygon(true); setmodeCursor(false); setmodePoint(false); }}>
                    <img width="20px" className="toolbar-img" src={process.env.PUBLIC_URL + "/square-3.png"} alt="Polygon Selector" />
                </button>
                <button className={modeLine ? "btn-tool-active" : "btn-tool"} onClick={() => { modeLine ? setmodeLine(false) : setmodeLine(true); setmodePolygon(false); setmodeCursor(false); setmodePoint(false); }}>
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
                <div className="main-view-container " style={{ width: dimensions.width + "px", height: dimensions.height + "px" }} onContextMenu={(e) => { e.preventDefault(); return false }} >
                    <img width={dimensions.width + "px"} height={dimensions.height + "px"} onContextMenu={(e) => { e.preventDefault(); return false }} src={ImageContainer.image.blobURL} style={{ filter: `invert(${invertValue}%) contrast(${contrastValue}%) brightness(${brightnessValue}%)` }} />
                    <canvas ref={displayCanvasRef} onContextMenu={(e) => { e.preventDefault(); return false }} onClick={(e) => reportClick(e)} style={{ width: dimensions.width + "px", height: dimensions.height + "px" }} width={dimensions.width * dimensions.scale} height={dimensions.height * dimensions.scale} />
                    <canvas ref={drawingCanvasRef} onClick={(e) => reportClick(e)} style={{ width: dimensions.width + "px", height: dimensions.height + "px" }} width={dimensions.width * dimensions.scale} height={dimensions.height * dimensions.scale} onContextMenu={(e) => { reportDoubleClick(); return false; }} />
                </div>
            </div>
            <div className="label-container-out">
            {ImageContainer.image.annotations.map((annotation: Annotation, index: number) => {
                return <LabelObject key={index + "annotation"} label={annotation} 
                                    id={annotation.uniqueId} 
                                    nameLabel={annotation.name!} 
                                    removeCallback={removeAnnotation}
                                    updateColorCallback = {updateAnnotationColor}
                                    updateNameCallback = {updateAnnotationName}
                                    />
            })}
            </div>
        </div>
    </Fragment>
}

export default MainView