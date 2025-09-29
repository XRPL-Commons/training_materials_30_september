import { Button, Flex, Image, Tag, VStack, HStack, Text } from '@chakra-ui/react'
import XrplLogo from '../assets/xrpl-logo.svg'
import { useWeb3, useXaman } from '../shared/contexts'

export const Header = () => {
  const { connectWallet: connectMetaMask, disconnect: disconnectMetaMask, account: evmAccount } = useWeb3()
  const { connectXaman, disconnect: disconnectXaman, account: xrplAccount, isConnected: isXamanConnected } = useXaman()

  // Step 1 - Create handlers for MetaMask connection
  const onConnectMetaMaskHandler = () => {
    // TODO: Call connectMetaMask function
    // Hint: connectMetaMask()
  }

  const onDisconnectMetaMaskHandler = () => {
    // TODO: Call disconnectMetaMask function
    // Hint: disconnectMetaMask()
  }

  // Step 2 - Create handlers for Xaman connection
  const onConnectXamanHandler = () => {
    // TODO: Call connectXaman function
    // Hint: connectXaman()
  }

  const onDisconnectXamanHandler = () => {
    // TODO: Call disconnectXaman function
    // Hint: disconnectXaman()
  }

  const isEvmAuthenticated = evmAccount !== ''

  return (
    <Flex justifyContent='space-between' p='5' alignItems='center' shadow='lg'>
      <Image src={XrplLogo} alt='XRP Ledger' height='60px' />

      <HStack spacing={4}>
        {/* MetaMask Connection */}
        {!isEvmAuthenticated ? (
          <Button onClick={onConnectMetaMaskHandler} variant='primary' size='sm'>
            Connect MetaMask
          </Button>
        ) : (
          <VStack spacing={1}>
            <Text fontSize='xs' color='gray.500'>EVM</Text>
            <Tag size='sm'>{evmAccount.slice(0, 6)}...{evmAccount.slice(-4)}</Tag>
            <Button size='xs' onClick={onDisconnectMetaMaskHandler} variant='outline'>
              Disconnect
            </Button>
          </VStack>
        )}

        {/* TODO Step 3 - Add Xaman Connection UI */}
        {/* Hint: Follow the same pattern as MetaMask connection above */}
        {/* Hint: Check !isXamanConnected for the condition */}
        {/* Hint: Use onConnectXamanHandler for connect button */}
        {/* Hint: Use variant='secondary' for Xaman connect button */}
        {/* Hint: For connected state, use colorScheme='orange' for XRPL tag */}
        {/* Hint: Use onDisconnectXamanHandler for disconnect button */}

      </HStack>
    </Flex>
  )
}