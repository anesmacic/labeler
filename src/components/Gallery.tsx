
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


    return images!.length > 0 ?
        <div className="gallery-outermost-wrapper">
            <div className="flex-row inlinea">
            <p>{images!.length} image{images!.length > 1 ? "s" : null} in the gallery.</p> <a className="download-ref" href={`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(images))}`} download="annotations_labeler_v010.json">
                <button className="download-btn">Download Annotations</button>
            </a>
            </div>
            <div className="carousel">
                {images!.map((image: ImageI, index: number) => { return <div className="img-wrapper" key={index + "d"}><button onClick={(e) => { callback(index) }} key={index + "b"}><img key={index + "im"} width={"80px"} height={"80px"} src={image.blobURL} /> </button></div> })}
            </div>
            
        </div>
        :
        <></>

}

export default Gallery