import Page from '../component/page'
import Heading from '../component/heading'
import Button from '../component/button'
import { Link } from 'react-router-dom'


export default function Container() {


    return (
        <Page background='welcome'>
            <Heading title={"Hello!"} description={"Welcome to bank app"} styleWelcome="welcome"/>

            <Link to="signup" style={{ width: "100%", textDecoration: "none" }}>
                <Button classModificator="primary" disabled="">Sign Up</Button>
            </Link>
            
            <Link to="signin" style={{ width: "100%", textDecoration: "none" }}>
                <Button classModificator="secondary" disabled="">Sign In</Button>
            </Link>
            
        </Page>
    )
}