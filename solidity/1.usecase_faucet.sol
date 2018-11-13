pragma solidity ^0.4.25;

/**
 * @dev Whitelist Ether 송금 컨트랙트 구현
 * 
 **/ 
contract SendEtherToWhiteList {
    
    mapping(address => bool) public whitelist;
    
    constructor (address _whiteWallet) public {
        whitelist[_whiteWallet] = true;
    }
    
    function addToWhiteList(address _addr) public returns (bool) {
        require(!whitelist[_addr], "WhiteList에 존재하는 수신자 입니다");
        
        whitelist[_addr] = true;
        
        return true;
    }
    
    function sendEther(address _recipent) public payable returns (bool) {
        require(whitelist[_recipent], "WhiteList에 존재하지 않는 수신자입니다.");
        require(msg.value > 0, "Ether 송금액이 0 이상이여야 합니다.");
        address(_recipent).transfer(msg.value);
        
        return true;
    }
    
}
 
/**
 * @dev Ether Faucet 구현
 * 
 **/
contract EtherFaucet {
    
    address owner;
    mapping(address => uint) public timer;
    event Deposit(uint);
    
    constructor () public {
        owner = msg.sender;
    }
    
    // fallback function
    function () public payable {
       //emit Deposit(msg.value);
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
    
    function withdraw() public returns (bool) {
        //require(timer[msg.sender] < now, "출금이후 1분에 시간이 소요됩니다.");
        //require(address(this).balance >= 0.1 ether, "충분한 금액이 충전 되어있지 않습니다.");
        bool isSuccess = false;
        /**
         * send 는 transfer 의 low-level counterpart 입니다. 
         * 그런데 send 함수 호출이 실패(호출 스택 깊이가 1024 에 도달하거나 가스비 부족)하였을 때 
         * exception 을 발생키지 않고 리턴값만 false 를 발생시킨 후 계속 실행됩니다. 
         * 무조건 2300 가스가 소모된다.
         **/
        // bool isSuccess = msg.sender.send(0.1 ether); // send로 하게 되면 exception이 나오더라도 false 를 출력후 계속 실행한다고 transfer를 사용하라고 나온다.
        
        /**
         * msg.sender 에게 x 만큼의 이더(단위:wei) 전송하라. 
         * msg.sender 의 돈을 빼는 것이 아니라 contract 가 소유한 돈을 msg.sender 에게 전송하는 것이라는 것에 유의. 
         * 참고로 msg.sender 가 스마트콘트랙트인 경우에는 자동으로 fallback 함수가 호출됨. 
         * 무조건 2300 가스가 소모된다.
         **/
        msg.sender.transfer(0.1 ether);
        isSuccess = true;
        
        timer[msg.sender] = now + 1 minutes;
        
        return (isSuccess);
    }
    
}