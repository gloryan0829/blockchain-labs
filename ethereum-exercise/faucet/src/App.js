import React, { Component } from 'react';
import UserAccount from './user';

const user = new UserAccount();

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            _pubKey : '',
            _priKey : ''
        };
        this.onCreateAccount = this.onCreateAccount.bind(this);
        this.onReceiveEther = this.onReceiveEther.bind(this);
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     const vitalStateChange = this.state._pubKey !== nextState._pubKey;
    //     return vitalStateChange;
    // }

    componentDidMount(){
        this.setState({
            _pubKey : user.getMyAccount()['_pubKey'],
            _priKey : user.getMyAccount()['_priKey']
        })
    }

    onCreateAccount() {
        if(this.state._priKey) {
            let confirm = window.confirm('기존 Account가 존재합니다. 다시 만드시겠습니까');
            if(confirm) {
                let result = user.createAccount();
                this.setState({
                    _pubKey : result['_pubKey'],
                    _priKey : result['_priKey']
                })
            }
        } else {
            let result = user.createAccount();
            this.setState({
                _pubKey : result['_pubKey'],
                _priKey : result['_priKey']
            })
        }
        alert('계정이 생성되었습니다');
        window.location.reload();
    }

    onReceiveEther() {

    }

    render() {
        return (
          <div>
              <h2>FastCampus 2nd School Faucet & New Account</h2>
              <hr />
                 <h3>현재 계정 Address : {this.state._pubKey} <br/>
                    현재 계정 Private Key : {this.state._priKey}
                    <button onClick={this.onCreateAccount}>계정생성하기</button>
                </h3>
              <hr />
                <h3>Ether faucet</h3>
                  <button onClick={this.onReceiveEther}>이더받기</button>
          </div>
        );
    }
}

export default App;