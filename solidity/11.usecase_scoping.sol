pragma solidity ^0.4.16;
//pragma experimental "v0.5.0";

contract ScopingErrors {
    function scoping() public {
        uint i = 0;

        while (i++ < 1) {
            uint same1 = 0;
        }

        while (i++ < 2) {
            uint same1 = 0;// Illegal, second declaration of same1
        }
    }

    function minimalScoping() public {
        {
            uint same2 = 0;
        }

        {
            uint same2 = 0;// Illegal, second declaration of same2
        }
    }

    function forLoopScoping() public {
        for (uint same3 = 0; same3 < 1; same3++) {
        }

        for (uint same3 = 0; same3 < 1; same3++) {// Illegal, second declaration of same3
        }
    }
}

contract Scope1 {
    function foo() public pure returns (uint) {
        // baz is implicitly initialized as 0
        uint bar = 5;
        if (true) {
            //bar += baz;
        } else {
            uint baz = 10;// never executes
        }
        return bar;// returns 5
    }
}

contract Scope2 {
    function f() pure public returns (uint) {
        uint x = 1;
        {
            x = 2; // this will assign to the outer variable
            uint x = 0;
        }
        return x; // x has value 2
    }
}