import Page from '../component/page'
import ButtonBack from '../component/button_back'
import Title from '../component/title'
import FormReceive from '../container/formReceive'

export default function Container() {
    return (
        <Page background='grey'>
            <ButtonBack />
            <Title className='title--center'>Receive</Title>
            <FormReceive buttonPath="#"/>
        </Page>
    )
}