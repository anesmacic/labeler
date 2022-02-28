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
            <Gallery images={images} focus={focus} callback={setFocus} />
            {images.length > 0 ?
                <MainView focus={focus} image={images[focus]} callback={updateImage} />
                :
                <div className="fc">

                    <h1>Labeler</h1>
                    <pre>version 0.1.0 <a href="https://github.com/anesmacic/labeler">Github &#8599;</a></pre>
                    <br />
                    <div className="outerfc">
                        <p>Upload some images to get started.</p>
                        <br />
                        <br />
                        <div className="innerfc">
                            <input className="fileupload" type="file" multiple onChange={(event) => {
                                setImages(Array.from(event.target.files!).map(
                                    (file) => {
                                        return {
                                            file: file,
                                            blobURL: URL.createObjectURL(file),
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