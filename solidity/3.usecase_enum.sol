pragma solidity ^0.4.16;

/**
 * 
 * @dev enum type...
 * 
 **/ 
contract EnumType {
    
    enum ActionChoices { GoLeft, GoRight, GoStraight, SitStill }
    
    ActionChoices choice;
    ActionChoices constant defaultChoice = ActionChoices.GoStraight;

    function setGoStraight() public {
        choice = ActionChoices.GoStraight;
    }

    // enum 은 ABI 로 표현되지 않기 때문에 "getChoice" 의 signature 는 
    // 자동으로 "getChoice() returns (uint8)" 로 변경됩니다.
    // 만약 enum 밸류가 큰 값이 필요한 경우에는
    // 자동으로 더 크게, 예를 들어 unit16 등으로 변경됩니다.
    function getChoice() public view returns (ActionChoices) {
        return choice;
    }

    function getDefaultChoice() public pure returns (uint) {
        return uint(defaultChoice);
    }
}
