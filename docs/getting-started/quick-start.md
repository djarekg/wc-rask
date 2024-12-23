---
description: Quick start with Brisa
related:
  title: Next Steps
  description: Learn about the files and folders in your Brisa project.
  links:
    - getting-started/project-structure
---

# Quick start

### System Requirements

- Bun [<w-badge type="tip" text="1.1.40" />](https://bun.sh/) or later
- macOS, Windows (including WSL), and Linux are supported.

### Automatic Installation

We recommend starting a new web component app using `bun create typescript`, which sets up everything automatically for you.

```sh
bun create wc-rask@latest
```

After the prompts, it will create a folder with your project name and install the required dependencies.

### Manual Installation

To manually create a new Brisa app, install the required packages:

```sh
bun install @wc-rask@latest
```

Open your package.json file and add the following scripts:

```json
{
  "scripts": {
    "dev": "bun dev",
    "build": "bun build",
    "start": "bun start"
  }
}
```

These scripts refer to the different stages of developing an application:

- `dev`: runs next dev to start Brisa in development mode.
- `build`: runs next build to build the application for production usage.
- `start`: runs next start to start a Brisa production server.

You need to add the jsx-runtime of Brisa in your `tsconfig.json` file:

```json
{
  "compilerOptions": {
    // ...rest
    "jsx": "react-jsx",
    "jsxImportSource": "brisa"
  }
}
```
