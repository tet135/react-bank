import Page from '../component/page'
import ButtonBack from '../component/button_back'
import Title from '../component/title'
import TransactionDetails from '../container/formTransaction'


export default function Container() {
    return (
        <Page background='grey'>
            <ButtonBack />
            <Title className='title--center'>Transaction</Title>
            <TransactionDetails/>
        </Page>
    )
}