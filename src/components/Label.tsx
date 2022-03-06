
import { Fragment, ReactElement, ReactHTML, ReactHTMLElement, useContext, useEffect, useState } from "react";
import { ChromePicker } from "react-color";
import '../App.css'
import { Annotation } from "./MainView";
import { Label, LabelTypes } from "../App";
import CreatableSelect from 'react-select/creatable';
import { LabelContext } from "../App"

interface LabelObjectArgs {
    label: Annotation,
    id: string,
    nameLabel: string,
    removeCallback: Function,
    updateColorCallback: Function,
    updateNameCallback: Function
}
function LabelObject({ label, id, nameLabel, removeCallback, updateColorCallback, updateNameCallback }: LabelObjectArgs): React.ReactElement {

    const [displayColorPicker, setDisplayColorPicker] = useState<boolean>(false)
    
    const { labels, updateLabels } = useContext(LabelContext)
    
    interface AnnotationAsArg { annotation: Annotation }

    function ShortDescription({ annotation }: AnnotationAsArg): React.ReactElement {
        switch (annotation.type) {
            case LabelTypes.Point:
                return <p id="smalltext"> {(annotation.nodes[0].x).toFixed(4)} px , {(annotation.nodes[0].y).toFixed(4)} px </p>
            case LabelTypes.Line:
            case LabelTypes.Polygon:
                return <p id="smalltext"> {label.nodes.length - 1} nodes </p>
            default:
                return <Fragment></Fragment>
        }
    }

    const popover: React.CSSProperties = {
        position: 'absolute',
        zIndex: '6',
    }

    const cover: React.CSSProperties = {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
    }

    const [globalLabel, makeGlobalLabel] = useState<string>("notglobal");

    useEffect(()=>{
        if(globalLabel == "global"){
            if (!labels?.includes({label: nameLabel})){
                updateLabels([...labels!, {label: nameLabel}])
            }
        }
    },[globalLabel])

    return <div className="label-div" style={{ border: `1px solid ${label.color!}` }} id={label.type}  >
      
      <input type="text" className="labelName" name="labelName" placeholder="Name .." list="labelOptions" value={nameLabel} onChange={(e) => updateNameCallback(id,e.target.value)}/>
            <datalist id="labelOptions">
                {labels?.map((label: Label, index: number) => {
                    return <option key={index + "op"} value={label.label}>{label.label}</option>
                })}
            </datalist>
        <div className="flex-row-space-between">
            <div className="flex-column">
            <p id="smalltext">{label.type.toUpperCase()}</p>
            </div>

            <div className="flex-row">
            <button className={globalLabel} onClick={()=> globalLabel == "global" ? makeGlobalLabel("notglobal") : makeGlobalLabel("global") }>Global</button>

            <button className="color-button" style={{backgroundColor: label.color}}  onClick={() => displayColorPicker ? setDisplayColorPicker(false) : setDisplayColorPicker(true)}>Fill</button>
            {
                displayColorPicker ?
                    <div style={popover}>
                        <div style={cover} > </div>
                        <ChromePicker color={label.color}  disableAlpha={true} onChangeComplete={ (e)=>{ updateColorCallback(id,e.hex); setDisplayColorPicker(false) }} />
                        
                    </div>
                    :
                    null
            }
            <button className="remove-btn" onClick={()=>removeCallback(id)}>Remove</button>
            </div>
        </div>
    </div>
}

export default LabelObject