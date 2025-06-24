# 🧰 @iamibrahimwali/cardinal-common

A modern, actively maintained fork of the original `@cardinal/common` — offering essential TypeScript utilities for Solana token interactions. Perfect for developers building Solana smart contracts, token programs, and dApps.

---

## ✨ Why This Fork?

The original `@cardinal/common` package has not been maintained for over 2 years, and its GitHub repository is no longer available. Due to this, developers (including myself) encountered runtime issues with outdated configurations — especially while interacting with the latest Solana RPC nodes.

### 🔥 Fix Included

This fork resolves a critical transaction error:

```
Error: failed to send transaction: Invalid params: unknown variant `recent`, expected one of `processed`, `confirmed`, `finalized`.
```

This error was caused by the deprecated use of `"recent"` commitment level, which is no longer supported by Solana JSON RPC. The updated version uses valid commitment levels like `"processed"`, `"confirmed"`, or `"finalized"` to ensure compatibility with modern Solana clusters.

### 💡 Why I Published This

As a Solana developer and infrastructure builder at [NextChainX](https://nextchainx.com), I needed this package to work reliably for staking systems and dApps under active development. With no working GitHub source or maintainer support, I took the initiative to:

* Fix outdated commitment levels
* Update dependencies
* Make the package available again on NPM under a maintained scope

> 📧 Maintained by Muhammad Ibrahim – [ibrahim.wali@nextchainx.io](mailto:ibrahim.wali@nextchainx.io)

---

## ⚙️ Installation & Setup

To use or contribute to `@iamibrahimwali/cardinal-common`, follow the instructions below:

---

### 📦 For Users (NPM Install)

To include this package in your Solana TypeScript/JavaScript project:

```bash
npm install @iamibrahimwali/cardinal-common
```

Or using Yarn:

```bash
yarn add @iamibrahimwali/cardinal-common
```

Then import into your code:

```ts
import { getTokenAccount } from '@iamibrahimwali/cardinal-common'
```

---

### 💪 For Developers (Local Setup)

If you want to build or contribute to the package locally:

---

#### 🔑 Prerequisites

* Node.js ≥ 16.x
* Yarn or NPM
* TypeScript globally (optional): `npm install -g typescript`

---

#### 🧬 Clone the Repository

```bash
git clone https://github.com/Mibrahimwali/cardinal-common-next.git
cd cardinal-common-next
```

---

#### 📅 Install Dependencies

```bash
npm install
# or
yarn install
```

---

#### 🔨 Build the Package

This compiles both CommonJS and ESM builds into the `dist/` folder.

```bash
npm run build
```

---

#### ✅ Test Your Changes

Make your changes, then re-run:

```bash
npm run build
```

You can then `npm link` the package to another local project if needed.

---

#### 🚀 Publish (Maintainers Only)

To publish updates (maintainers only):

```bash
npm publish --access public
```

Ensure your `package.json` version is bumped according to semantic versioning.

---

## 📆 Features

* Solana token utilities
* Buffer layout helpers
* Anchor-compatible utilities
* Metadata handling (Metaplex)
* MsgPack serialization
* Big number support

---

## 🔍 Keywords

`solana`, `token`, `anchor`, `buffer-layout`, `utility`, `cardinal`, `nextchainx`, `metaplex`, `typescript`, `spl-token`, `solana-dapps`

---

## 📂 License

Licensed under [Apache 2.0](./LICENSE)

---

## 👨‍💼 About the Author

Muhammad Ibrahim is a blockchain and AI software engineer with over a decade of experience. As Director at **NextChainX**, I specialize in:

* Web3 Infrastructure (Solana, Ethereum, XRPL)
* Real-World Asset Tokenization
* Custom Blockchain SDKs and Smart Contracts
* AI-Blockchain Integrations

> Let's build the decentralized future together:
> **📧 [ibrahim.wali@nextchainx.io](mailto:ibrahim.wali@nextchainx.io)**
> **🌐 [nextchainx.com](https://nextchainx.com)**

---

## 🙌 Contributions Welcome

Pull requests are open! If you want to add improvements, bug fixes, or new features — feel free to fork and contribute.

---

## 🌍 Repository

[https://github.com/Mibrahimwali/cardinal-common-next](https://github.com/Mibrahimwali/cardinal-common-next)
