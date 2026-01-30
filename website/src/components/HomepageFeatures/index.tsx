import type { ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
  link?: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Rune keywords',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Search for a keyword to find the modelling component info you want, fast.
      </>
    ),
    link: '/docs/get-started/keyword-search',
  },
  {
    title: 'Components',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Our modelling components and how they work, with examples to show each feature.
      </>
    ),
    link: '/docs/modelling-components',
  },
  {
    title: 'Get started',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        New to Rune? Interested in data modelling? Start here to find out all you need to know.
      </>
    ),
    link: '/docs/get-started/introduction',
  },
];

function Feature({ title, Svg, description, link }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        {/*<Svg className={styles.featureSvg} role="img" />*/}
      </div>
      <div className="text--center padding-horiz--md">
        {link ? (
          <Link to={link}>
            <h3>{title}</h3>
          </Link>
        ) : (
          <Heading as="h3">{title}</Heading>
        )}
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
