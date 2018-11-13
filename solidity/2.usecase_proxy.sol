pragma solidity ^0.4.25;

/**
 * @dev call 과 delegatecall의 차이
 *      Sealed Voting Contract
 **/
 
contract VotingProxy {
    
    address[] public voters;
    address public currentVoter;
    mapping (address => bool) public voted;
    mapping (address => uint) public candidates;
    address proxy;
    
    constructor (address _proxy) public {
        proxy = _proxy;
    }
    
    function upgradeTo(address _votingLogic) public returns (bool) {
        require(_votingLogic != address(0x0), '');
        require(_votingLogic != proxy, '');
        
        proxy = _votingLogic;
        
        return true;
    }
    
    function votingCall(address _candidate) public returns (bool) {
        if(! proxy.call(bytes4(keccak256("voting(address)")), abi.encode(_candidate)) ) {
            revert('voting call error....');
            return false;
        }
        return true;
    }
    
    function votingDelegateCall(address _candidate) public returns (bool) {
        proxy.delegatecall(bytes4(keccak256("voting(address)")), abi.encode(_candidate));
        return true;
    }
    
    function getVotingTotalCnt() public view returns (uint) {
        return voters.length;
    }
    
    
}

contract VotingLogic {
    
    address[] public voters;
    address public currentVoter;
    mapping (address => bool) public voted;
    mapping (address => uint) public candidates;
    
    
    function voting(address _candidate) public returns (bool) {
        require(!voted[msg.sender], '이미 투표에 참가하셨습니다.');
        
        voters.push(msg.sender);
        candidates[_candidate] = candidates[_candidate] + 1;
        voted[msg.sender] = true;
        currentVoter = msg.sender;
        
        return true;
    }
    
}