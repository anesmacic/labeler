
import { Fragment, ReactElement, ReactHTML, ReactHTMLElement, useContext, useState } from "react";
import { ChromePicker } from "react-color";
import '../App.css'
import { Annotation } from "./MainView";
import { Label, LabelTypes } from "../App";
import CreatableSelect from 'react-select/creatable';
import { LabelContext } from "../App"

interface LabelObjectArgs {
    label: Annotation,
    id: string,
    nameLabel?: string,
    removeCallback: Function,
    updateColorCallback: Function,
    updateNameCallback: Function
}
function LabelObject({ label, id, nameLabel, removeCallback, updateColorCallback, updateNameCallback }: LabelObjectArgs): React.ReactElement {

    const [displayColorPicker, setDisplayColorPicker] = useState<boolean>(false)
    
    const { labels, updateLabels } = useContext(LabelContext)
    
    const [temporaryName, setTemporaryName] = useState<string>("")

    interface AnnotationAsArg { annotation: Annotation }

    function ShortDescription({ annotation }: AnnotationAsArg): React.ReactElement {
        switch (annotation.type) {
            case LabelTypes.Point:
                return <p> {(annotation.nodes[0].x).toFixed(4)} px , {(annotation.nodes[0].y).toFixed(4)} px </p>
            case LabelTypes.Line:
            case LabelTypes.Polygon:
                return <p> {label.nodes.length - 1} nodes </p>
            default:
                return <Fragment></Fragment>
        }
    }

    const popover: React.CSSProperties = {
        position: 'absolute',
        zIndex: '2',
    }

    const cover: React.CSSProperties = {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
    }

    return <div className="label-div" style={{ borderLeft: `6px solid black` }} id={label.type}  >
        <CreatableSelect
        isClearable={false}
        onChange={(newLabel) => {console.log(newLabel); if(!labels?.includes(newLabel as Label) && newLabel) updateLabels([...labels!, newLabel]); }}
        onInputChange={(value) => {console.log(value); updateNameCallback(id,value)}}
        inputValue={label.name}
        value={labels?.filter(label => label.value == "value")[0]}
        options={labels}
        onMenuClose={()=>console.log("closed")}
      />
        <div className="flex-row-space-between">
            <p id="smalltext">{label.type.toUpperCase()}</p>
            <ShortDescription annotation={label} />
            <button className="color-button" style={{backgroundColor: label.color}}  onClick={() => displayColorPicker ? setDisplayColorPicker(false) : setDisplayColorPicker(true)}>Color</button>
            {
                displayColorPicker ?
                    <div style={popover}>
                        <div style={cover} />
                        <ChromePicker color={label.color}  disableAlpha={true} onChangeComplete={ (e)=>{ console.log(e); updateColorCallback(id,e.hex); setDisplayColorPicker(false) }} />
                    </div>
                    :
                    null
            }
            <button className="remove-btn" onClick={()=>removeCallback(id)}>Remove</button>
        </div>
    </div>
}

export default LabelObject