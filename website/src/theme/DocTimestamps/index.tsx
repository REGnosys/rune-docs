import React from 'react';
import { useDoc } from '@docusaurus/plugin-content-docs/client';

export default function DocTimestamps() {
    const { metadata, frontMatter } = useDoc();
    const { lastUpdatedAt } = metadata;
    const published = (frontMatter as any).published;

    if (!published && !lastUpdatedAt) {
        return null;
    }

    const formatDate = (date: string | number) => {
        if (!date) return null;
        return new Date(date).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <div className="doc-timestamps">
            {published && (
                <div className="timestamp-item">
                    <span className="timestamp-label">Published: </span>
                    <span className="timestamp-value">{formatDate(published as string)}</span>
                </div>
            )}
            {lastUpdatedAt && (
                <div className="timestamp-item">
                    <span className="timestamp-label">Updated: </span>
                    <span className="timestamp-value">{formatDate(lastUpdatedAt)}</span>
                </div>
            )}
        </div>
    );
}
