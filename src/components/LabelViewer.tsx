import React, { Fragment, useEffect, useState } from 'react';
import { Labels } from '../App';
import Gallery from './Gallery';
import LabelStore from './LabelStore';
import MainView, { Annotations } from './MainView';


export interface ImageI {
    file: File,
    blobURL: string,
    annotations: Annotations
}

export interface ImagesI extends Array<ImageI> { }

function LabelViewer() {

    const [images, setImages] = useState<ImagesI>([])
    const [focus, setFocus] = useState<number>(0)

    const updateImage = (index: number, annotations: Annotations) => {
        let image: ImageI = images[index]
        image.annotations = annotations
        setImages([...images.slice(0, index), image, ...images.slice(index + 1)])
    }

    return (
        <Fragment>

            {images.length > 0 ?
                <>

                    <MainView focus={focus} image={images[focus]} callback={updateImage} />
                    <div className="stickyb">
                    <div className="download flex-row inlinea">
                        <a className="download-ref" href={`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(images))}`} download="annotations_labeler_v010.json">
                            <button className="download-btn">Download All Annotations</button>
                        </a>
                        <a className="download-ref" href={`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(images[focus]))}`} download="annotations_labeler_v010.json">
                            <button className="download-btn">Download This Annotation</button>
                        </a>
                    </div>
                    <Gallery images={images} focus={focus} callback={setFocus} />
                    </div>
                </>
                :
                <div className="fc">
                    <h1>Labeler</h1>
                    <p><a href="https://github.com/anesmacic/labeler"> Version 0.1.0 &#8599;</a></p>
                    <br />
                    <div className="outerfc">
                        <div className="innerfc">
                            <input className="fileupload" type="file" multiple onChange={(event) => {
                                setImages(Array.from(event.target.files!).map(
                                    (file) => {
                                        return {
                                            file: file,
                                            blobURL: URL.createObjectURL(file),
                                            filename: file.name,
                                            lastModified: file.lastModified,
                                            annotations: []
                                        }
                                    }
                                ));
                            }} />
                        </div>
                    </div>
                </div>
            }

        </Fragment>
    )
}

export default LabelViewer