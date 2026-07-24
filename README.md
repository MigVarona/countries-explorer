# Countries Explorer

Aplicación cross-platform para explorar países mediante la API de
[REST Countries](https://restcountries.com/). El proyecto incluye una aplicación móvil con
Expo / React Native —la entrega principal— y una web companion sencilla con Next.js.

## Entrega

- **Código fuente:** este repositorio.
- **Android APK v1.0.0:** [descargar e instalar](https://expo.dev/artifacts/eas/QBD3TgwEKGgQ4kH8pIgEINukS4emqkgNuY2rSj3eL9o.apk).
- **Detalles de la build:** [Expo EAS Build](https://expo.dev/accounts/mivarona/projects/countries-explorer/builds/93d07509-dbdd-4cd2-9cba-2f91381ead21).
- **Web:** se ejecuta localmente siguiendo las instrucciones de este documento.

El APK es una build `preview` de distribución interna: se puede instalar directamente en un
dispositivo Android y no necesita que Metro ni Expo Go estén ejecutándose.

## Funcionalidades

### Aplicación móvil

- Lista de países con `FlatList` y carga incremental.
- Búsqueda por nombre con debounce.
- Filtros por región y favoritos persistidos.
- Detalle con bandera, capital, población, región y datos complementarios.
- Navegación mediante Expo Router y ruta dinámica `country/[id]`.
- Estados explícitos de carga, vacío y error con reintento.
- Interfaz en español e inglés.
- Detección del idioma del dispositivo y persistencia con AsyncStorage.
- Caché y estado de servidor con TanStack Query.
- Diseño adaptable de una a tres columnas.
- Soporte de SVG con fallback a PNG para las banderas.
- Prácticas básicas de accesibilidad.

### Web companion

- Next.js App Router y TypeScript.
- Lista y búsqueda de países con debounce.
- Detalle por país.
- Estados de carga, vacío y error.
- Carga incremental de resultados.
- Diseño responsive con Tailwind CSS.

## Capturas de la aplicación móvil

| Inicio | Lista de países | Detalle |
| --- | --- | --- |
| ![Pantalla de bienvenida](docs/screenshots/mobile-welcome.png) | ![Lista de países](docs/screenshots/mobile-list.png) | ![Detalle de un país](docs/screenshots/mobile-detail.png) |

También se incluyen ejemplos de
[favoritos](docs/screenshots/mobile-favorites.png),
[detalle ampliado](docs/screenshots/mobile-detail-more.png) y
[diseño horizontal](docs/screenshots/mobile-landscape.png).

## Tecnologías y versiones

| Tecnología | Versión usada |
| --- | --- |
| Node.js | 22.23.0 |
| npm | 10.9.8 |
| Expo SDK | 57.0.8 |
| React Native | 0.86.0 |
| React | 19.2.3 |
| Next.js | 15.5.21 |
| TypeScript | 5.8 / 6.0 |
| TanStack Query | 5.x |
| Tailwind CSS | 4.x |

## Estructura

```text
countries-explorer/
├── mobile/   Aplicación Expo / React Native
├── web/      Web companion con Next.js
└── shared/   Tipos, cliente API, mappers, formatters y lógica compartida
```

`@countries/shared` concentra la lógica de dominio reutilizada por móvil y web:

- Tipos TypeScript.
- Cliente de REST Countries.
- Normalización de respuestas.
- Búsqueda y ordenación.
- Formateo de población.
- Constantes.

Los componentes visuales no se comparten porque React Native y la web necesitan patrones de UI
diferentes.

## Requisitos

- Node.js 22.
- npm 10 o posterior.
- Una API key de [REST Countries](https://restcountries.com/sign-up).
- Expo Go, un emulador o un dispositivo Android/iOS para probar la aplicación móvil.

## Instalación

Desde la raíz:

```bash
npm install
```

El repositorio usa npm workspaces, por lo que este comando instala las dependencias de `shared`,
`mobile` y `web`.

## Variables de entorno

REST Countries v5 requiere autenticación. Los archivos reales de entorno están ignorados por Git.

### Móvil

```bash
cp mobile/.env.example mobile/.env
```

Editar `mobile/.env`:

```dotenv
EXPO_PUBLIC_RESTCOUNTRIES_API_KEY=your_api_key_here
```

### Web

```bash
cp web/.env.example web/.env.local
```

Editar `web/.env.local`:

```dotenv
NEXT_PUBLIC_RESTCOUNTRIES_API_KEY=your_api_key_here
```

Para llamadas desde el navegador, añadir `localhost` a los hostnames autorizados de la API key en
el panel de REST Countries.

> Las variables `EXPO_PUBLIC_*` y `NEXT_PUBLIC_*` se incluyen en el cliente y no deben considerarse
> secretas. No se deben reutilizar para credenciales privadas.

## Ejecutar la aplicación móvil

Desde la raíz:

```bash
npm run mobile
```

Después:

1. Escanear el QR con Expo Go, o
2. abrir la aplicación en un emulador/dispositivo compatible.

También se puede iniciar desde el workspace:

```bash
cd mobile
npx expo start
```

Si Expo conserva recursos antiguos:

```bash
npx expo start --clear
```

## Ejecutar la web

Desde la raíz:

```bash
npm run web
```

Abrir [http://localhost:3000](http://localhost:3000). Si el puerto está ocupado, Next.js mostrará
en la terminal el puerto alternativo utilizado.

## Tests y comprobaciones

Ejecutar todos los tests:

```bash
npm test
```

Comprobaciones de TypeScript:

```bash
npm run typecheck --workspace shared
npx tsc --noEmit -p mobile/tsconfig.json
npm run typecheck --workspace web
```

Compilar la web:

```bash
npm run build --workspace web
```

Los tests usan Vitest en `shared` y Jest / jest-expo en `mobile`.

## Generar el APK

La configuración `preview` de `mobile/eas.json` produce un APK instalable mediante EAS Build.

### 1. Instalar y autenticar EAS CLI

```bash
npm install --global eas-cli
eas login
```

### 2. Configurar la variable para el entorno preview

Crear `EXPO_PUBLIC_RESTCOUNTRIES_API_KEY` en:

```text
expo.dev → Project settings → Environment variables
```

Asignarla al entorno `preview`. También puede gestionarse con `eas env:create`.

### 3. Crear la build

```bash
cd mobile
eas build --platform android --profile preview
```

EAS proporciona al terminar:

- Un archivo `.apk`.
- Una URL de descarga.
- Un código QR para instalarlo.

Copiar la URL definitiva en la sección **Entrega** de este README. Para una entrega estable también
se puede adjuntar el APK a una GitHub Release.

## Decisiones técnicas

- **Monorepo con npm workspaces:** evita duplicar tipos y lógica entre plataformas.
- **TanStack Query en móvil:** estructura caché, carga, reintentos y errores de la API.
- **Filtrado local:** el conjunto de aproximadamente 250 países se descarga y cachea; las búsquedas
  posteriores son inmediatas y no consumen una petición por cada tecla.
- **Debounce:** evita operaciones innecesarias mientras el usuario escribe.
- **`cca3` como identificador:** proporciona claves estables para listas y rutas.
- **Expo Router:** mantiene rutas declarativas y detalle dinámico.
- **i18n solo obligatorio en móvil:** la web se mantiene intencionadamente simple.
- **Banderas SVG con fallback:** ofrece buena nitidez sin perder robustez.

## Simplificaciones y trade-offs

- La aplicación móvil concentra la mayor parte del diseño y funcionalidad, como requiere la prueba.
- La web no replica favoritos ni traducciones.
- La carga incremental limita el renderizado; no se implementó una paginación visual completa.
- La API key del cliente queda incorporada en las aplicaciones frontend y está sujeta a la cuota
  configurada en REST Countries.
- No se comparten componentes UI entre React Native y Next.js.
