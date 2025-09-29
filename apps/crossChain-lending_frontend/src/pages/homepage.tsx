import { Button, Container, Flex, Heading, Text } from '@chakra-ui/react'
import { useWeb3 } from '../shared/contexts'
import {
  BankBalance,
  BorrowedBalance,
  Deposit,
  EVMToXRPLBridge,
  Lend,
  Repay,
  XRPLToEVMBridge,
} from './components'

export const HomePage = () => {
  const { contract, isOwner } = useWeb3()

  const onWithdrawHandler = async () => {
    // TODO: Add contract check and call withdraw
    // Hint: if (!contract) return
    // Hint: await contract.withdraw()
  }

  if (!contract) {
    return (
      <Container>
        <Flex py='20' gap='8' justifyContent='center' alignItems='center'>
          <Text>Connect Metamask</Text>
        </Flex>
      </Container>
    )
  }

  return (
    <Container maxW='6xl'>
      <Flex direction='column' py='20' gap='8' justifyContent='center' alignItems='center'>
        <Heading size='xl'>Cross-Chain Lending & Borrowing</Heading>

        {/* TODO: Add Bridge Section */}
        {/* Hint: Create a Flex with direction='column', gap={4}, w='full', alignItems='center' */}
        {/* Hint: Add Heading size='lg' with text 'Bridge Tokens' */}
        {/* Hint: Add another Flex with gap={4}, wrap='wrap', justify='center' containing: */}
        {/* Hint: <EVMToXRPLBridge /> and <XRPLToEVMBridge /> */}

        {/* Lending Section */}
        <Flex direction='column' gap={4} w='full' alignItems='center'>
          <Heading size='lg'>Lending Operations</Heading>
          {isOwner ? (
            <Flex gap={4} alignItems='center'>
              <BankBalance />
              <Button variant='outline' onClick={onWithdrawHandler}>
                Withdraw
              </Button>
            </Flex>
          ) : (
            <BorrowedBalance />
          )}
          {isOwner ? (
            <Deposit />
          ) : (
            <Flex gap={4}>
              <Lend />
              <Repay />
            </Flex>
          )}
        </Flex>
      </Flex>
    </Container>
  )
}