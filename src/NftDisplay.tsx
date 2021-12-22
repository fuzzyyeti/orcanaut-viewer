import React, {FC, useMemo, useCallback, useState} from 'react';
import {ConnectionProvider, useWallet, WalletProvider, useConnection } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import MintList from './mints_BPbS1AC4KW5SBiz8M2AgPtWXTzR1ekBwMLLQLcwdvZnE.json'
import hallowWhale from './collectible-assets/hallowhale.svg';
import porpoise from './collectible-assets/porpoise.svg';
import killerWhale from './collectible-assets/killer-whale.svg';
import starfish from './collectible-assets/starfish.svg';
import whale from './collectible-assets/whale.svg';
import clownfish from './collectible-assets/clownfish.svg';
import guppy from './collectible-assets/guppy.svg';
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
import {
    getParsedNftAccountsByOwner,
    getParsedAccountByMint
} from "@nfteyez/sol-rayz";

const GUPPY = "guppyrZyEX9iTPSu92pi8T71Zka7xd6PrsTJrXRW6u1";
const CLOWNFISH = "cLownTTaiiQMoyMmFjfmSGowi8HyNhCtTLFcrNKnqX6";
const PORPOISE = "porpKs9ZZERXKkg55f1GRXCiXZK89Uz6VKS8Bv9qWqM";
const ADDRESS_WITH_LOTS_OF_TOKENS = "MNsTzWHjYx4ihWb5X7NPxwUzp3gntH8EFM6SsApvwPS";
//const ADDRESS_WITH_KILLER_WHALE = "DyDdJM9KVsvosfXbcHDp4pRpmbMHkRq3pcarBykPy4ir";
const ADDRESS_WITH_KILLER_WHALE = "4HZgK1cKRZSYZ4yzCiyBhD8frEVtmQH5x1qBwgiz6oJu";
const STARFISH = "star2pH7rVWscs743JGdCAL8Lc9nyJeqx7YQXkGUnWf";
const HALLOWHALE = "ha11o7FUziqRqpWLSnHoAnNjpeMYg6S3sSd7hfbqLyk";
const WHALE = "whaLeHav12EhGK19u6kKbLRwC9E1EATGnm6MWbBCcUW";
const KILLERWHALE = "kLwhLkZRt6CadPHRBsgfhRCKXX426WMBnhoGozTduvk";

const mapTokenAccounts = new Map();
mapTokenAccounts.set(GUPPY, guppy);
mapTokenAccounts.set(CLOWNFISH, clownfish,);
mapTokenAccounts.set(PORPOISE, porpoise);
mapTokenAccounts.set(STARFISH, starfish);
mapTokenAccounts.set(HALLOWHALE, hallowWhale);
mapTokenAccounts.set(WHALE, whale);
mapTokenAccounts.set(KILLERWHALE, killerWhale);


// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css');

const mintListSet = new Set();
MintList.map(m => mintListSet.add(m));


type NftInfo = {
    traits: Trait[]
    image: string
    name: string
}

type Trait =
{
    trait_type: string;
    value: string
}

const TraitDisplay = (props: NftInfo) => {
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
    const initVal: NftInfo[] = [];
    const [collectiblesImg, setCollectiblesImg] = useState([]);

    const onConnect = useCallback(async () =>
    {
        if (publicKey == null) return;
        const parsedAccounts = await getParsedAccountByMint({mintAddress: GUPPY});
        console.log(parsedAccounts);
        const mintAddresses = await connection.getParsedTokenAccountsByOwner( new PublicKey(ADDRESS_WITH_KILLER_WHALE),
            {programId : new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")},
            "confirmed");
        const collectibles = mintAddresses.value.filter(ma => mapTokenAccounts.has(ma.account.data.parsed.info.mint)).
            map(ma => [mapTokenAccounts.get(ma.account.data.parsed.info.mint),
             parseInt(ma.account.data.parsed.info.tokenAmount.amount)/parseInt(ma.account.data.parsed.info.tokenAmount.decimals));


        //     publicKey,
        //     {programId : new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")},
        //     "confirmed")
        //     .then(accounts => accounts.value.map(a => a.account.data.parsed.info.mint));
        // mintAddresses.filter(m => mintListSet.has(m.toString()))
        //     .map(m => axios.get(`https://api-mainnet.magiceden.io/rpc/getNFTByMintAddress/${m}`)
        //         .then(r => {
        //             setNfts(nfts => [...nfts, {name: r.data.results['title'], image: r.data.results['img'],traits: r.data.results['attributes']}]);
        //         }));
       // const spls = await getParsedNftAccountsByOwner({publicAddress : ADDRESS_WITH_LOTS_OF_TOKENS});
       // console.log(spls);
    }, [publicKey]);
        let i = 0;  
    return (
        <div>
            <img width={500} src={hallowWhale}/>
            {/*<h1 hidden={publicKey != null}>Connect your wallet to see your Orcanauts</h1>*/}
            {/*<h1 hidden={nfts.length > 0 || !publicKey}>Click button to see your Orcanauts</h1>*/}
            {/*<h1 hidden={nfts.length === 0 || !publicKey}>Here are your Orcanauts</h1>*/}
            {/*{nfts.map(nft => (*/}
            {/*  <TraitDisplay*/}
            {/*    key={i++}*/}
            {/*    traits={nft.traits}*/}
            {/*    image={nft.image}*/}
            {/*    name={nft.name}*/}
            {/*  />*/}
            {/*))}*/}
            <button className={"wallet-adapter-button"}  onClick={onConnect} disabled={!publicKey}>Get Orcanauts</button>
        </div>
    );
}

export const NftDisplay: FC = () => {
    // Can be set to 'devnet', 'testnet', or 'mainnet-beta'
    const network = WalletAdapterNetwork.Mainnet;
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
