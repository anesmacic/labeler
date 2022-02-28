import { Fragment, Ref, useEffect, useRef, useState } from "react"
import { ImageI, ImagesI } from "./LabelViewer"
import '../App.css'
import { LabelTypes, Label} from "../App"
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

export interface Node {
    x: number,
    y: number
  }
  
export interface Nodes extends Array<Node>{}

export interface Annotation {
    nodes: Nodes,
    name?: string,
    type: LabelTypes
}

export interface Annotations extends Array<Annotation>{}

export interface LineAnnotation extends Annotation{
    type: LabelTypes.Line
}
export interface PointAnnotation extends Annotation{
    type: LabelTypes.Point
}
export interface PolygonAnnotation extends Annotation{
    type: LabelTypes.Polygon
}



function MainView(ImageContainer: MainVeiwArgs) {
    const placeholderPolygonAnnotation : Annotation = {
        nodes: [],
        type: LabelTypes.Polygon
    }
     const placeholderLineAnnotation : Annotation = {
        nodes: [],
        type: LabelTypes.Line
    }
     const placeholderPointAnnotation : Annotation = {
        nodes: [],
        type: LabelTypes.Point
    }
    
    const canvasRefTemp = useRef<HTMLCanvasElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [useCursor, setUseCursor] = useState<boolean>(true)
    const [doPolygon, setdoPolygon] = useState<boolean>(false)
    const [doPoint, setdoPoint] = useState<boolean>(false)
    const [doLine, setdoLine] = useState<boolean>(false)
    const [tempPolygonLabel, settempPolygonLabel] = useState<Annotation>(placeholderPolygonAnnotation)
    const [tempLineLabel, settempLineLabel] = useState<Annotation>(placeholderLineAnnotation)
    const [tempPointLabel, settempPointLabel] = useState<Annotation>(placeholderPointAnnotation)
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

    const [labels, setLabels] = useState<Annotations>([])

    type Mode = [Annotation, React.Dispatch<React.SetStateAction<Annotation>>]

    const getMode = () : Mode => {
        if (doPolygon)
            return [tempPolygonLabel,settempPolygonLabel]
        if (doLine)
            return [tempLineLabel, settempLineLabel]
        if (doPoint)
            return [tempPointLabel,settempPointLabel]
        else{
            throw new Error("Invalid mode.")
        }
    }
    
    const reportClick = (event:  React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        const target = event.target as HTMLElement;
        const rect = target!.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const [currentLabel, updateCurrentLabel] = getMode()
        const newNode : Node = { x : x/dimensions.width, y : y/dimensions.width}
        let current = Object.assign({}, currentLabel)
        current.nodes.push(newNode)
        if (doPoint) {
            updateCurrentLabel(placeholderPointAnnotation)
            setLabels([... labels, current])
        } else {
            updateCurrentLabel(current)
        }
    }


    const reportDoubleClick = () => {
        if (doPolygon)
            if (tempPolygonLabel){
                let closedPath : Annotation = tempPolygonLabel;
                closedPath.nodes.push(closedPath.nodes[0]);
                setLabels([...labels, closedPath])
                settempPolygonLabel(placeholderPolygonAnnotation);
            }
        if (doLine)
            if (tempLineLabel){
                setLabels([...labels, tempLineLabel])
                settempLineLabel(placeholderLineAnnotation)
            }
    }

    useEffect(() =>{
        const canvas= canvasRefTemp.current
        const context = canvas!.getContext('2d')
        if (context){
            context.clearRect(0, 0, canvas!.width, canvas!.height); 
            context.beginPath()
            tempPolygonLabel?.nodes.map(
                (node : Node) =>    {
                    context.fillStyle = "#0000FF6B"
                    context.arc(node.x*dimensions.width*dimensions.scale, node.y*dimensions.height*dimensions.scale, 2, 0, 2*Math.PI)
                    context.stroke()
                    context.strokeStyle = "#0000FF6B"
                }

            )
            context.fill()
        }
    }
    ,[doPolygon,tempPolygonLabel])

    useEffect(() =>{
        const canvas = canvasRefTemp.current
        const context = canvas!.getContext('2d')
        if (context){
        context.clearRect(0, 0, canvas!.width, canvas!.height); 
        context.beginPath()
        tempLineLabel?.nodes.map(
            (node: Node) =>    {
                context.lineWidth = 5
                context.arc(node.x*dimensions.width*dimensions.scale, node.y*dimensions.height*dimensions.scale, 5, 0, 2*Math.PI)
                context.stroke()
                context.strokeStyle = "#0000FF6B"
            }
            )
        }
    }
    ,[doLine,tempLineLabel])


    useEffect(()=> {
        const canvas = canvasRef.current
        const context = canvas!.getContext('2d')
        if (context){
        context.clearRect(0, 0, canvas!.width, canvas!.height); 
        labels.map(
            (label : Annotation) =>  

            {   switch(label.type){
                case LabelTypes.Point:
                    context.fillStyle = "#0000FF6B"
                    context.beginPath()
                    context.arc(label.nodes[0].x*dimensions.width*dimensions.scale, label.nodes[0].y*dimensions.height*dimensions.scale, 10, 0, 2*Math.PI)
                    context.fill()
                    break;
                case LabelTypes.Line:
                    context.beginPath();
                    context.fillStyle = "#0000FF6B"
                    context.strokeStyle = "#0000FF6B"
                    context.lineWidth = 5;
                    label.nodes.map((node:Node) =>{
                        context.arc(node.x*dimensions.width*dimensions.scale, node.y*dimensions.height*dimensions.scale, 5, 0, 2*Math.PI)
                    })
                    context.stroke()
                    break;
                case LabelTypes.Polygon:
                    context.beginPath();
                    context.fillStyle = "#0000FF6B"
                    context.strokeStyle = "#0000FF6B"
                    label.nodes.map((node:Node) =>{
                        context.arc(node.x*dimensions.width*dimensions.scale, node.y*dimensions.height*dimensions.scale, 0.1, 0, 2*Math.PI)
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
        }
    ,[labels, dimensions])


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
            <div className="main-view-container " style={{ width: dimensions.width + "px", height: dimensions.height + "px" }} onContextMenu={(e)=>{e.preventDefault(); return false}} >
                <img width={dimensions.width + "px"} height={dimensions.height + "px"} onContextMenu={(e)=>{e.preventDefault(); return false}}  src={ImageContainer.image.blobURL} style={{ filter: `invert(${invertValue}%) contrast(${contrastValue}%) brightness(${brightnessValue}%)` }} />
                <canvas ref={canvasRef} onContextMenu={(e)=>{e.preventDefault(); return false}} onClick={(e) => reportClick(e)} style={{ width: dimensions.width + "px", height: dimensions.height + "px" }} width={dimensions.width * dimensions.scale} height={dimensions.height * dimensions.scale} />
                <canvas ref={canvasRefTemp} onClick={(e) => reportClick(e)} style={{ width: dimensions.width + "px", height: dimensions.height + "px" }} width={dimensions.width * dimensions.scale} height={dimensions.height * dimensions.scale} onContextMenu={(e) => {reportDoubleClick(); return false;}}/>
            </div>
        </div>
        </div>
        <button onClick={(e) => { ImageContainer.callback(ImageContainer.focus, ImageContainer.image.labels ? { type: LabelTypes.Point, name: ImageContainer.focus + 1 } : { type: LabelTypes.Point, name: ImageContainer.focus + 1 }) }}></button>

    </Fragment>
}

export default MainView