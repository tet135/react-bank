import Page from '../component/page'
import ButtonBack from '../component/button_back'
import Heading from '../component/heading'

import FormSignUp from '../container/formSignUp'

export default function Container() {
    return (
        <Page>
            <ButtonBack />
            <Heading title={"Sign up"} description={"Choose a registration method"}/>
            <FormSignUp linkLabel="Already have an account?" linkText="Sign In" linkPath="/signin" buttonPath="/recovery-confirm" />
        </Page>
    )
}