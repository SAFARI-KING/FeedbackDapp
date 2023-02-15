// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import 'hardhat/console.sol';

contract Feedback {
constructor(){
    console.log('Live!');
}

// string feedback;

event NewFeedback(address indexed from, uint256 timestamp, string message);

struct Feedbacks {
    address user;
    string feedback;
    uint256 timestamp;
}

Feedbacks[] feedbacks;

function setFeedback(string memory message) public{
    feedbacks.push(Feedbacks(msg.sender, message, block.timestamp));
    emit NewFeedback(msg.sender, block.timestamp, message);
}

// function getFeedback() public view returns(string memory){
//     return feedback;
// }

// function setAllFeedback() public{
//    feedbacks.push(feedback);
// }

function getAllFeedback() public view returns(Feedbacks[] memory){
    return feedbacks;
}

}