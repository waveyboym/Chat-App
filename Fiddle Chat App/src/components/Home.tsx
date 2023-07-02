import {FunctionComponent} from 'react';
import { chatapplogo_IA } from "../projectAssets";

type HomeProps = {setTheme: string}

const Home : FunctionComponent<HomeProps> = ({setTheme}) => {
    return (
      <div className="blank-page" data-theme={setTheme}>
        <h1>Hello, Welcome to Fiddle Chat App</h1>
        <img className="icon" src={chatapplogo_IA}/>
      </div>
    )
  }

export default Home