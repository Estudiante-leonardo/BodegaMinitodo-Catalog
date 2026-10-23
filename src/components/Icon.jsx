const paths = {
    arrow: 'M5 12h14m-6-6 6 6-6 6',
    northeast: 'M6 18 18 6M6 6h12v12',
    chevron: 'm9 5 7 7-7 7',
    search: 'm21 21-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
    filter: 'M4 7h16M4 17h16M8 4v6m8 4v6',
    close: 'm6 6 12 12M6 18 18 6',
    pin: 'M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0ZM15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
    clock: 'M12 8v4l3 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
    phone: 'm8 3 3 5-3 3a15 15 0 0 0 5 5l3-3 5 3-1 4c-1 3-9-1-13-5S0 3 3 2l5 1Z',
    bag: 'M4 7h16l1 14H3L4 7Zm4 1V6a4 4 0 0 1 8 0v2',
    store: 'M3 10v11h18V10M2 10l2-7h16l2 7M2 10a3 3 0 0 0 5 2 3 3 0 0 0 5 0 3 3 0 0 0 5 0 3 3 0 0 0 5-2M9 21v-6h6v6',
    check: 'm5 12 4 4L19 6',
    up: 'M12 20V4m-6 6 6-6 6 6',
    share: 'M12 16V3m-5 5 5-5 5 5M5 13v7h14v-7',
};

export default function Icon({ name, size = 20, ...props }) {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...props}><path d={paths[name] || paths.bag}/></svg>;
}
