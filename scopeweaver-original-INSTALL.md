# Original ScopeWeaver 1.0.0

Install Node.js 20+ and Docker Desktop first, then open Docker Desktop.
Docker Compose 2.24.4+ is required. The first start downloads build dependencies
and builds the application; it needs internet access and may take several minutes.

## Original ScopeWeaver

Contains the unchanged English/Korean ScopeWeaver application snapshot. The npm launcher supplies separate local installation and Docker management.

```bash
npm install -g --ignore-scripts --no-audit --no-fund https://raw.githubusercontent.com/AlfieAlfiegithu2/Diary/scopeweaver-duo-v1.0.0/packages/scopeweaver-original-1.0.0.tgz
scopeweaver-original start
```

Application source commit: `75a706d3146f9537ebf2cabe00ca540b6b033a85`.
Default address: `http://127.0.0.1:8797`.


This command downloads the package from the public GitHub version tag. No GitHub login,
AirDrop, or npm registry publication is needed. The npm package's `private: true`
setting prevents accidental publication to npm; it does not restrict this GitHub download.
The package has no npm dependencies or install hooks. It launches a browser app
through Docker, rather than installing a native macOS .app.

Set your administrator password and model configuration in the browser after startup.
The two editions have separate databases, credentials and application data.
Use `scopeweaver-original stop` to stop this edition while preserving its data;
`scopeweaver-original status`, `scopeweaver-original doctor` and `scopeweaver-original logs` help with troubleshooting.
Do not remove the installation's saved secrets or Docker data volume.

If global npm installation reports EACCES, use a dedicated directory instead of sudo:

```bash
mkdir -p ~/scopeweaver-launchers
cd ~/scopeweaver-launchers
npm install --ignore-scripts --no-audit --no-fund https://raw.githubusercontent.com/AlfieAlfiegithu2/Diary/scopeweaver-duo-v1.0.0/packages/scopeweaver-original-1.0.0.tgz
npx --no-install scopeweaver-original start
```

For a downloaded archive, verify its SHA-256 against the release's SHA256SUMS.txt,
then install using `npm install -g --offline --ignore-scripts ./scopeweaver-original-1.0.0.tgz`.
Checksums detect changed bytes; the packages are not independently signed or notarized.

Complete corresponding source is included in `source.tar.gz`; its checksum and
pinned integration revisions are recorded in `manifest.json`. Original attribution
and license files are retained. The application and launcher use AGPL-3.0;
the optional CyberStrikeAI integration retains its Apache-2.0 license.

The launchers and both application backends were exercised on Linux with Docker
and PostgreSQL. A physical Mac and the full production Docker image build have
not been tested in this workspace.
