import Page from '../component/page'
import ButtonBack from '../component/button_back'
import Heading from '../component/heading'
import FormSignupConfirm from '../container/formSignupConfirm'



export default function Container() {
    return (
        <Page>
            <ButtonBack />
            <Heading title={"Confirm account"} description={"Write the code you received"}/>
            <FormSignupConfirm />
        </Page>
    )
}