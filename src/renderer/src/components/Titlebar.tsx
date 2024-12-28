import app_icon from '../../../../resources/icon.png'
import minimize_icon from '../../../../resources/minimize_window_white.svg'
import maximize_icon from '../../../../resources/maximize_window_white.svg'
import restore_icon from '../../../../resources/restore_window_white.svg'
import close_icon from '../../../../resources/x_white.svg'
import './componentAssets/titlebar.css'
import { useState } from 'react'

const TitleBar = () => {

    const [ fullscreenStatus, setFullScreenStatus ] = useState(false);

    const minimizeWindow = async () => {
        await window.api.minimize();
    }
    const maximizeWindow = async () => {
        const res = await window.api.maximize();
        if (res.fullStatus) {
            setFullScreenStatus(true);
        }
    }
    const restoreWindow = async () => {
        const res = await window.api.restore();
        if (!res.fullStatus) {
            setFullScreenStatus(false);
        }
    }
    const closeWindow = async () => {
        await window.api.close();
    }

  return (
    <>
    <div id="Titlebar">
        
        <h4 id='Titlebar-title'>
            <img src={app_icon} alt="appIcon" className='Titlebar-icons' id='Titlebar-app-icon' draggable={false} />
            Budgetary
        </h4>

        <div id="Titlebar-icon-div">
            <div className="Tilebar-icons-box"><img src={minimize_icon} alt="minimize" className="Titlebar-icons" onClick={() => minimizeWindow()} draggable={false} /></div>
            {fullscreenStatus ?
            <div className="Tilebar-icons-box"><img src={restore_icon} alt="restore" className="Titlebar-icons" onClick={() => restoreWindow()} draggable={false} /></div>
            :
            <div className="Tilebar-icons-box"><img src={maximize_icon} alt="maximize" className="Titlebar-icons" onClick={() => maximizeWindow()} draggable={false} /></div>
        }
        <div className="Tilebar-icons-box" id='Titlebar-close-icon'><img src={close_icon} alt="close" className="Titlebar-icons" onClick={() => closeWindow()} draggable={false} /></div>
        </div>
    </div>
    </>
  )
}

export default TitleBar