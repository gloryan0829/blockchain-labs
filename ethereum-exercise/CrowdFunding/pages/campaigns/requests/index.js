import React, { Component } from 'react';
import { Button, Table } from 'semantic-ui-react';
import { Link } from '../../../routes';
import Layout from '../../../components/Layout';
import Campaign from '../../../contracts/campaign';
import RequestRow from '../../../components/RequestRow';

class RequestIndex extends Component {

    static async getInitialProps(props) {
        const { address } = props.query;
        const campaign = Campaign(props.query.address);
        const requestCount = await campaign.methods.getRequestCount().call();
        const approversCount = await campaign.methods.approversCount().call();

        let requests = [];

        if(requestCount > 0) {
            requests = await Promise.all(
                Array(requestCount).fill()
                    .map((ele, idx) => {
                            return campaign.methods.requests(idx).call()
                        }
                    )
            );
        }

        return { address, requests, requestCount, approversCount };
    }

    renderRow() {
        return this.props.requests.map((request, index) => {
           return (
               <RequestRow
                    key={index}
                    id={index}
                    request={request}
                    address={this.props.address}
                    approversCount={this.props.approversCount}
                />
           );
        });
    }

    render() {

        const { Header, Row, HeaderCell, Body } = Table;

        return (
            <Layout>
                <h3>출금요청하기</h3>
                <Link route={`/campaigns/${this.props.address}/requests/new`}>
                    <a>
                        <Button primary>요청 추가</Button>
                    </a>
                </Link>
                <Table>
                    <Header>
                        <Row>
                            <HeaderCell>ID</HeaderCell>
                            <HeaderCell>요청내용</HeaderCell>
                            <HeaderCell>요청금액</HeaderCell>
                            <HeaderCell>수신자주소</HeaderCell>
                            <HeaderCell>승인 수</HeaderCell>
                            <HeaderCell>승인</HeaderCell>
                            <HeaderCell>요청승인</HeaderCell>
                        </Row>
                    </Header>
                    <Body>
                        {this.renderRow()}
                    </Body>
                </Table>
            </Layout>
        );
    }

}

export default RequestIndex;