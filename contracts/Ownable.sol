pragma solidity ^0.5.0;

contract Ownable {
  // state variables
  address payable owner;

  // modifiers
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  // constructor
  constructor() public {
    owner = msg.sender;
  }
}
