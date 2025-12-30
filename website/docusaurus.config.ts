import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Rune DSL',
  tagline: 'Rune DSL is a domain‑specific language (DSL) designed to bring clarity and consistency to how financial markets and other sectors describe their processes. Use it with the Rosetta platform to create models that generate consistent, machine‑readable representations of financial products and workflows.',
  favicon: 'img/img/rune/Icon/favicon.ico',

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
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Rune DSL',
      logo: {
        alt: 'Rune DSL Logo',
        src: 'img/rune/Icon/2024_Rune_Icon.svg',
      },
      items: [
        {
          href: 'https://github.com/finos/rune-dsl',
          label: 'Rune DSL',
          position: 'right',
        },
        {
          type: 'doc',
          docId: 'rune-documentation/overview/overview',
          position: 'left',
          label: 'Overview',
        },
        {
          type: 'doc',
          docId: 'rune-documentation/modelling-components/modelling-components',
          position: 'left',
          label: 'Components',
        },
        {
          type: 'doc',
          docId: 'rune-documentation/developers/developers',
          position: 'left',
          label: 'Developers',
        },
        {
          type: 'doc',
          docId: 'rune-documentation/resources/faqs',
          position: 'left',
          label: 'FAQs',
        }, {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Case studies',
          // href: '/docs/rune-documentation/resources/case-studies',
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
              to: '/docs/rune-documentation/overview/get-started',
            },
            {
              label: 'Keyword search',
              to: '/docs/rune-documentation/overview/keyword-search',
            },
            {
              label: 'Modelling components',
              to: '/docs/rune-documentation/modelling-components',
            },
          ],
        },
        {
          title: 'Questions and stories',
          items: [
            {
              label: 'FAQs',
              href: '/docs/rune-documentation/resources/faqs',
            },
          ]
        },
        {
          title: 'More',
          items: [
            {
              label: 'Developers',
              href: '/docs/rune-documentation/developers',
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
};

export default config;
