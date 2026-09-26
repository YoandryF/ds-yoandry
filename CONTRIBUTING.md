# Contribuir a ds-yoandry

¡Gracias por tu interés! Aquí están las guías para contribuir.

---

## Prerrequisitos

- Node.js >= 18
- pnpm >= 9 (`npm install -g pnpm`)
- Git
- (Para los paquetes Dart) Dart SDK >= 3.0 / Flutter >= 3.10

---

## Setup local

```bash
git clone https://github.com/YoandryF/ds-yoandry.git
cd ds-yoandry
pnpm install
pnpm build
```

---

## Estructura del proyecto

```
packages/
├── core/       # Motor sin dependencias — TypeScript puro
├── react/      # Hook + Provider — React / React Native
├── angular/    # Service + Signals — Angular 16+
├── dart_core/  # Motor sin dependencias — Dart puro
└── flutter/    # Theming + Provider — Flutter
apps/
└── demo-react/  # App Expo de demostración
```

---

## Comandos

```bash
# Build todos los packages
pnpm build

# Build un package específico
pnpm --filter @ds-yoandry/core build

# Tests del core
pnpm --filter @ds-yoandry/core test

# Tests con cobertura
pnpm --filter @ds-yoandry/core test -- --coverage

# Modo desarrollo (watch)
pnpm --filter @ds-yoandry/core dev

# Demo
cd apps/demo-react && npx expo start
```

### Paquetes Dart/Flutter

```bash
# Motor Dart puro
cd packages/dart_core
dart pub get
dart analyze
dart test                                  # unitarios + paridad

# Regenerar los fixtures de paridad (tras cambiar el core JS)
node tool/generate_parity_fixtures.js

# Binding de Flutter
cd packages/flutter
flutter pub get
flutter analyze
flutter test
```

---

## Flujo de trabajo

1. Crea un fork del repositorio
2. Crea una rama descriptiva: `git checkout -b feat/nombre-feature`
3. Haz tus cambios
4. Agrega tests si aplica
5. Asegúrate que el build y tests pasan: `pnpm build && pnpm test`
6. Abre un Pull Request

---

## Convenciones de commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: descripción de la nueva funcionalidad
fix: descripción del bug corregido
docs: cambios solo en documentación
test: agregar o corregir tests
refactor: cambio de código sin nueva funcionalidad ni fix
chore: tareas de mantenimiento (deps, build, etc.)
```

---

## Reglas

### Código
- TypeScript estricto en los paquetes JS; Dart con lints estrictos en los paquetes Dart
- Mantener los motores (`core` y `dart_core`) **sin dependencias de frameworks** (no React, no Angular, no Flutter)
- Cada función exportada debe tener JSDoc/DartDoc con al menos un `@example`
- No romper la API pública sin mayor de versión
- `dart_core` debe mantener **paridad exacta** con `@ds-yoandry/core`: si cambias uno, actualiza el otro y regenera los fixtures de paridad

### Tests
- Cualquier nueva función en `@ds-yoandry/core` debe tener tests en `src/__tests__/` (`<módulo>.test.ts`)
- Cualquier nueva función en `ds_yoandry_core` debe tener tests en `test/` (`<módulo>_test.dart`)
- Si tocas el motor JS, corre `node tool/generate_parity_fixtures.js` y verifica que `parity_test.dart` sigue verde

### Documentación
- Actualizar el README del package afectado
- Actualizar `CHANGELOG.md` con el cambio

---

## Reportar bugs

Abre un [issue en GitHub](https://github.com/YoandryF/ds-yoandry/issues) con:

1. Descripción del problema
2. Pasos para reproducirlo
3. Comportamiento esperado vs actual
4. Versión del package y entorno (Node, framework, OS)

---

## Preguntas

Abre un issue con el label `question`.
