import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface BreadCrumbItem {
    label: string;
    path: string;
}

const generateBreadcrumbs = (pathname: string): BreadCrumbItem[] => {
    const pathnames = pathname.split('/').filter((x) => x);
    const breadcrumbs: BreadCrumbItem[] = [
        { label: 'Home', path: '/' },
    ];

    pathnames.forEach((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        breadcrumbs.push({
            label: decodeURIComponent(value.charAt(0).toUpperCase() + value.slice(1)),
            path: to,
        });
    });

    return breadcrumbs;
};

const BreadCrumbs: React.FC<{page: string}> = ({page}) => {
    const location = useLocation();
    const breadcrumbs = generateBreadcrumbs(location.pathname);

    return (
        <nav aria-label="breadcrumb" className='d-flex mb-3'>
            <h1 className="text-2xl font-semibold text-gray-900">{page}</h1>
            {/* <ol style={{ display: 'flex', listStyle: 'none', padding: 0, margin: 0 }}>
                {breadcrumbs.map((crumb, idx) => (
                    <li key={crumb.path} style={{ display: 'flex', alignItems: 'center' }}>
                        {idx < breadcrumbs.length - 1 ? (
                            <>
                                <Link to={crumb.path}>{crumb.label}</Link>
                                <span style={{ margin: '0 8px' }}>/</span>
                            </>
                        ) : (
                            <span>{crumb.label}</span>
                        )}
                    </li>
                ))}
            </ol> */}
        </nav>
    );
};

export default BreadCrumbs;