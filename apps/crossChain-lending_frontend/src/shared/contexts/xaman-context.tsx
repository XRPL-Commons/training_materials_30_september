import { FC, ReactNode, createContext, useCallback, useContext, useState } from 'react'
import { Payment, convertStringToHex, xrpToDrops } from 'xrpl'
import { Xumm } from 'xumm'

export type XamanContextApi = {
  isConnected: boolean
  account: string | null
  xummClient: Xumm | null
  connectXaman: () => Promise<void>
  disconnect: () => void
  bridgeToEVM: (amount: string, evmAddress: string) => Promise<string | null>
}

const XamanContext = createContext<XamanContextApi | null>(null)

type Props = {
  children: ReactNode
}

export const XamanProvider: FC<Props> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false)
  const [account, setAccount] = useState<string | null>(null)

  // TODO: Initialize Xumm client once
  // Hint: const xumm = new Xumm('API_KEY', 'API_SECRET')

  const connectXaman = useCallback(async () => {
    try {
      // TODO Step 1 - Sign in with Xaman
      // Hint: await xumm.authorize()

      // TODO Step 2 - Get authorized user and set state
      // Hint: const authorizedUser = await xumm.user.account
      // Hint: if (authorizedUser) { setAccount(authorizedUser); setIsConnected(true); }

    } catch (error) {
      console.error('Error connecting to Xaman:', error)
      disconnect()
    }
  }, []) // TODO: Add xumm to dependency array

  const disconnect = useCallback(() => {
    setIsConnected(false)
    setAccount(null)
  }, [])

  const bridgeToEVM = useCallback(
    async (amount: string, evmAddress: string): Promise<string | null> => {
      if (!account) {
        throw new Error('Xaman not connected')
      }

      try {
        // TODO Step 1 - Create the payment transaction for Axelar bridge
        // Hint: Use Payment type with TransactionType: 'Payment'
        // Hint: Account: account
        // Hint: Destination: 'rNrjh1KGZk2jBR3wPfAQnoidtFFYQKbQn2' (Testnet relayer)
        // Hint: Amount: xrpToDrops(amount)
        // Hint: Memos: Array with memo objects for bridge

        // TODO Step 2 - Add required memos for Axelar bridge
        // Memo 1: MemoType: convertStringToHex('type'), MemoData: convertStringToHex('interchain_transfer')
        // Memo 2: MemoType: convertStringToHex('destination_address'), MemoData: convertStringToHex(evmAddress.slice(2))
        // Memo 3: MemoType: convertStringToHex('destination_chain'), MemoData: convertStringToHex('xrpl-evm')
        // Memo 4: MemoType: convertStringToHex('gas_fee_amount'), MemoData: convertStringToHex('1700000')

        // TODO Step 3 - Submit transaction via Xaman
        // Hint: const payload = await xumm.payload.create({
        //   txjson: paymentTx,
        //   options: { force_network: 'TESTNET' },
        //   custom_meta: { identifier: `bridge-${Date.now()}`, instruction: `Bridge ${amount} XRP...` }
        // })

        // TODO Step 4 - Check payload creation and open Xaman
        // Hint: if (payload.uuid && payload.next?.always) {
        // Hint: window.open(payload.next.always, '_blank')

        // TODO Step 5 - Wait for user to sign transaction
        // Hint: const result = await xumm.payload.subscribe(payload.uuid)

        // TODO Step 6 - Return transaction ID if signed, null if cancelled
        // Hint: return result.signed ? result.txid || null : null

        return null
      } catch (error) {
        console.error('Error bridging to EVM:', error)
        throw error
      }
    },
    [] // TODO: Add dependencies [xumm, account]
  )

  const value: XamanContextApi = {
    isConnected,
    account,
    xummClient: null, // TODO: Return xumm instance
    connectXaman,
    disconnect,
    bridgeToEVM,
  }

  return <XamanContext.Provider value={value}>{children}</XamanContext.Provider>
}

export const useXaman = () => {
  const context = useContext(XamanContext)
  if (!context) {
    throw new Error('useXaman must be used inside XamanProvider')
  }
  return context
}