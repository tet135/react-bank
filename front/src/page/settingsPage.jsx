import { useNavigate } from 'react-router-dom';

import Page from '../component/page'
import ButtonBack from '../component/button_back'
import FormSettings from "../container/formSettings"
import Title from "../component/title";
import Button from "../component/button";

import { useContext } from "react";

import { AuthContext } from "../App";
import { updateGlobalState } from '../util/updateGlobalState';
import { REQUEST_ACTION_TYPE } from "../util/glogalReducer";



export default function Container() {
    const context = useContext(AuthContext);
    const navigate = useNavigate();
    const handleLogout = () => {
        
        //записали user в AuthContext//data={token, user: {email, isConfirm}}
        updateGlobalState(REQUEST_ACTION_TYPE.LOGOUT, null, context);

        //перейти на сторінку '/'
       navigate("/logout");
       
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