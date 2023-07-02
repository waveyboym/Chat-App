import "../../styles/Settings.scss"
import { app_banner_small, app_banner_small_LM, app_logo_small,
  app_logo_small_LM }from "../../projectAssets";
import {FunctionComponent} from 'react';

type SettingsProps = {darklight: string}

const About : FunctionComponent<SettingsProps> = ({darklight}) => {
  return (
    <div className="about">
      <div className="top-bar-blur"><h1>About</h1></div>
      <div className="themes-box">
        { darklight === 'light'? <img src={app_logo_small_LM} alt="user"/>
        : <img src={app_logo_small} alt="user"/>}
        { darklight === 'light'? <img src={app_banner_small_LM} alt="user" className="icon"/>
        : <img src={app_banner_small} alt="user" className="icon"/>}
        <h2>2023 Fiddle Chat App</h2>
      </div>
    </div>
  )
}

export default About