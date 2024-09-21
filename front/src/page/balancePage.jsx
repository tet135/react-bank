import Page from '../component/page'
import HeadingBalance from '../component/heading_balance'
import FormBalance from '../container/formBalance'


export default function Container() {
    return (
        <Page background='balance'>
            <HeadingBalance />
            <FormBalance />
        </Page>
    )
}