import {FunctionComponent} from 'react';
import "../../styles/Login.scss";
import { emailsent} from "../../projectAssets";
import { motion } from "framer-motion";

type ResetpswdConfirmProps = {callback_LoginForm: () => void;}

const ResetpswdConfirm : FunctionComponent<ResetpswdConfirmProps> = ({callback_LoginForm}) => {
    return(
        <div className="reset-pswd-confirm-section">
            <h1>Forgot Password</h1>
            <img src={emailsent} alt="email-sent" className="email-sent-g" />
            <h3>An email has been sent with reset instructions</h3>
            <motion.div className="okbutton" onClick={callback_LoginForm} whileHover={{ opacity: 0.8 }} whileTap={{ scale: 0.97 }}>
                Ok
            </motion.div>
        </div>
    );
}

export default ResetpswdConfirm