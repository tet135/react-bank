import Page from '../component/page'
import ButtonBack from '../component/button_back'
import Heading from '../component/heading'

import FormRecoveryConfirm from '../container/formRecoveryConfirm'

export default function Container() {
    return (
        <Page>
            <ButtonBack />
            <Heading title={"Recover password"} description={"Write the code you received"}/>
            <FormRecoveryConfirm buttonPath="/balance" />
        </Page>
    )
}