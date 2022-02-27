export interface SliderArgs {
    value: number,
    onChange?: React.ChangeEventHandler<HTMLInputElement>,
    min?: number,
    max?: number,
    visible: boolean
}

function Slider({ value, onChange, min = 1, max = 200, visible = true }: SliderArgs) {
    return visible ? <div className="slidecontainer">
        <input type="range" min={min} max={max} value={value} onChange={onChange} id="slider" />
    </div>
        :
        <></>
}

export default Slider