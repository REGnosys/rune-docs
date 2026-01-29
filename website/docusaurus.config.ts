import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Rune DSL',
  tagline: 'Rune DSL is a domain‑specific language (DSL) designed to bring clarity and consistency to how financial markets and other sectors describe their processes. Use it with the Rosetta platform to create models that generate consistent, machine‑readable representations of financial products and workflows.',
  favicon: '/img/rune/icon/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://rune-docs.netlify.app',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'rune-dsl', // Usually your GitHub org/user name.
  projectName: 'rune-dsl', // Usually your repo name.

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/REGnosys/rune-docs/tree/master/website',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/rune/icon/2024_Rune_Icon.svg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Rune DSL',
      logo: {
        alt: 'Rune DSL Logo',
        src: 'img/rune/icon/2024_Rune_Icon.svg',
      },
      items: [
        {
          href: 'https://github.com/finos/rune-dsl',
          label: 'Rune DSL',
          position: 'right',
        },
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Get started',
          href: '/docs/rune-documentation/get-started',
        },
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Components',
          href: '/docs/rune-documentation/rune-dsl-modelling-components',
        },
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Keyword search',
          href: '/docs/rune-documentation/get-started/keyword-search',
        },
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Developers',
          href: '/docs/rune-documentation/developers',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Get started',
          items: [
            {
              label: 'Get started',
              to: '/docs/rune-documentation/get-started',
            },
            {
              label: 'Keyword search',
              to: '/docs/rune-documentation/get-started/keyword-search',
            },
            {
              label: 'Modelling components',
              to: '/docs/rune-documentation/rune-dsl-modelling-components',
            },
          ],
        },
        {
          title: 'Developers',
          items: [
            {
              label: 'Rune and Java',
              to: '/docs/rune-documentation/developers/rune-and-java',
            },
            {
              label: 'Code generator',
              to: '/docs/rune-documentation/developers/code-generator',
            },
            {
              label: 'Contribute to Rune',
              to: '/docs/rune-documentation/developers/contribute-to-rune',
            },
          ]
        },
        {
          title: 'Resources',
          items: [
            {
              label: 'FAQs',
              href: '/docs/rune-documentation/resources/faqs',
            },
            {
              label: 'Glossary',
              href: '/docs/rune-documentation/resources/glossary',
            },
            {
              label: 'Contact us',
              href: '/docs/rune-documentation/resources/contact-us',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} REGnosys and the Rune DSL community`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['haskell'],
    },
  } satisfies Preset.ThemeConfig,

  themes: [
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      {
        hashed: true,
        // Optional: configure languages if needed
        language: ["en"]
      }
    ]
  ]
};

export default config;
