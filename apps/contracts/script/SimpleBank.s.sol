// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {Script} from "forge-std/Script.sol";
import {SimpleBank} from "../src/SimpleBank.sol";

contract SimpleBankScript is Script {
  SimpleBank public simpleBank;

  function setUp() public {}

  function run() public {
    vm.startBroadcast();

    simpleBank = new SimpleBank();

    vm.stopBroadcast();
  }
}
