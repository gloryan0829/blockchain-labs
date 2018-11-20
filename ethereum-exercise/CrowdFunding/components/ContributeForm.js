import React, { Component } from 'react';
import { Form, Input, Message, Button } from 'semantic-ui-react';
import Campaign from '../contracts/campaign';
import web3 from '../contracts/web3';
import { Router } from '../routes';

class ContributeForm extends Component {

    state = {
        value : '',
        errorMsg : '',
        loading : false
    };

    onSubmit = async (event) => {
      event.preventDefault();
      console.log(this.props.address);
      const campaign = Campaign(this.props.address);
      this.setState({ loading: true });

      try {
          const accounts = await web3.eth.getAccounts();

          await campaign.methods.contribute().send({
              from : accounts[0],
              value : web3.utils.toWei(this.state.value, 'ether')
          });

          Router.replaceRoute(`/campaigns/${this.props.address}`);
      } catch (err) {
          console.error(err);
          this.setState({ errorMsg: err.message });
      }

        this.setState({ loading: false, value: '' });

    };

    render() {
        return (
            <Form onSubmit={this.onSubmit} error={!!this.state.errorMsg}>
                <Form.Field>
                    <label>참여 금액</label>
                    <Input
                        value={this.state.value}
                        onChange={event => this.setState({ value : event.target.value })}
                        labelPosition="right"
                        label="ether"
                    />
                </Form.Field>

                <Button primary loading={this.state.loading}>참여하기!</Button>
                <Message error header="<에러>" content={this.state.errorMsg}/>
            </Form>
        );
    }
}

export default ContributeForm;