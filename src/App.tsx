import React, { createContext, useEffect, useMemo, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import LabelViewer from './components/LabelViewer';
import internal from 'stream';



export enum LabelTypes {
  Point = "POINT",
  Line = "LINE",
  Polygon = "POLYGON",
  Rect = "RECTANGLE"
}

 
export interface Label {
  label: string,
  value: string
}

export interface Labels extends Array<Label>{}

interface Context {
  labels?: Labels,
  updateLabels: React.Dispatch<React.SetStateAction<any>>
}

export const LabelContext = createContext<Context>({
  labels: [],
  updateLabels: () => {}
})


function App() {
  const [labels, updateLabels] = useState<Labels>([])

  const params = useMemo(()=>({labels, updateLabels}),[labels])


  useEffect(()=>console.log(labels),[labels])
  return (
    <div className="App">
      <LabelContext.Provider value={params}>
        <LabelViewer/>
      </LabelContext.Provider>
    </div>
  );
}

export default App;
