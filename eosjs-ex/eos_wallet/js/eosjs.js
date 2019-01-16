const config = {
    httpEndpoint : 'http://39.108.231.157:30065',
    chainId : '5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191'
}

function getAccountInfo() {
    document.getElementById('info').style.display = 'none';
    document.getElementById('error').style.display = 'none';
 

    const accountName = document.getElementById('accountName').value
    if(accountName) {
        Eos(config).getAccount(accountName).then(account => {
            document.getElementById('account').innerHTML = account.account_name;

            const stake = account.voter_info ? account.voter_info.staked / 10000: 0;
            const unstake = Number(account.core_liquid_balance.replace('EOS', ''));
            const refund = account.refund_request ? 
                Number(account.refund_request.net_amount.replace('EOS', '')) + Number(account.refund_request.cpu_amount.replace('EOS', '')) : 0;

            const total = stake + unstake + refund;

            document.getElementById('stake').innerHTML = stake + ' EOS';
            document.getElementById('total').innerHTML = total + ' EOS';
            document.getElementById('unstake').innerHTML = unstake + ' EOS';
            document.getElementById('refund').innerHTML = refund + ' EOS';

            document.getElementById('cpu').innerHTML = 
                account.cpu_limit.used + 'up / ' + account.cpu_limit.max + 'up (' + account.total_resources.cpu_weight + ')';

            document.getElementById('net').innerHTML = 
                account.net_limit.used + 'bytes / ' + account.net_limit.max + 'bytes (' + account.total_resources.net_weight + ')';
            
            document.getElementById('ram').innerHTML = 
                account.ram_usage + 'bytes / ' + account.ram_quota + 'bytes';


            document.getElementById('info').style.display = 'block';
        }).catch(e => {
            document.getElementById('error').style.display = 'block';
            document.getElementById('errorMessage').innerHTML = 'EOS Account Name을 입력해주세요.';
        })
    }else {
        document.getElementById('error').style.display = 'block';
        document.getElementById('errorMessage').innerHTML = 'EOS Account Name을 입력해주세요.';
    }
}

function transfer(e) {
    document.getElementById('error').style.display = 'none';
    document.getElementById('success').style.display = 'none';
 
    const to = document.getElementById('to').value;
    const quantity = document.getElementById('quantity').value;
    const memo = document.getElementById('memo').value;
    const privateKey = document.getElementById('privateKey').value;

    const from = document.getElementById('account').innerHTML;

    if(to && quantity && privateKey && from) {
        config.keyProvider = privateKey;
        Eos(config).transaction('eosio.token', coin => {
            coin.transfer(from, to, Number(quantity).toFixed(4) + ' EOS', memo)
        }).then(result => {
            document.getElementById('success').style.display = 'block';
            document.getElementById('successMessage').innerHTML = 'TX_Id : <a target="_blank" href="http://tools.cryptokylin.io/#/tx/'+result.transaction_id+'">' + result.transaction_id + '</a>';
            getAccountInfo();
        }).catch(error => {
            document.getElementById('error').style.display = 'block';
            document.getElementById('errorMessage').innerHTML = '필수 값이 입력되지 않았습니다.';
        });
    } else {
        document.getElementById('error').style.display = 'block';
        document.getElementById('errorMessage').innerHTML = '필수 값이 입력되지 않았습니다.';
    }
    
}