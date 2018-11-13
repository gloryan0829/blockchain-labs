pragma solidity ^0.4.25;

contract DataAllocation {
    
    uint[] x; // 상태 변수는 storage 저장된다.

    // memoryArray 는 memory 에 저장된다.
    function f(uint[] memory memoryArray, uint _a) public returns (uint, uint[], uint[]) {
        
        uint c = _a;
        uint[] memory z = memoryArray;
        x = memoryArray; // works, 전체 array 데이타가 x 로 복사된다.
        
        uint[] storage y = x; // works, 포인터로서 참조만 한다.
        
        //y[7]; // fine
        //x.length = 2; // fine, x 의 길이도 수정된다.
        
        delete x; // fine, array 가 지워지며 y 또한 반영된다.
        delete memoryArray;
        delete _a;
        
        g(x); // 상태변수 to storage. 참조만 일어난다.
        h(x); // 상태변수(storage) to memory. 복사가 일어난다.
        
        return (c, z, x); // memory, storage
    }

    function g(uint[] storage storageArray) internal {}
    function h(uint[] memoryArray) public {}
    
}


contract DeleteExample {
    uint data = 2;
    uint[] dataArray = [1,2,3,4,5,6,7];

    function f() public returns (uint, uint, uint[]) {
        uint x = data;
        //delete x; // sets x to 0, does not affect data
        delete data; // sets data to 0, does not affect x which still holds a copy
        uint[] storage y = dataArray;
        delete dataArray; // this sets dataArray.length to zero, but as uint[] is a complex object, also
        // y is affected which is an alias to the storage object
        // On the other hand: "delete y" is not valid, as assignments to local variables
        // referencing storage objects can only be made from existing storage objects.
        return (x, data, y);
    }
}
