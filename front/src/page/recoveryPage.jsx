import Page from '../component/page'
import ButtonBack from '../component/button_back'
import Heading from '../component/heading'

import FormRecovery from '../container/formRecovery'

export default function Container() {
    return (
        <Page>
            <ButtonBack />
            <Heading title={"Recover password"} description={"Choose a recovery method"}/>
            <FormRecovery buttonPath="/recovery-confirm" />
        </Page>
    )
}