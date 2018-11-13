pragma solidity ^0.4.21;

contract SimpleAuction {
    
    event HighestBidIncreased(address indexed bidder, uint amount); // Event

    function bid() public payable {
        emit HighestBidIncreased(msg.sender, msg.value); // Triggering event
    }
}