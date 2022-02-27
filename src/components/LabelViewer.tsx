import React, { Fragment, useEffect, useState } from 'react';
import { Labels } from '../App';
import Gallery from './Gallery';
import LabelStore from './LabelStore';
import MainView from './MainView';


export interface ImageI {
    file: File,
    blobURL: string,
    labels?: Labels
}

export interface ImagesI extends Array<ImageI> { }

function LabelViewer() {

    const [images, setImages] = useState<ImagesI>([])
    const [focus, setFocus] = useState<number>(0)

    const updateImage = (index: number, label: any) => {
        let image: ImageI = images[index]
        image.labels = label
        setImages([...images.slice(0, index), image, ...images.slice(index + 1)])
    }

    useEffect(() => {
        console.log(images)
    }, [images])

    useEffect(() => {
        console.log(focus)
    }, [focus])

    return (
        <Fragment>
            <Gallery images={images} focus={focus} callback={setFocus} />
            {images.length > 0 ?
                <MainView focus={focus} image={images[focus]} callback={updateImage} />
                :
                <input type="file" multiple onChange={(event) => {
                        setImages(Array.from(event.target.files!).map(
                            (file) => {
                                return {
                                    file: file,
                                    blobURL: URL.createObjectURL(file)
                                }
                            }
                        ));
                    }}/>
            }
        </Fragment>
    )
}

export default LabelViewer