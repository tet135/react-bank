import Page from '../component/page'
import ButtonBack from '../component/button_back'
import Title from '../component/title'
import FormSend from '../container/formSend'

export default function Container() {
    return (
        <Page background='grey'>
            <ButtonBack />
            <Title>Send</Title>
            <FormSend buttonPath="#"/>
        </Page>
    )
}