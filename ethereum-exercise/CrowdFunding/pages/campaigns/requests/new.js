import React, { Component } from 'react';
import { Form, Button, Message, Input } from 'semantic-ui-react';
import Campaign from '../../../contracts/campaign';
import web3 from '../../../contracts/web3';
import { Link, Router } from '../../../routes';
import Layout from '../../../components/Layout';

class RequestNew extends Component {

    state = {
        value : '',
        description : '',
        recipent : '',
        errorMsg : '',
        loading: false
    };

    constructor(props) {
        super(props);
    }

    static async getInitialProps(props) {
        const { address } = props.query;

        return { address };
    }

    onSubmit = async event => {
      event.preventDefault();
      this.setState({ loading : true });

      const campaign = Campaign(this.props.address);
      const { description, value, recipent } = this.state;

      try {

          const accounts = await web3.eth.getAccounts();
          await campaign.methods.createRequest(
              description,
              web3.utils.toWei(value, 'ether'),
              recipent
          ).send({
              from : accounts[0]
          });

          Router.pushRoute(`/campaigns/${this.props.address}/requests`);

      } catch (err) {
          console.log(err);
          this.setState({ errorMsg : err.message });

      }

        this.setState({ loading : false });

    };

    render () {
        return (
            <Layout>
                <Link route={`/campaigns/${this.props.address}/requests`}>
                    <a>
                        <Button primary>뒤로가기</Button>
                    </a>
                </Link>
                <h3>출금 요청 생성 하기</h3>
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMsg}>
                    <Form.Field>
                        <label>설명</label>
                        <Input
                            value={this.state.description}
                            onChange={event => this.setState({ description : event.target.value })}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>출금요청금액(Ether)</label>
                        <Input
                            value={this.state.value}
                            onChange={event => this.setState({ value : event.target.value })}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>수신 주소</label>
                        <Input
                            value={this.state.recipent}
                            onChange={event => this.setState({ recipent : event.target.value })}
                        />
                    </Form.Field>
                    <Button loading={this.state.loading} primary>생성하기</Button>
                    <Message error header="<ERROR>" content={this.state.errorMsg} />
                </Form>
            </Layout>
        );
    }
}

export default RequestNew;