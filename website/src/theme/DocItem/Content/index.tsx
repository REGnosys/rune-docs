import React from 'react';
import clsx from 'clsx';
import { ThemeClassNames } from '@docusaurus/theme-common';
import { useDoc } from '@docusaurus/plugin-content-docs/client';
import Heading from '@theme/Heading';
import MDXContent from '@theme/MDXContent';
import DocTimestamps from '@theme/DocTimestamps';

function useSyntheticTitle() {
    const { metadata, frontMatter, contentTitle } = useDoc();
    const shouldRender =
        !frontMatter.hide_title && typeof contentTitle === 'undefined';
    if (!shouldRender) {
        return null;
    }
    return metadata.title;
}

export default function DocItemContent({ children }) {
    const syntheticTitle = useSyntheticTitle();
    return (
        <div className={clsx(ThemeClassNames.docs.docMarkdown, 'markdown')}>
            <DocTimestamps />
            {syntheticTitle && (
                <header>
                    <Heading as="h1">{syntheticTitle}</Heading>
                </header>
            )}
            <MDXContent>{children}</MDXContent>
        </div>
    );
}
