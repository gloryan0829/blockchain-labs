import React, { Component } from 'react';
import {Form, Input, Button, Message} from 'semantic-ui-react';
import factory from '../../contracts/factory';
import Layout from '../../components/Layout';
import web3 from '../../contracts/web3';
import { Router } from '../../routes';

class CampaignNew extends Component {

    constructor(props) {
        super(props);
        this.state = {
            minimumContribution: 0,
            errorMsg : '',
            loading: false
        };
    }

    onSubmit = async (event) => {
        event.preventDefault();

        this.setState({ loading : true });

        try {
            const accounts = await web3.eth.getAccounts();
            console.log(accounts);
            await factory.methods.createCampaign(this.state.minimumContribution).send({
                    from : accounts[0]
            }).on('transactionHash', function(hash){
                console.log('hash >> ', hash);
            }).on('receipt', function(receipt){
                console.log('receipt >> ', receipt);
            }).on('confirmation', function(confirmationNumber, receipt){
                console.log('confirmation >> ', confirmationNumber);
                if(confirmationNumber === 24) { console.log('완료') }
            }).on('error', console.error);

            // 인덱스 페이지로 이동...
            Router.pushRoute('/');
        } catch (err) {
            console.log(err);
            this.setState({ errorMsg : err.message });
        }

        this.setState({ loading : false });
    };

    render() {
        return (
            <Layout>
                <h4>펀딩 만들기</h4>
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMsg}>
                    <Form.Field>
                        <label>최소 펀딩 금액</label>
                        <Input
                            label="wei"
                            labelPosition="right"
                            placeholder='최소 금액을 설정'
                            value={this.state.minimumContribution}
                            onChange={event => this.setState({minimumContribution:event.target.value})}
                        />
                    </Form.Field>
                    <Button loading={this.state.loading} primary>만들기</Button>
                    <Message error header="<ERROR>" content={this.state.errorMsg} />
                </Form>
            </Layout>
        );
    }
}

export default CampaignNew;