pragma solidity ^0.4.25;

interface calculatorInterface {
    function add(uint num1, uint num2) public pure returns (uint);
    function div(uint num1, uint num2) public pure returns (uint);
    function sub(uint num1, uint num2) public pure returns (uint);
    function mul(uint num1, uint num2) public pure returns (uint);
}

contract StandardCalculator is calculatorInterface {
    function add(uint num1, uint num2) public pure returns (uint){
        return num1 + num2;
    }
    function div(uint num1, uint num2) public pure returns (uint){
        return num1 / num2;
    }
    function sub(uint num1, uint num2) public pure returns (uint){
        return num1 - num2;
    }
    function mul(uint num1, uint num2) public pure returns (uint){
        return num1 * num2;
    }
}

contract CustomizedCalculator is calculatorInterface {
    
    constructor(string _msg) public {
        (_msg);
    }
    
    function mul(uint256 a, uint256 b) public pure returns (uint256) {
        if (a == 0) {
          return 0;
        }
    
        uint256 c = a * b;
        require(c / a == b, 'CustomizedCalculator Error!!!!!');
    
        return c;
    }

    function div(uint256 a, uint256 b) public pure returns (uint256) {
        require(b > 0, 'CustomizedCalculator Error!!!!!');
        uint256 c = a / b;
    
        return c;
    }

    function sub(uint256 a, uint256 b) public pure returns (uint256) {
        require(b <= a, 'CustomizedCalculator Error!!!!!');
        uint256 c = a - b;
    
        return c;
    }

    function add(uint256 a, uint256 b) public pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, 'CustomizedCalculator Error!!!!!');
    
        return c;
    }

    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b != 0, 'CustomizedCalculator Error!!!!!');
        return a % b;
    }
}

contract Child is CustomizedCalculator('parent'), StandardCalculator {
    
    uint public childNum = 1;
    
    constructor () public {
        
    } 
    
    function somethingChange(uint _num1, uint _num2) public pure returns (uint) {
        return mod(1 + add(_num1, _num2), 3); 
    }
}