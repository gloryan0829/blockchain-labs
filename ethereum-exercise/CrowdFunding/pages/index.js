import React, { Component } from 'react';
import factory from '../contracts/factory';
import { Button, Card } from 'semantic-ui-react';
import Layout from '../components/Layout';
import { Link } from '../routes';

const CardExampleGroupProps = () => <Card.Group items={items} />

class CampaignIndex extends Component {

    static async getInitialProps() {
        const campaigns = await factory.methods.getCampaigns().call();
        console.log(campaigns);
        return {
            campaigns
        }
    }

    renderCampaign() {

        const items = this.props.campaigns.map(address => {
            return {
                header : address,
                description : (
                    <Link route={`/campaigns/${address}`}>
                        <a>캠페인 상세보기</a>
                    </Link>
                ),
                fluid : true
            };
        });

        return <Card.Group items={items} />;
    }

    render() {
        return (
            <Layout>
                <div>
                    {this.renderCampaign()}
                    <Link route="/campaigns/new">
                        <Button
                            content="크라우드펀딩 생성"
                            icon="add circle"
                            color="orange"
                            floated="right"
                        />
                    </Link>
                </div>
            </Layout>
        );
    }
}

export default CampaignIndex;