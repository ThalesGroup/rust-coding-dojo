---
name: rust-qualimetry
description: 'Lance une analyse qualimétrique SonarQube locale sur un projet Rust (kata ou autre). Utilise SonarQube 10.7 Community + plugin community-rust v0.2.7 tournant via Docker sur WSL (port 9000). Analyse la qualité du code Rust : fiabilité, sécurité, maintenabilité, duplication. Utiliser quand on demande de lancer Sonar sur du Rust, analyser la qualité d'un kata Rust, vérifier la dette technique, ou consulter les résultats SonarQube pour Rust.'
---

# Qualimétrie Rust — SonarQube local (Docker WSL)

Analyse la qualité d'un projet Rust avec **SonarQube 10.7 Community** + **plugin community-rust v0.2.7**, tournant localement via Docker dans WSL.

## Stack technique

| Composant | Version | Détails |
|-----------|---------|---------|
| SonarQube | 10.7.0.96327 | Image `sonarqube:10.7-community`, port `9000` |
| Plugin Rust | community-rust v0.2.7 | [C4tWithShell/community-rust](https://github.com/C4tWithShell/community-rust) |
| Quality Profile | **Rust Dojo** | 3 règles natives + règles Clippy importées |
| Quality Gate | **Rust Dojo** (défaut) | 7 conditions CAYC |
| Scanner | sonar-scanner CLI | À installer ou via Docker |

## Quality Gate « Rust Dojo » — Conditions

| Métrique | Opérateur | Seuil |
|----------|-----------|-------|
| Nouvelles violations | > | 0 |
| Fiabilité (nouveaux) | > | A (rating 1) |
| Sécurité (nouveaux) | > | A (rating 1) |
| Maintenabilité (nouveaux) | > | A (rating 1) |
| Security Hotspots reviewés | < | 100 % |
| Couverture (nouveaux) | < | 80 % |
| Duplication (nouveaux) | > | 3 % |

## Prérequis

- **Docker** disponible dans WSL
- **sonar-scanner** installé (`sonar-scanner` dans le PATH WSL) — ou utiliser l'image Docker
- **Rust + Cargo** installés dans WSL pour générer les rapports Clippy

## Démarrer SonarQube

```powershell
# Vérifier si le conteneur tourne déjà
wsl docker ps --filter name=sonarqube

# Démarrer si arrêté
wsl docker start sonarqube

# Démarrer from scratch (si conteneur supprimé)
wsl docker run -d --name sonarqube -p 9000:9000 `
  -v sonarqube_data:/opt/sonarqube/data `
  -v sonarqube_extensions:/opt/sonarqube/extensions `
  -v sonarqube_logs:/opt/sonarqube/logs `
  sonarqube:10.7-community

# Attendre que SonarQube soit UP
# → Vérifier sur http://localhost:9000 (admin / Admin1234!)
```

> Le plugin `community-rust-plugin.jar` est déjà dans le volume `sonarqube_extensions`.
> Il n'est **pas** nécessaire de le réinstaller si le volume est conservé.

## Générer les rapports Clippy (SARIF)

Le plugin community-rust peut importer les rapports Clippy. Génère-les avant le scan :

```powershell
# Dans le répertoire du kata à analyser
wsl cargo clippy --message-format=json 2>&1 | wsl tee /tmp/clippy-report.json

# Vérifier le rapport
wsl wc -l /tmp/clippy-report.json
```

## Créer un projet SonarQube et un token

```powershell
$TOKEN = "squ_d0491e57cd5ca0d91cb7a034abd78cbc274bf5e5"   # token admin local

# Créer un projet (remplacer my-kata-key et My Kata)
wsl curl -s -X POST -H "Authorization: Bearer $TOKEN" `
  "http://localhost:9000/api/projects/create" `
  --data "project=my-kata-key&name=My%20Kata"

# Générer un token d'analyse dédié au projet
wsl curl -s -X POST -H "Authorization: Bearer $TOKEN" `
  "http://localhost:9000/api/user_tokens/generate" `
  --data "name=my-kata-token"
# → noter le token `squ_...` retourné
```

## Lancer l'analyse avec sonar-scanner

Créer un fichier `sonar-project.properties` à la racine du kata :

```properties
sonar.projectKey=my-kata-key
sonar.projectName=My Kata
sonar.projectVersion=1.0
sonar.sources=src
sonar.exclusions=**/target/**
sonar.host.url=http://localhost:9000
sonar.token=<TOKEN_ANALYSE>
sonar.language=rust

# Optionnel : importer le rapport Clippy
# sonar.rust.clippy.reportPaths=/tmp/clippy-report.json
```

Lancer le scan :

```powershell
# Avec sonar-scanner installé dans WSL
wsl sonar-scanner -Dproject.settings=sonar-project.properties

# OU via Docker (sans installation locale)
wsl docker run --rm --network host `
  -v "${PWD}:/usr/src" `
  -w /usr/src `
  sonarsource/sonar-scanner-cli:latest `
  -Dsonar.host.url=http://localhost:9000 `
  -Dsonar.token=<TOKEN_ANALYSE>
```

## Consulter les résultats

```
http://localhost:9000                         → Dashboard général
http://localhost:9000/projects                → Liste des projets
http://localhost:9000/project/issues?id=<key> → Issues du projet
```

Identifiants par défaut : **admin / Admin1234!**

## Workflow complet (kata rust-coding-dojo)

```powershell
# 1. Démarrer SonarQube
wsl docker start sonarqube
Start-Sleep -Seconds 60

# 2. Se placer dans un kata
Set-Location katas\01-starter\04-fizzbuzz

# 3. Créer le projet SonarQube
$ADMIN_TOKEN = "squ_d0491e57cd5ca0d91cb7a034abd78cbc274bf5e5"
wsl curl -s -X POST -H "Authorization: Bearer $ADMIN_TOKEN" `
  "http://172.17.0.1:9000/api/projects/create" `
  --data "project=fizzbuzz&name=FizzBuzz"

# 4. Générer token d'analyse
$resp = wsl curl -s -X POST -H "Authorization: Bearer $ADMIN_TOKEN" `
  "http://172.17.0.1:9000/api/user_tokens/generate" `
  --data "name=fizzbuzz-token"
# Extraire le token du JSON retourné

# 5. Scanner (via Docker)
wsl docker run --rm --network host `
  -v "$(wsl wslpath -a (Get-Location).Path):/usr/src" `
  -w /usr/src `
  sonarsource/sonar-scanner-cli:latest `
  -Dsonar.projectKey=fizzbuzz `
  -Dsonar.sources=src `
  -Dsonar.host.url=http://172.17.0.1:9000 `
  -Dsonar.token=<TOKEN_ANALYSE>

# 6. Voir le résultat
Start-Process "http://localhost:9000/dashboard?id=fizzbuzz"
```

## Réinstaller le plugin (si volume perdu)

```powershell
# Télécharger le plugin
wsl wget -q -O /tmp/community-rust-plugin.jar `
  "https://github.com/C4tWithShell/community-rust/releases/download/v0.2.7/community-rust-plugin-0.2.7.jar"

# Copier dans le conteneur
wsl docker cp /tmp/community-rust-plugin.jar sonarqube:/opt/sonarqube/extensions/plugins/

# Redémarrer
wsl docker restart sonarqube
```

## Troubleshooting

| Problème | Solution |
|----------|----------|
| `Connection refused` sur localhost:9000 | `wsl docker start sonarqube` et attendre 60s |
| `401 Unauthorized` | Utiliser le token admin `squ_d0491e57cd5ca0d91cb7a034abd78cbc274bf5e5` |
| Plugin Rust absent | Réinstaller le plugin (voir section ci-dessus) |
| Quality Gate rouge sur couverture | Ajouter `-Dsonar.coverage.exclusions=**` ou générer les rapports de couverture avec `cargo tarpaulin` |
| `No files to analyze` | Vérifier `sonar.sources=src` et être dans le bon répertoire |
| Règles Clippy non importées | Générer le rapport JSON avec `cargo clippy --message-format=json` |
| IP WSL inaccessible depuis conteneur | Utiliser `172.17.0.1` (bridge Docker) au lieu de `localhost` |

## Références

- **SonarQube local** : `http://localhost:9000` (admin / Admin1234!)
- **Plugin community-rust** : https://github.com/C4tWithShell/community-rust
- **sonar-scanner Docker** : `sonarsource/sonar-scanner-cli:latest`
- **Cargo Tarpaulin** (couverture) : `cargo install cargo-tarpaulin`
- **Token admin** : `squ_d0491e57cd5ca0d91cb7a034abd78cbc274bf5e5`
