pragma solidity ^0.4.24;

contract Calculator {
    
    using SafeMath for uint8;
    
    function add(uint8 a, uint8 b) public pure returns(uint8 added) {
        added = a+b;
    }
    
    function safeAdd(uint8 a, uint8 b) public pure returns(uint8 added) {
        added = a.add(b);
    }
    
    function safeSub(uint8 a, uint8 b) public pure returns(uint8) {
        return a.sub(b);
    }
    
    function safeMul(uint8 a, uint8 b) public pure returns(uint8) {
        return SafeMath.sub(a, b);
    }
    
    function safeDiv(uint8 a, uint8 b) public pure returns(uint8) {
        return SafeMath.div(a, b);
    }
    
    
}

/**
 * @title SafeMath
 * @dev Math operations with safety checks that revert on error
 */
library SafeMath {

  /**
  * @dev Multiplies two numbers, reverts on overflow.
  */
  function mul(uint8 a, uint8 b) internal pure returns (uint8) {
    // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
    // benefit is lost if 'b' is also tested.
    // See: https://github.com/OpenZeppelin/openzeppelin-solidity/pull/522
    if (a == 0) {
      return 0;
    }

    uint8 c = a * b;
    require(c / a == b);

    return c;
  }

  /**
  * @dev Integer division of two numbers truncating the quotient, reverts on division by zero.
  */
  function div(uint8 a, uint8 b) internal pure returns (uint8) {
    require(b > 0); // Solidity only automatically asserts when dividing by 0
    uint8 c = a / b;
    // assert(a == b * c + a % b); // There is no case in which this doesn't hold

    return c;
  }

  /**
  * @dev Subtracts two numbers, reverts on overflow (i.e. if subtrahend is greater than minuend).
  */
  function sub(uint8 a, uint8 b) internal pure returns (uint8) {
    require(b <= a);
    uint8 c = a - b;

    return c;
  }

  /**
  * @dev Adds two numbers, reverts on overflow.
  */
  function add(uint8 a, uint8 b) internal pure returns (uint8) {
    uint8 c = a + b;
    require(c >= a);

    return c;
  }

  /**
  * @dev Divides two numbers and returns the remainder (unsigned integer modulo),
  * reverts when dividing by zero.
  */
  function mod(uint8 a, uint8 b) internal pure returns (uint8) {
    require(b != 0);
    return a % b;
  }
}