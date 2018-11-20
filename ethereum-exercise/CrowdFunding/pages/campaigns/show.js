import React, { Component } from 'react';

import Layout from '../../components/Layout';
import Campaign from '../../contracts/campaign';
import web3 from '../../contracts/web3';
import { Card, Grid , Button } from 'semantic-ui-react';
import ContributeForm from '../../components/ContributeForm';
import { Link } from '../../routes';


class CampaignShow extends Component {

    constructor(props) {
        super(props);
    }

    static async getInitialProps(props) {
        console.log(props.query.address);

        const campaign = Campaign(props.query.address);

        const summary = await campaign.methods.getSummary().call();

        return {
            address : props.query.address,
            minimumContribution : summary['0'],
            balance : summary['1'],
            requestsCount : summary['2'],
            approversCount : summary['3'],
            manager : summary['4']
        };
    }

    renderCampaignCard() {

        const {
            address,
            minimumContribution,
            balance,
            requestsCount,
            approversCount,
            manager
        } = this.props;

        const items = [
            {
                header: manager,
                meta: '캠페인 매니저',
                description: '캠페인 매니저의 EOA 계정',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: minimumContribution,
                meta: '최소 참여 단 (wei)',
                description: '참여 최소 금액 (wei)'
            },
            {
                header: requestsCount,
                meta: '출금 요청 횟수',
                description: '참여자들에 과반수 이상의 동의에 의해 진행되는 출금 요청'
            },
            {
                header: approversCount,
                meta: '참여자 횟수',
                description: '캠페인에 기부(참여)한 수'
            },
            {
                header: web3.utils.fromWei(balance, 'ether'),
                meta: '모금된 금액 (ether)',
                description: '참여자들로부터 모금된 금액.'
            }
        ];

        return <Card.Group items={items}/>;
    }

    render() {
        return (
            <Layout>
                <h3>캠페인 상세보기</h3>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={10}>
                            {this.renderCampaignCard()}
                        </Grid.Column>
                        <Grid.Column width={6}>
                            <ContributeForm address={this.props.address}/>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Link route={`/campaigns/${this.props.address}/requests`}>
                                <a>
                                    <Button primary>
                                        요청 보기
                                    </Button>
                                </a>
                            </Link>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Layout>
        );
    }

}

export default CampaignShow;