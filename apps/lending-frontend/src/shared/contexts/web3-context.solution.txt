import { JsonRpcSigner, ethers } from 'ethers'
import { FC, ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { SimpleBankContract, simpleBankAbi, simpleBankAddress } from '../../contracts/index'

export type Web3ContextApi = {
  account: string
  connectWallet: () => void
  contract: SimpleBankContract | null
  disconnect: () => void
  isOwner: boolean
  signer: JsonRpcSigner | null
}

const Web3Context = createContext<Web3ContextApi | null>(null)

type Props = {
  children: ReactNode
}

export const Web3Provider: FC<Props> = ({ children }) => {
  const [account, setAccount] = useState('')
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

    // Check current chain ID first
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

    // First switch to XRPL EVM Testnet

    const provider = new ethers.BrowserProvider(ethereum)
    await switchToXRPLNetwork(provider)

    const signer = await provider.getSigner()
    setSigner(signer)

    // Connect to MetaMask
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
    const address = accounts[0]
    setAccount(address)

    // Set the contract using the signer, ABI, and address
    const contractInstance = new ethers.Contract(
      simpleBankAddress,
      simpleBankAbi,
      signer
    ) as SimpleBankContract
    setContract(contractInstance)

    // Check if the connected metamask address is the one that deployed the contract
    try {
      const owner = await contractInstance.owner()
      setIsOwner(owner === signer.address)
    } catch (error) {
      console.error('Error checking owner:', error)
      setIsOwner(false)
    }
  }

  const disconnect = () => {
    setAccount('')
    setSigner(null)
    setContract(null)
    setIsOwner(false)
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
