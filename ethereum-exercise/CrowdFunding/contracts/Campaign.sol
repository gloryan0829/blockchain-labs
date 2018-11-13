pragma solidity ^0.4.25;

contract CampaignFactory {
    address[] private campaigns;

    function createCampaign(uint minimum) public {
        address campaign = new Campaign(msg.sender, minimum);
        campaigns.push(campaign);
    }

    function getCampaigns() public view returns (address[]) {
        return campaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) responders;
    }

    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approversCount;

    function Campaign(address mgr, uint minimum) public {
        manager = mgr;
        minimumContribution = minimum;
    }

    function getSummary() public view returns (uint, uint, uint, uint, address) {
        address contractAddress = this;
        return (
            minimumContribution,
            contractAddress.balance,
            requests.length,
            approversCount,
            manager
        );
    }

    function getRequestCount() public view returns (uint) {
        return requests.length;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);
        approvers[msg.sender] = true;

        approversCount ++;
    }

    function createRequest(string description, uint value, address recipient) public restrictedToManager {
        Request memory newRequest = Request({
            description : description,
            value : value,
            recipient : recipient,
            complete : false,
            approvalCount : 0
            });

        requests.push(newRequest);
    }

    function approveRequest(uint index) public {
        require(approvers[msg.sender]);
        Request storage request = requests[index];

        require(!request.responders[msg.sender]);

        request.responders[msg.sender] = true;

        request.approvalCount += 1;
    }

    function finalizeRequest(uint index) public restrictedToManager {
        Request storage request = requests[index];

        require(!request.complete);

        require(request.approvalCount > approversCount / 2);

        request.complete = true;

        request.recipient.transfer(request.value);

    }

    modifier restrictedToManager() {
        require(msg.sender == manager);
        _;
    }
}
