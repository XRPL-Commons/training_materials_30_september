// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/SimpleBank.sol"; // adjust import path if needed

contract SimpleBankTest is Test {
  SimpleBank public bank;
  address public owner;
  address public user1;
  address public user2;

  function setUp() public {
    owner = address(this); // Test contract is default sender
    user1 = makeAddr("user1");
    user2 = makeAddr("user2");

    bank = new SimpleBank();
  }

  // --- Deployment ---
  function test_OwnerIsSetCorrectly() public view {
    assertEq(bank.owner(), owner);
  }

  // --- Deposits ---
  function test_DepositIncreasesBalance() public {
    uint256 depositAmount = 1 ether;

    vm.expectEmit(true, true, false, true);
    emit Deposited(owner, depositAmount);

    bank.deposit{value: depositAmount}();

    assertEq(bank.getBankBalance(), depositAmount);
    assertEq(bank.balances(owner), depositAmount);
  }

  // --- Loans ---
  function test_UserCanTakeLoan() public {
    uint256 depositAmount = 5 ether;
    uint256 loanAmount = 1 ether;

    bank.deposit{value: depositAmount}();

    vm.deal(user1, 1 ether); // give user some ETH to start (not used for loan, but for gas)
    vm.prank(user1);

    vm.expectEmit(true, true, false, true);
    emit Loaned(user1, loanAmount);

    bank.loan(loanAmount);

    assertEq(bank.loans(user1), loanAmount);
    assertEq(bank.balances(owner), depositAmount - loanAmount);
    assertEq(user1.balance, loanAmount + 1 ether); // received loan
  }

  function test_LoanFailsIfBankEmpty() public {
    vm.prank(user1);
    vm.expectRevert("Bank does not have sufficient funds");
    bank.loan(1 ether);
  }

  function test_LoanFailsIfZeroAmount() public {
    uint256 depositAmount = 2 ether;
    bank.deposit{value: depositAmount}();

    vm.prank(user1);
    vm.expectRevert("Loan amount should be greater than 0");
    bank.loan(0);
  }

  // --- Repayments ---
  function test_UserCanRepayLoan() public {
    uint256 depositAmount = 5 ether;
    uint256 loanAmount = 1 ether;

    bank.deposit{value: depositAmount}();
    vm.deal(user1, 2 ether);

    vm.prank(user1);
    bank.loan(loanAmount);

    assertEq(user1.balance, 3 ether); // got loan
    vm.prank(user1);
    vm.expectEmit(true, true, false, true);
    emit LoanRepaid(user1, loanAmount);
    bank.repayLoan{value: loanAmount}();

    assertEq(bank.loans(user1), 0);
    assertEq(bank.balances(owner), depositAmount);
  }

  function test_RepayFailsIfNoLoan() public {
    vm.deal(user1, 1 ether);
    vm.prank(user1);
    vm.expectRevert("You do not have an outstanding loan");
    bank.repayLoan{value: 1 ether}();
  }

  function test_RepayFailsIfWrongAmount() public {
    uint256 depositAmount = 5 ether;
    uint256 loanAmount = 1 ether;

    bank.deposit{value: depositAmount}();
    vm.deal(user1, 2 ether);
    vm.prank(user1);
    bank.loan(loanAmount);

    vm.prank(user1);
    vm.expectRevert("Must repay the exact loan amount");
    bank.repayLoan{value: 0.5 ether}();
  }

  // --- Withdrawals ---
  function test_NonOwnerCannotWithdraw() public {
    vm.prank(user1);
    vm.expectRevert("Only owner can call this function");
    bank.withdraw();
  }

  // --- Events ---
  event Deposited(address indexed user, uint256 amount);
  event Loaned(address indexed user, uint256 amount);
  event LoanRepaid(address indexed user, uint256 amount);
  event Withdrawn(address indexed user, uint256 amount);
}
