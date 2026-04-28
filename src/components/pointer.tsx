import {Dot} from 'lucide-react'

export function Pointer ()  {
    const pointerStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }

    return (
        <div style = {pointerStyle}>
        <Dot  size={35} style={{color:'#0047AB'}}/>
        </div>
    )
    }