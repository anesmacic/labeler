import React, { createContext, useMemo, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import LabelViewer from './components/LabelViewer';



export enum LabelTypes {
  Point = "POINT",
  Line = "LINE",
  Polygon = "POLYGON",
  Rect = "RECTANGLE"
}

export interface Label {
  name: string,
  type: LabelTypes
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

  return (
    <div className="App">
      <LabelContext.Provider value={params}>
        <LabelViewer/>
      </LabelContext.Provider>
    </div>
  );
}

export default App;
