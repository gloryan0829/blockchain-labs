import React, { Component } from 'react';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            manager: '',
            players: [],
            balance: '',
            value : '',
            message : ''
        };

        this.onSubmit = this.onSubmit.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    async componentDidMount() {
        const manager = await lottery.methods.manager().call();
        const players = await lottery.methods.getPlayers().call();
        const balance = await web3.eth.getBalance(lottery.options.address);
        this.setState({manager, players, balance});
        console.log(this.state);

    }
    onSubmit = async (evt) => {
        console.log(evt);
        evt.preventDefault();

        const accounts = await web3.eth.getAccounts();
        console.log(accounts[0]);

        this.setState({ message : '트랜잭션 처리중...' })
        console.log(web3.utils.toWei(this.state.value, 'ether'));

        let receiptObj = await lottery.methods.enter().send({
            from : accounts[0],
            value : web3.utils.toWei(this.state.value, 'ether')
        });

        console.log(receiptObj);

        this.setState({ message : '트랜잭션이 성공 되었습니다' });
    };

    onClick = async (evt) => {
        evt.preventDefault();

        const accounts = await web3.eth.getAccounts();

        this.setState({ message : '트랜잭션 처리중...' });

        await lottery.methods.pickWinner().send({
            from : accounts[0]
        });

        this.setState({ message : '당첨자가 선정되었습니다.' });
    };

    render() {
        return (
            <div>
              <h2>로또 dApp</h2>
                <p>
                    관리자 Address : {this.state.manager} <br/>
                    Player 참가자 수 : {this.state.players.length} <br/>
                    상금액 : {web3.utils.fromWei(this.state.balance, 'ether')} ether <br/>
                </p>

                <hr/>

                <form onSubmit={this.onSubmit}>
                    <h4>로또 참가하기</h4>
                    <div>
                        <label>금액 입력</label>
                        <input
                            value = {this.state.value}
                            onChange={evt => this.setState({ value : evt.target.value })}
                        />
                    </div>
                    <button>입력</button>
                </form>

                <hr/>

                <h4>메시지 : {this.state.message}</h4>

                <hr/>

                <button onClick={this.onClick}>당첨자 선정하기!</button>
            </div>
        );
    }
}
export default App;