pragma solidity ^0.4.22;

contract Purchase {
    address public seller;
    address public owner;
    
    constructor () public {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(
            msg.sender == owner, 
            "Only Owner can controll this."        
        );
        _;
    }

    modifier onlySeller() { // Modifier
        require(
            msg.sender == seller,
            "Only seller can call this."
        );
        _;
    }
    
    function abort() public view onlySeller onlyOwner { // Modifier usage
        // ...
    }

}

contract ModifierTest { 
    
    uint a= 1;
    
    modifier checkOneToTwo {
        require(a == 1, "a must be 1");
        _;
        require(a == 2, "a must change to 2");
    }
    
    function fun1() public checkOneToTwo { 
        a= 2;
    }
    
    function fun2() public {
        require(a == 1, "a must be 1");
        a= 2;
        require(a == 2, "a must change to 2");
    } 
    
}