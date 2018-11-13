import React, { Component } from 'react';
import factory from '../contracts/factory';
import { Button, Card } from 'semantic-ui-react';
import Layout from '../components/Layout';

const CardExampleGroupProps = () => <Card.Group items={items} />

class CampaignIndex extends Component {

    static async getInitialProps() {
        const campaigns = await factory.methods.getCampaigns().call();

        return {
            campaigns
        }
    }

    renderCampaign() {

        const items = this.props.campaigns.map(address => {
            return {
                header : address,
                description : <a>펀딩 리스트</a>,
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
                    <Button
                        content="크라우드펀딩 생성"
                        icon="add circle"
                        color="orange"
                        floated="right"
                    />
                </div>
            </Layout>
        );
    }
}

export default CampaignIndex;