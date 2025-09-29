import { ethers, JsonRpcSigner } from "ethers"
import { createContext, FC, ReactNode, useContext, useEffect, useState } from "react"
import { SimpleBankContract, simpleBankAbi, simpleBankAddress } from "../../contracts"

export type Web3ContextApi = {
  account: string
  connectWallet: () => void
  contract: SimpleBankContract | null
  disconnect: () => void
  isOwner: boolean
  signer: JsonRpcSigner | null
  bridgeToXRPL: (amount: string, xrplAddress: string) => Promise<string | null>
}

const Web3Context = createContext<Web3ContextApi | null>(null)

type Props = {
  children: ReactNode
}

export const Web3Provider: FC<Props> = ({ children }) => {
  const [account, setAccount] = useState("")
  const [contract, setContract] = useState<SimpleBankContract | null>(null)
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null)
  const [isOwner, setIsOwner] = useState(false)

  const { ethereum } = window

  const XRPL_EVM_TESTNET_CHAIN_ID = 1449000n
  const XRPL_EVM_TESTNET_CONFIG = {
    chainId: `0x${XRPL_EVM_TESTNET_CHAIN_ID.toString(16)}`,
    chainName: 'XRPL EVM Sidechain Testnet',
    nativeCurrency: {
      name: 'XRP',
      symbol: 'XRP',
      decimals: 18,
    },
    rpcUrls: ['https://rpc-evm-sidechain.xrpl.org'],
    blockExplorerUrls: ['https://evm-sidechain.xrpl.org'],
  }

  const switchToXRPLNetwork = async (provider: ethers.BrowserProvider) => {
    if (!ethereum) return

    // Check current chain ID first to avoid unnecessary switches
    try {
      const currentNetwork = await provider.getNetwork()
      const currentChainId = currentNetwork.chainId
      if (currentChainId === XRPL_EVM_TESTNET_CHAIN_ID) {
        console.log('Already on XRPL EVM Testnet')
        return
      }
    } catch (error) {
      console.error('Failed to get current chain ID:', error)
    }

    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: XRPL_EVM_TESTNET_CONFIG.chainId }],
      })
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [XRPL_EVM_TESTNET_CONFIG],
          })
        } catch (addError) {
          console.error('Failed to add XRPL EVM Testnet:', addError)
        }
      } else {
        console.error('Failed to switch to XRPL EVM Testnet:', switchError)
      }
    }
  }

  const connectWallet = async () => {
    if (!ethereum) {
      console.error('MetaMask is not installed')
      return
    }

    // TODO Step 1 - Create provider first
    // Hint: const provider = new ethers.BrowserProvider(ethereum)

    // TODO: Switch to XRPL EVM Testnet using the provider
    // Hint: await switchToXRPLNetwork(provider)

    // TODO Step 2 - Get signer after network switch
    // Hint: const signer = await provider.getSigner()
    // Hint: setSigner(signer)

    // TODO Step 3 - Connect to MetaMask and get accounts
    // Hint: const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
    // Hint: const address = accounts[0]
    // Hint: setAccount(address)

    // TODO Step 4 - Create contract instance with typed interface
    // Hint: const contractInstance = new ethers.Contract(simpleBankAddress, simpleBankAbi, signer) as SimpleBankContract
    // Hint: setContract(contractInstance)

    // TODO Step 5 - Check if connected address is the contract owner
    // Hint: Use try/catch and contractInstance.owner() to check ownership
    // Hint: setIsOwner(owner === signer.address)
  }

  const disconnect = () => {
    setAccount('')
    setSigner(null)
    setContract(null)
    setIsOwner(false)
  }

  const bridgeToXRPL = async (amount: string, xrplAddress: string): Promise<string | null> => {
    if (!signer) {
      throw new Error('No signer available')
    }

    try {
      // TODO Step 1 - Convert amount to wei (18 decimals)
      // Hint: const amountWei = ethers.parseEther(amount)

      // TODO Step 2 - Create contract interface for Axelar
      // Hint: You'll need to call the interchainTransfer function on the Axelar contract
      // Hint: Contract address: '0xB5FB4BE02232B1bBA4dC8f81dc24C26980dE9e3C'
      // Hint: Use the ABI with interchainTransfer function

      // TODO Step 3 - Call interchainTransfer with the required parameters
      // Parameters:
      // - tokenId: '0xba5a21ca88ef6bba2bfff5088994f90e1077e2a1cc3dcc38bd261f00fce2824f'
      // - destinationChain: 'xrpl'
      // - destinationAddress: ethers.hexlify(ethers.toUtf8Bytes(xrplAddress))
      // - amount: amountWei
      // - metadata: '0x'
      // - gasValue: ethers.parseEther('0.5')
      // - value: 0n (msg.value)

      // TODO Step 4 - Return the transaction hash
      // Hint: return tx.hash

      console.log('Bridge to XRPL - Amount:', amount, 'Address:', xrplAddress)
      alert('TODO: Implement EVM to XRPL bridge using Axelar interchainTransfer')
      return null
    } catch (error) {
      console.error('Error bridging to XRPL:', error)
      throw error
    }
  }

  useEffect(() => {
    if (ethereum) {
      ethereum.on('accountsChanged', () => {
        disconnect()
        connectWallet()
      })
    }
  }, [ethereum])

  const value = {
    account,
    connectWallet,
    contract,
    disconnect,
    isOwner,
    signer,
    bridgeToXRPL,
  }

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>
}

export const useWeb3 = () => {
  const context = useContext(Web3Context)
  if (!context) {
    throw new Error('useWeb3 must be used inside Web3Provider')
  }
  return context
}
