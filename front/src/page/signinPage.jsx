import Page from '../component/page'
import ButtonBack from '../component/button_back'
import Heading from '../component/heading'
import FormSignIn from '../container/formSignIn'



export default function Container(handleSignIn, linkLabel, linkText, linkPath, buttonPath) {


    return (
        <Page>
            <ButtonBack />
            <Heading title={"Sign in"} description={"Select login method"}/>
            <FormSignIn handleSubmit={handleSignIn} linkLabel="Forgot your password?" linkText="Restore" linkPath="/recovery" buttonPath="/balance"/>
        </Page>
    )
}