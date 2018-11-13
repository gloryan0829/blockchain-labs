pragma solidity ^0.4.25;

contract ArrayTest {
    
    struct User {
        string userId;
        string userNm;
        uint userNum;
    }
    
    User[] public users;
    address owner;
    
    event DeleteUser(string indexed, string, uint indexed);
    
    constructor() public {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(owner == msg.sender, 'msg.sender is not an owner...');
        _;
    }
    
    function remove(uint _idx) public returns(bool) {
        require( users.length - 1 >= _idx , 'check the index of array ...');
        
        User memory tempUser = users[users.length-1];
        
        emit DeleteUser(users[_idx].userId, users[_idx].userNm, users[_idx].userNum);
        
        delete users[_idx];
        
        users[_idx] = tempUser;
        
        users.length = users.length - 1;
        
        return true;
    }
    
    function register(string _userId, string _userNm, uint _userNum) public onlyOwner returns(bool) {
        users.push(
            User({userId : _userId, userNm : _userNm, userNum : _userNum})
        );
        return true;
    }
    
    function userSize() public view returns (uint) {
        return users.length;
    }
    
}