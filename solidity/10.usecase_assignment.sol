pragma solidity ^0.4.23;

contract Assignments {
    uint[] data;

    function f() public pure returns (uint, bool, uint) {
        return (7, true, 2);
    }

    function g() public {
        // Variables declared with type and assigned from the returned tuple.
        (uint x, bool b, uint y) = f();
        // Common trick to swap values -- does not work for non-value storage types.
        (x, y) = (y, x);
        // Components can be left out (also for variable declarations).
        (data.length,,) = f(); // Sets the length to 7
        // Components can only be left out at the left-hand-side of assignments, with
        // one exception:
        (x,) = (1,);
        // (1,) is the only way to specify a 1-component tuple, because (1) is
        // equivalent to 1.
    }
}