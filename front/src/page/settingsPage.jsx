import { useNavigate } from 'react-router-dom';

import Page from '../component/page'
import ButtonBack from '../component/button_back'
import FormSettings from "../container/formSettings"
import Title from "../component/title";
import Button from "../component/button";

import { useContext } from "react";

import { AuthContext } from "../App";
import { updateGlobalState } from '../util/updateGlobalState';
import { REQUEST_ACTION_TYPE } from "../util/globalReducer";

import { saveSession } from "../util/session";

export default function Container() {
    const context = useContext(AuthContext);
    // console.log("context in settings page", context)
    const navigate = useNavigate();
    const handleLogout = () => {

        //зберегли сесію
        saveSession(null);
        // const session = getSession();
        // console.log("session after logout", session)
        
        //записали user в AuthContext//data={token, user: {email, isConfirm}}
        updateGlobalState(REQUEST_ACTION_TYPE.LOGOUT, null, context);
        // console.log("context after logout", context)

        //перейти на сторінку '/'
       navigate("/");
       
    }
    return (
        <Page>
            <ButtonBack />
            <Title className='title--center'>Setting</Title>
            <FormSettings titleText="Change email" inputLabel="New Email" newInput="email_new" toggle={false} buttonText="Save Email" />
            <FormSettings titleText="Change password" inputLabel="New password" newInput="password_new" toggle={true} buttonText="Save password"/>
            <Button classModificator={"logout"} disabled={false} handleClick={handleLogout} >Log out</Button>
        </Page>
    )
}