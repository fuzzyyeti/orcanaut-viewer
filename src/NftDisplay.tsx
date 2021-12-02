import React, {FC, useMemo, useCallback, useState} from 'react';
import {ConnectionProvider, useWallet, WalletProvider, useConnection } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import MintList from './mints_BPbS1AC4KW5SBiz8M2AgPtWXTzR1ekBwMLLQLcwdvZnE.json'
import axios from 'axios';
import {
    getLedgerWallet,
    getPhantomWallet,
    getSlopeWallet,
    getSolflareWallet,
    getSolletExtensionWallet,
    getSolletWallet,
    getTorusWallet,
} from '@solana/wallet-adapter-wallets';
import {
    WalletModalProvider,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl, PublicKey } from '@solana/web3.js';

// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css');

const mintListSet = new Set();
MintList.map(m => mintListSet.add(m));


type TraitInfo = {
    traits: Trait[]
    image: string
    name: string
}

type Trait =
{
    trait_type: string;
    value: string
}

const TraitDisplay = (props: TraitInfo) => {
   let i = 0;
    return(
        <div>
            <h2 hidden={props.name === 'null'}>{props.name}</h2>
            {props.traits.map(t => <li key={i++}>{t.trait_type} = {t.value}</li>)}
            <img hidden={props.image === 'null'} src={props.image} className="nft-image" alt="nft"/>
        </div>
    );
}

const TokenDisplay: FC = props => {
    const {publicKey} = useWallet();
    const { connection } = useConnection();
    const initVal: TraitInfo = {name: 'null', image: 'null', traits: []};
    const [traits, setTraits] = useState(initVal);

    const onConnect = useCallback(async () =>
    {
        if (publicKey == null) return;
        const mintAddresses = await connection.getParsedTokenAccountsByOwner(
            publicKey,
            {programId : new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")},
            "confirmed")
            .then(accounts => accounts.value.map(a => a.account.data.parsed.info.mint));
        mintAddresses.filter(m => mintListSet.has(m.toString()))
            .map(m => axios.get(`https://api-devnet.magiceden.io/rpc/getNFTByMintAddress/${m}`)
                .then(r => {
                    console.log(r.data.results);
                    setTraits({name: r.data.results["title"], image: r.data.results["img"],traits: r.data.results["attributes"]});
                }));
    }, [connection, publicKey]);
    return (
        <div>
            <h1 hidden={publicKey != null}>Connect your wallet to see your Orcanauts</h1>
            <h1 hidden={traits.traits.length > 0 || !publicKey}>Click button to see your Orcanauts</h1>
            <h1 hidden={traits.traits.length == 0 || !publicKey}>Here are your Orcanauts</h1>
            <TraitDisplay traits={traits.traits} image={traits.image} name={traits.name}></TraitDisplay>
            <button className={"wallet-adapter-button"}  onClick={onConnect} disabled={!publicKey}>Get Orcanauts</button>
        </div>
    );
}

export const NftDisplay: FC = () => {
    // Can be set to 'devnet', 'testnet', or 'mainnet-beta'
    const network = WalletAdapterNetwork.Devnet;
    // You can also provide a custom RPC endpoint
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking --
    // Only the wallets you configure here will be compiled into your application
    const wallets = useMemo(() => [
        getPhantomWallet(),
        getSlopeWallet(),
        getSolflareWallet(),
        getTorusWallet({
            options: { clientId: 'Get a client ID @ https://developer.tor.us' }
        }),
        getLedgerWallet(),
        getSolletWallet({ network }),
        getSolletExtensionWallet({ network }),
    ], [network]);

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <TokenDisplay/>
                    <WalletMultiButton />
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};