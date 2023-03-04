import "../../styles/Settings.scss"
import { app_banner_small, app_banner_small_LM, app_logo_small,
  app_logo_small_LM }from "../../projectAssets";

const About = (props) => {
  return (
    <div className="about">
      <div className="top-bar-blur"><h1>About</h1></div>
      <div className="themes-box">
        { props.setTheme === 'light'? <img src={app_logo_small_LM} alt="user"/>
        : <img src={app_logo_small} alt="user"/>}
        { props.setTheme === 'light'? <img src={app_banner_small_LM} alt="user" className="icon"/>
        : <img src={app_banner_small} alt="user" className="icon"/>}
        <h2>2022 Fiddle Chat App</h2>
      </div>
    </div>
  )
}

export default About