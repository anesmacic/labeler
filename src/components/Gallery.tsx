
import { SetStateAction, useContext, useEffect, useState } from "react"
import { ImagesI, ImageI } from "./LabelViewer"
import '../App.css'
import { LabelContext } from "../App"

export interface GalleryArgs {
    images?: ImagesI,
    focus: number,
    callback: React.Dispatch<SetStateAction<number>>
}

function Gallery({ images, focus, callback }: GalleryArgs) {


    const { labels, updateLabels } = useContext(LabelContext)


    useEffect(() => {
        console.log("rerendered")
    }, [])


    useEffect(() => { console.log(labels) }, [labels])

    const ef = (v: any) => { updateLabels({ label: v }) }

    return images!.length > 0 ?
        <div className="gallery-outermost-wrapper">
            <div className="carousel">
                {images!.map((image: ImageI, index: number) => { return <div className="img-wrapper"><button onClick={(e) => { callback(index) }}><img width={"80px"} height={"80px"} src={image.blobURL} /> </button></div> })}
            </div>
          {
            //  Image <input required type="number" value={focus} min={0} max={images!.length - 1} onChange={(event) => { if (event.target.value) if (parseInt(event.target.value) <= (images!.length - 1)) { ef(event.target.value); callback(parseInt(event.target.value)) } }} /> <p>{images![focus].file.name}</p> 
        }
        </div>
        :
        <></>

}

export default Gallery