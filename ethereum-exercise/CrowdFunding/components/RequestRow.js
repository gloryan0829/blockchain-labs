import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';
import web3 from '../contracts/web3';
import Campaign from '../contracts/campaign';
import { Router } from '../routes';

class RequestRow extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false
        };
    }

    onApprove = async () => {
        this.setState({loading : true});
        const campaign = Campaign(this.props.address);
        const accounts = await web3.eth.getAccounts();
        await campaign.methods.approveRequest(this.props.id).send({
            from : accounts[0]
        });
        this.setState({loading : false});
        Router.pushRoute(`/campaigns/${this.props.address}/requests`);
    };

    onFinalize = async () => {
        this.setState({loading : true});

        const campaign = Campaign(this.props.address);
        const accounts = await web3.eth.getAccounts();
        await campaign.methods.finalizeRequest(this.props.id).send({
            from : accounts[0]
        });

        this.setState({loading : false});
        Router.pushRoute(`/campaigns/${this.props.address}/requests`);
    };

    render() {

        const { Row, Cell } = Table;
        console.log(this.props);
        return (
            <Row>
                <Cell>{this.props.id + 1}</Cell>
                <Cell>{this.props.request.description}</Cell>
                <Cell>{web3.utils.fromWei(this.props.request.value,'ether')} ETH</Cell>
                <Cell>{this.props.request.recipient}</Cell>
                <Cell>{this.props.request.approvalCount} / {this.props.approversCount}</Cell>
                <Cell>
                    {this.props.request.complete ? null : (
                        <Button color="green" basic loading={this.state.loading} onClick={this.onApprove}>승인</Button>
                    )}
                </Cell>
                <Cell>
                    {this.props.request.complete ? <p>출금완료됨</p> : (
                    <Button color="red" basic loading={this.state.loading} onClick={this.onFinalize}>출금하기</Button>
                    )}
                </Cell>
            </Row>
        );
    }
}

export default RequestRow;