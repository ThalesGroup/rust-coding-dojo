---
name: quantum-ds
description: >-
    Règles strictes du Quantum Design System Thales (Angular) pour le projet FabLab Inventory. Toute demande de design doit respecter exclusivement cette charte.
user-invocable: false
---

# Quantum Design System — FabLab Inventory

Ce projet utilise le **package officiel `@qtm/angular`** (Angular proxy du DS Thales, basé sur Stencil web components).

## STACK TECHNIQUE
- `@qtm/angular` — composants Angular wrappés (via `QtmComponentLibraryModule`)
- `@qtm/web-components` — CSS global chargé dans `angular.json`
- Angular Material — conservé pour les overlays complexes (mat-menu, mat-dialog, mat-table)

## RÈGLE ABSOLUE
> **Toujours utiliser les composants `<qtm-*>`** pour les éléments UI.
> Importer `QtmComponentLibraryModule` dans chaque standalone component qui utilise des composants Qtm.
> Ne jamais créer de composants UI custom si un équivalent `<qtm-*>` existe.
> Angular Material est permis uniquement pour les cas non couverts par Qtm.

---

## Import dans un standalone component

```typescript
import { QtmComponentLibraryModule } from '@qtm/angular';

@Component({
  standalone: true,
  imports: [QtmComponentLibraryModule, /* autres modules */],
})
```

> ⚠️ Les composants Qtm **ne sont PAS standalone**. Importer `QtmComponentLibraryModule`, pas les composants individuels.

---

## Gestion des événements Stencil

Les événements Stencil sont des `CustomEvent<T>`. Dans les templates Angular, toujours utiliser `.detail` :

```html
<!-- ✅ correct -->
(valueChanged)="handler($event.detail)"
(clickItem)="handler($event.detail)"
(clickEvent)="handler($event.detail)"
<!-- ❌ incorrect -->
(valueChanged)="handler($event)"
```

---

## Palette de couleurs (CSS variables)

| Variable | Valeur | Usage |
|----------|--------|-------|
| `--color-primary` | `#0082C3` | Actions principales, liens, focus |
| `--color-primary-dark` | `#002B45` | Sidebar, header, titres |
| `--color-primary-light` | `#E6F3FB` | Backgrounds de highlight |
| `--color-accent` | `#00A86B` | Succès |
| `--color-warn` | `#E63946` | Erreurs critiques |
| `--color-warning` | `#F4A261` | Avertissements |
| `--color-background` | `#F4F6F8` | Fond général |
| `--color-surface` | `#FFFFFF` | Cartes, panels |
| `--color-border` | `#E0E4E8` | Bordures |
| `--color-text-primary` | `#1A1A2E` | Texte principal |
| `--color-text-secondary` | `#6B7280` | Labels |

---

## Typographie

- **Police principale** : `Roboto`, fallback `system-ui, sans-serif`
- **Police monospace** : `Roboto Mono`

---

## Composants disponibles (`<qtm-*>`)

### Layout
| Composant | Usage | Props clés |
|-----------|-------|------------|
| `<qtm-header>` | Barre de navigation top | `size` |
| `<qtm-header-brand>` | Zone logo/marque (slot dans qtm-header) | — |
| `<qtm-header-divider>` | Séparateur dans header | — |
| `<qtm-header-menu>` | Zone menu du header | — |
| `<qtm-header-menu-left>` | Partie gauche du menu | — |
| `<qtm-header-menu-right>` | Partie droite du menu | — |
| `<qtm-drawer>` | Sidebar/panel latéral | `size` |
| `<qtm-drawer-header>` | En-tête du drawer | — |
| `<qtm-drawer-body>` | Corps du drawer | — |
| `<qtm-drawer-footer>` | Pied du drawer | — |
| `<qtm-grid>` | Grille de layout | — |

### Navigation
| Composant | Usage | Props clés |
|-----------|-------|------------|
| `<qtm-menu-item-list>` | Liste de nav (sidebar) | `items`, `activeId`, `enableAutoActive`, `scrollable`, `size` |
| `<qtm-menu-item>` | Item de nav (slot) | `id`, `active`, `disabled`, `collapsed` |
| `<qtm-menu-item-label>` | Label d'un item | — |
| `<qtm-submenu-item-list>` | Sous-menu | — |
| `<qtm-submenu-item>` | Item sous-menu | `id` |
| `<qtm-tabs>` | Navigation par onglets | `size`, `full-height` |
| `<qtm-tab>` | Onglet | `active` |
| `<qtm-breadcrumb>` | Fil d'Ariane | `size`, `color`, `separator` |
| `<qtm-breadcrumb-item>` | Item fil d'Ariane | — |

### Composants UI
| Composant | Usage | Props clés |
|-----------|-------|------------|
| `<qtm-button>` | Bouton | `variant`, `color`, `size`, `label`, `leftIcon`, `rightIcon`, `disabled` |
| `<qtm-icon>` | Icône Material | `icon`, `size`, `variant`, `lib` |
| `<qtm-tag>` | Tag/Badge | `label`, `color`, `size`, `dismissible` |
| `<qtm-tag-button>` | Tag cliquable | — |
| `<qtm-alert>` | Alerte/bannière | `severity`, `message`, `title`, `dismissible`, `color`, `size` |
| `<qtm-divider>` | Séparateur horizontal | — |
| `<qtm-tooltip>` | Info-bulle | — |
| `<qtm-typography>` | Texte typographié | — |
| `<qtm-progress-bar>` | Barre de progression | — |
| `<qtm-progress-circle>` | Spinner circulaire | — |
| `<qtm-modal>` | Modal/Dialog | — |
| `<qtm-modal-header>` | En-tête modal | — |
| `<qtm-modal-body>` | Corps modal | — |
| `<qtm-modal-footer>` | Pied modal | — |
| `<qtm-drawer>` | Panneau latéral | `size` |
| `<qtm-dropdown>` | Menu déroulant | — |
| `<qtm-split-button>` | Bouton avec menu | — |
| `<qtm-datatable>` | Tableau de données | — |

### Formulaires
| Composant | Usage | Props clés |
|-----------|-------|------------|
| `<qtm-text-input>` | Champ texte | `value`, `placeholder`, `leftIcon`, `rightIcon`, `disabled`, `readonly`, `severity`, `size` |
| `<qtm-textarea>` | Zone de texte | `value`, `placeholder`, `rows` |
| `<qtm-form-field>` | Wrapper de champ | — |
| `<qtm-form-label>` | Label de champ | — |
| `<qtm-form-caption>` | Message d'aide/erreur | — |
| `<qtm-checkbox>` | Case à cocher | `checked`, `label`, `disabled`, `indeterminate` |
| `<qtm-checkbox-group>` | Groupe de cases | — |
| `<qtm-radio-button>` | Bouton radio | `value`, `label`, `checked` |
| `<qtm-radio-group>` | Groupe radio | `value` |
| `<qtm-dropdown-select>` | Select/Liste | `value`, `placeholder`, `disabled`, `multiple` |
| `<qtm-dropdown-select-option>` | Option du select | `value`, `label` |
| `<qtm-multiselect>` | Multi-sélection | — |
| `<qtm-toggle-switch>` | Interrupteur | `checked`, `disabled`, `label` |
| `<qtm-slider>` | Curseur | `min`, `max`, `value`, `step` |

---

## Variants de qtm-button

| Variant | Usage |
|---------|-------|
| `filled` (défaut) | Action principale |
| `outline` | Action secondaire |
| `ghost` | Action tertiaire / icône |
| `link` | Lien textuel |

| Color | Hex |
|-------|-----|
| `primary` | #0082C3 |
| `neutral` | gris |
| `success` | vert |
| `warning` | orange |
| `danger` | rouge |
| `inverted` | blanc (sur fond sombre) |

```html
<!-- ✅ Exemples corrects -->
<qtm-button variant="filled" color="primary" label="Créer"></qtm-button>
<qtm-button variant="outline" color="primary" label="Annuler"></qtm-button>
<qtm-button variant="ghost" color="primary"><qtm-icon icon="edit"></qtm-icon></qtm-button>
<qtm-button variant="filled" color="danger" label="Supprimer"></qtm-button>
```

---

## Severities pour qtm-alert

```html
<qtm-alert severity="success" message="Opération réussie"></qtm-alert>
<qtm-alert severity="warning" message="Attention"></qtm-alert>
<qtm-alert severity="error" message="Erreur critique"></qtm-alert>
<qtm-alert severity="info" message="Information"></qtm-alert>
```

---

## Pattern qtm-menu-item-list avec routing Angular

```typescript
// Items au format MenuItemType
protected readonly navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'inventory', label: 'Inventaire', icon: 'inventory_2' },
];

navigate(event: CustomEvent<string>): void {
  // ⚠️ toujours .detail pour les événements Stencil
  void this.router.navigate(['/' + event.detail]);
}
```

```html
<qtm-menu-item-list
  [items]="navItems"
  [activeId]="activeId()"
  [enableAutoActive]="false"
  (clickItem)="navigate($event)"
></qtm-menu-item-list>
```

---

## Classes CSS utilitaires (styles.scss)

```scss
.q-card          // Carte avec ombre
.page-header     // En-tête de page
.uid-chip        // Chip UID FAB-xxxx
.badge           // Badge de statut
.badge-available / .badge-borrowed / .badge-broken / .badge-maintenance / .badge-retired
.badge-low / .badge-medium / .badge-high / .badge-critical
```

---

## Règles systématiques

1. **Boutons** : `<qtm-button>` toujours, jamais de `<button>` brut
2. **Formulaires** : `<qtm-text-input>` + `<qtm-form-field>` + `<qtm-form-label>` + `<qtm-form-caption>`
3. **Alertes/notifications** : `<qtm-alert>` avec severity
4. **Navigation latérale** : `<qtm-drawer>` + `<qtm-menu-item-list>`
5. **Header top** : `<qtm-header>` avec sous-composants brand/menu
6. **Icônes** : `<qtm-icon icon="nom_material">` (noms d'icônes Google Material Icons)
7. **Couleurs** : variables CSS `var(--color-*)` uniquement, jamais de valeurs hex en dur
8. **Événements Stencil** : toujours `$event.detail` pour extraire la valeur
