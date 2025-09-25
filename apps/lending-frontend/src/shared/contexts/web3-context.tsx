import { ethers, JsonRpcSigner, Contract } from "ethers"
import { createContext, FC, ReactNode, useContext, useEffect, useState } from "react"
import { simpleBankAbi, simpleBankAddress } from "../../contracts/contract-address"

export type Web3ContextApi = {
  account: string
  connectWallet: () => void
  contract: Contract | null
  disconnect: () => void
  isOwner: boolean
  signer: JsonRpcSigner | null
}

const Web3Context = createContext<Web3ContextApi | null>(null)

type Props = {
  children: ReactNode
}

export const Web3Provider: FC<Props> = ({ children }) => {
  const [account, setAccount] = useState("")
  const [contract, setContract] = useState<Contract | null>(null)
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null)
  const [isOwner, setIsOwner] = useState(false)

  const { ethereum } = window

  const connectWallet = async () => {
    if (!ethereum) {
      console.error("MetaMask is not installed")
      return
    }

    // Step 1
    // Define a new provider as ethers.BrowserProvider
    //const provider = new ethers.BrowserProvider(ethereum)
    // Get the provider's signer
    //const signer = await provider.getSigner()
    // Set in state (setSigner)
    //setSigner(signer)

    // Step 2 - Connect to MetaMask
    // Request the eth_requestAccounts
    //const accounts = await ethereum.request({ method: "eth_requestAccounts" })
    // Get the the first account from the eth_requestAccounts list
    //const address = accounts[0]
    // Set it in state (setAccount)
    //setAccount(address)

    // Step 3 - Set the contract (setContract) using the signer and the ABI/address
    //const contractInstance = new ethers.Contract(simpleBankAddress, simpleBankAbi, signer)
    //setContract(contractInstance)

    // Step 4 - Check if the connected metamask address is the one that deployed the contract (setIsOwner)
    /*try {
      const owner = await contractInstance.owner()
      setIsOwner(owner === signer.address)
    } catch (error) {
      console.error("Error checking owner:", error)
      setIsOwner(false)
    }*/
  }

  const disconnect = () => {
    setAccount("")
    setSigner(null)
    setContract(null)
    setIsOwner(false)
  }

  useEffect(() => {
    if (ethereum) {
      ethereum.on("accountsChanged", () => {
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
    throw new Error("useWeb3 must be used inside Web3Provider")
  }
  return context
}
