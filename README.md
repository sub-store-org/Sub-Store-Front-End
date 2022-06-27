<div align="center">
<br>
<img width="200" src="https://raw.githubusercontent.com/58xinian/icon/master/Sub-Store1.png" alt="Sub-Store">
<br>
<br>
<h2 align="center">Sub-Store</h2>
</div>

<p align="center" color="#6a737d">
Advanced Subscription Manager for QX, Loon, Surge, Stash and ShadowRocket.
</p>

[![Build](https://github.com/Peng-YM/Sub-Store/actions/workflows/main.yml/badge.svg)](https://github.com/Peng-YM/Sub-Store/actions/workflows/main.yml) ![GitHub](https://img.shields.io/github/license/Peng-YM/Sub-Store) ![GitHub issues](https://img.shields.io/github/issues/Peng-YM/Sub-Store) ![GitHub closed pull requests](https://img.shields.io/github/issues-pr-closed-raw/Peng-Ym/Sub-Store) ![Lines of code](https://img.shields.io/tokei/lines/github/Peng-YM/Sub-Store) ![Size](https://img.shields.io/github/languages/code-size/Peng-YM/Sub-Store)

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/PengYM)

Core functionalities:

1. Conversion among various formats.
2. Subscription formatting.
3. Collect multiple subscriptions in one URL.

## 1. Subscription Conversion

### Supported Input Formats

- [x] SS URI
- [x] SSR URI
- [x] SSD URI
- [x] V2RayN URI
- [x] QX (SS, SSR, VMess, Trojan, HTTP)
- [x] Loon (SS, SSR, VMess, Trojan, HTTP)
- [x] Surge (SS, VMess, Trojan, HTTP)
- [x] Stash & Clash (SS, SSR, VMess, Trojan, HTTP)

### Supported Target Platforms

- [x] QX
- [x] Loon
- [x] Surge
- [x] Stash & Clash
- [x] ShadowRocket

## 2. Subscription Formatting

### Filtering

- [x] **Regex filter**
- [x] **Discard regex filter**
- [x] **Region filter**
- [x] **Type filter**
- [x] **Useless proxies filter**
- [x] **Script filter**

### Proxy Operations

- [x] **Set property operator**: set some proxy properties such as `udp`,`tfo`
  , `skip-cert-verify` etc.
- [x] **Flag operator**: add flags or remove flags for proxies.
- [x] **Sort operator**: sort proxies by name.
- [x] **Regex sort operator**: sort proxies by keywords (fallback to normal
  sort).
- [x] **Regex rename operator**: replace by regex in proxy names.
- [x] **Regex delete operator**: delete by regex in proxy names.
- [x] **Script operator**: modify proxy by script.


### Development

#### Guidelines

Commit message follows [@commitlint/config-angular](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-angular)

#### Created in the following version:
- pnpm v7.3.0
- Vite v2.9.9
- Vue v3.2
- Pinia v2
- Typescript v4.6

#### Font Awesome Icon 
This project is using [Font Awesome](https://fontawesome.com/icons/check?s=regular) icons and this is [Documentation](https://fontawesome.com/docs/web/style/size)

#### Start 
```bash
# install dependencies
pnpm i

# run the server
pnpm dev

# build the app
pnpm build

# preview the built app
pnpm preview
```

## LICENSE

This project is under the GPL V3 LICENSE.

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FPeng-YM%2FSub-Store.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2FPeng-YM%2FSub-Store?ref=badge_large)

## Acknowledgements

- Special thanks to @KOP-XIAO for his awesome resource-parser. Please give
  a [star](https://github.com/KOP-XIAO/QuantumultX) for his great work!
- Speicial thanks to @Orz-3 and @58xinian for their awesome icons.
