---
nav_title: What is @wc-rask?
description: Discover what @wc-rask component library is
---

# What is @wc-rask?

> [!WARNING]
>
> The 0.x versions of @wc-rask are considered experimental, use it for experimentation, we do not recommend using it in production until 1.x. Please help us to improve it by testing and giving feedback, we are open to suggestions and contributions to make it better.

@wc-rask is a web framework inspired by the others, taking the best of each one.

**Features** ✨


## Inspirations

### Bun.js

Bun.js makes it easy for many new frameworks to emerge thanks to its API such as the Next.js style page system, TypeScript support and JSX by default. Besides, it is super fast and the DX of working with it is awesome.

In @wc-rask we don't use Webpack, Turbopack, Vite or esbuild, we use directly [Bun.build](https://bun.sh/docs/bundler), which is faster than esbuild.

### Lit

@wc-rask was inspired by Lit to use the platform more. Today we have web components and there is [Declarative Shadow DOM](https://developer.chrome.com/docs/css-ui/declarative-shadow-dom), so we can SSR web components.

If well abstracted, the code of a web component can be smaller than using a library. Moreover, it also makes it easier to control when a prop changes, when it is unmounted and to have web components mixed with server components without problems.

We liked the idea of consuming web components as web components from JSX. That is, reading the code you know when a component is a server `<Server />` or when it is a web component `<web-component />`. We want developers to be able to easily distinguish the use of both.

The fact of using web components makes it more comfortable to debug the code as well, accessing directly to the web components from the DevTools elements, without any extension.

### HTMX

HTMX has inspired @wc-rask to make the use of web components less and less necessary and the rest of the components are server components. Here we mix the concept of server actions with HTMX ideas such as indicators, debounce, etc.

Another thing that inspired us a lot is the fact of using more Hypermedia. @wc-rask's server actions respond with HTML that reactively updates the DOM. It also makes it easier to debug by looking at the Network tab in DevTools and see what the server action returns.
