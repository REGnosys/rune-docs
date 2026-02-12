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
          <div style={{marginBottom: '1rem'}}>
            <Link className="button button--outline button--primary button--sm" to="/docs/resources">
              « Return to Resources
            </Link>
          </div>
        </div>
      )}
      {props.children}
    </Layout>
  );
}
