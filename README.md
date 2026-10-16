# ScopeWeaver Duo — two separate installers

Public download distribution for Artex Constellation and original ScopeWeaver.
This branch is independent of the repository's existing main branch.

Install Node.js 20+ and Docker Desktop (Compose 2.24.4+) on the receiving Mac,
and start Docker Desktop before launching either app. The first start builds the
application from bundled source and needs internet access. Later starts reuse the image.

## Artex Constellation

Includes multi-agent orchestration and bounded `/goal` recovery: by default, 30 minutes or five failed recoveries per worker/planner. The optional CyberStrikeAI source is bundled; its separate service is not started automatically.

```bash
npm install -g --ignore-scripts --no-audit --no-fund https://raw.githubusercontent.com/AlfieAlfiegithu2/Diary/scopeweaver-duo-v1.0.0/packages/artex-constellation-1.0.0.tgz
artex-constellation start
```

Application source commit: `801add8f3782f2ae796804ea3c90acf158c0bfdf`.
Default address: `http://127.0.0.1:8787`.

## Original ScopeWeaver

Contains the unchanged English/Korean ScopeWeaver application snapshot. The npm launcher supplies separate local installation and Docker management.

```bash
npm install -g --ignore-scripts --no-audit --no-fund https://raw.githubusercontent.com/AlfieAlfiegithu2/Diary/scopeweaver-duo-v1.0.0/packages/scopeweaver-original-1.0.0.tgz
scopeweaver-original start
```

Application source commit: `75a706d3146f9537ebf2cabe00ca540b6b033a85`.
Default address: `http://127.0.0.1:8797`.

Each edition has its own database, credentials, task files and localhost ports.
See the edition's INSTALL.md in this branch for troubleshooting, local install
alternatives and verification details. Complete application source and licenses
are bundled inside each npm package's source.tar.gz. SOURCE-PROVENANCE.json records
the exact source commits and package digests.

These are public GitHub downloads; no GitHub account or npm account is required.
They have no install hooks or npm dependencies. They are not published to the npm registry.

## Download and verification files

- [Constellation package](https://raw.githubusercontent.com/AlfieAlfiegithu2/Diary/scopeweaver-duo-v1.0.0/packages/artex-constellation-1.0.0.tgz)
- [Original ScopeWeaver package](https://raw.githubusercontent.com/AlfieAlfiegithu2/Diary/scopeweaver-duo-v1.0.0/packages/scopeweaver-original-1.0.0.tgz)
- [SHA-256 checksums](https://raw.githubusercontent.com/AlfieAlfiegithu2/Diary/scopeweaver-duo-v1.0.0/SHA256SUMS.txt)
- [Constellation instructions](https://github.com/AlfieAlfiegithu2/Diary/blob/scopeweaver-duo-v1.0.0/artex-constellation-INSTALL.md)
- [Original instructions](https://github.com/AlfieAlfiegithu2/Diary/blob/scopeweaver-duo-v1.0.0/scopeweaver-original-INSTALL.md)
