import Page from '../component/page'
import Heading from '../component/heading'
import Button from '../component/button'
import { Link } from 'react-router-dom'


export default function Container() {
    return (
        <Page background='welcome'>

            <Heading title="Oops!" description="You seem to be lost..." styleWelcome="welcome"/>

            <Link to="/balance" style={{ width: "100%", textDecoration: "none" }}>
                <Button classModificator="primary" disabled={false}>Your balance page</Button>
            </Link>

            <Link to="/" style={{ width: "100%", textDecoration: "none" }}>
                <Button classModificator="primary" disabled={false}>Home</Button>
            </Link>
            
        </Page>
    )
}