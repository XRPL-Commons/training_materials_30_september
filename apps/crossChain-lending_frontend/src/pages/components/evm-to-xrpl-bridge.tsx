import { Button, Card, CardBody, Flex, FormControl, FormLabel, Heading, Input, VStack, Alert, AlertIcon } from '@chakra-ui/react'
import { useState } from 'react'
import { useXaman, useWeb3 } from '../../shared/contexts'

export const EVMToXRPLBridge = () => {
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)

  const { bridgeToXRPL, account: evmAccount } = useWeb3()
  const { isConnected: isXamanConnected, account: xrplAccount } = useXaman()

  const onBridgeHandler = async () => {
    // TODO: Add validation checks
    // Hint: Check if both wallets are connected and amount is entered
    // Hint: if (!evmAccount || !isXamanConnected || !amount || !xrplAccount) { alert('...'); return; }

    setIsLoading(true)
    setTxHash(null)

    try {
      // TODO: Call bridgeToXRPL with amount and XRPL address
      // Hint: const hash = await bridgeToXRPL(amount, xrplAccount)

      // TODO: Handle the result
      // Hint: if (hash) { setTxHash(hash); setAmount(''); alert('Success!'); }
      // Hint: else { alert('Transaction failed'); }

    } catch (error) {
      console.error('Bridge error:', error)
      // TODO: Show error message to user
      // Hint: alert('Bridge failed: ' + (error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  if (!evmAccount) {
    return (
      <Card>
        <CardBody>
          <Alert status="warning">
            <AlertIcon />
            Connect MetaMask wallet to bridge from EVM to XRPL
          </Alert>
        </CardBody>
      </Card>
    )
  }

  if (!isXamanConnected) {
    return (
      <Card>
        <CardBody>
          <Alert status="warning">
            <AlertIcon />
            Connect Xaman wallet to receive tokens on XRPL
          </Alert>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card>
      <CardBody>
        <VStack spacing={4}>
          <Heading size="md">Bridge EVM → XRPL</Heading>

          <FormControl>
            <FormLabel>Amount (XRP)</FormLabel>
            <Input
              type="number"
              placeholder="Enter amount to bridge"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </FormControl>

          <Flex direction="column" gap={2} w="full">
            <Button
              onClick={onBridgeHandler}
              isLoading={isLoading}
              loadingText="Bridging..."
              variant="secondary"
              isDisabled={!amount || isLoading}
            >
              Bridge to XRPL
            </Button>
          </Flex>

          {txHash && (
            <Alert status="success">
              <AlertIcon />
              Bridge transaction submitted: {txHash.slice(0, 10)}...
            </Alert>
          )}
        </VStack>
      </CardBody>
    </Card>
  )
}