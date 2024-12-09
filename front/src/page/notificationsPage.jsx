import Page from '../component/page'
import ButtonBack from '../component/button_back'
import Title from '../component/title'
import ListNotification from '../container/listNotifications'


export default function Container() {
    return (
        <Page background='grey'>
            <ButtonBack />
            <Title className='title--center'>Notifications</Title>
            <ListNotification />
        </Page>
    )
}