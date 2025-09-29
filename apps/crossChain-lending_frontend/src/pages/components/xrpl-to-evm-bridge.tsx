import {
  Alert,
  AlertIcon,
  Button,
  Card,
  CardBody,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  VStack,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useWeb3, useXaman } from '../../shared/contexts'

export const XRPLToEVMBridge = () => {
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)

  const { bridgeToEVM, isConnected: isXamanConnected, account: xrplAccount } = useXaman()
  const { account: evmAccount } = useWeb3()

  const onBridgeHandler = async () => {
    // TODO: Add validation checks
    // Hint: Check if both wallets are connected and amount is entered
    // Hint: if (!isXamanConnected || !evmAccount || !amount) { alert('...'); return; }

    setIsLoading(true)
    setTxHash(null)

    try {
      // TODO: Call bridgeToEVM with amount and EVM address
      // Hint: const hash = await bridgeToEVM(amount, evmAccount)

      // TODO: Handle the result
      // Hint: if (hash) { setTxHash(hash); setAmount(''); alert('Success!'); }
      // Hint: else { alert('Transaction cancelled'); }

    } catch (error) {
      console.error('Bridge error:', error)
      // TODO: Show error message to user
      // Hint: alert('Bridge failed: ' + (error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isXamanConnected) {
    return (
      <Card>
        <CardBody>
          <Alert status='warning'>
            <AlertIcon />
            Connect Xaman wallet to bridge from XRPL to EVM
          </Alert>
        </CardBody>
      </Card>
    )
  }

  if (!evmAccount) {
    return (
      <Card>
        <CardBody>
          <Alert status='warning'>
            <AlertIcon />
            Connect MetaMask wallet to receive tokens on EVM
          </Alert>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card>
      <CardBody>
        <VStack spacing={4}>
          <Heading size='md'>Bridge XRPL → EVM</Heading>

          <FormControl>
            <FormLabel>Amount (XRP)</FormLabel>
            <Input
              type='number'
              placeholder='Enter amount to bridge'
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </FormControl>

          <Flex direction='column' gap={2} w='full'>
            <Button
              onClick={onBridgeHandler}
              isLoading={isLoading}
              loadingText='Bridging...'
              variant='primary'
              isDisabled={!amount || isLoading}
            >
              Bridge to EVM
            </Button>
          </Flex>

          {txHash && (
            <Alert status='success'>
              <AlertIcon />
              Bridge transaction submitted: {txHash.slice(0, 10)}...
            </Alert>
          )}
        </VStack>
      </CardBody>
    </Card>
  )
}