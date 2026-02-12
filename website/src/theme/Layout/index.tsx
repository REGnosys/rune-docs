import React, {type ReactNode} from 'react';
import Layout from '@theme-original/Layout';
import type LayoutType from '@theme/Layout';
import type {WrapperProps} from '@docusaurus/types';
import {useLocation} from '@docusaurus/router';
import Link from '@docusaurus/Link';

type Props = WrapperProps<typeof LayoutType>;

export default function LayoutWrapper(props: Props): ReactNode {
  const {pathname} = useLocation();
  const isGlossary = pathname.includes('/resources/glossary');

  return (
    <Layout {...props}>
      {isGlossary && (
        <div className="container margin-top--lg">
          <nav className="pagination-nav" style={{marginBottom: '0.5rem'}}>
            <Link className="pagination-nav__link" to="/docs/resources" style={{border: '1px solid #e2e8f0'}}>
              <div className="pagination-nav__sublabel">« Return to</div>
              <div className="pagination-nav__label">Resources</div>
            </Link>
          </nav>
        </div>
      )}
      {props.children}
    </Layout>
  );
}
