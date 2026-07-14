/** Area Monitoring RFID (tombol biru → /checking-rfid). */
export function isMonitoringCheckingArea(pathname: string): boolean {
    return (
        pathname === '/monitoring-rfid' ||
        pathname.startsWith('/line/') ||
        pathname.startsWith('/dashboard-rfid/') ||
        pathname === '/checking-rfid'
    );
}

/** Area Cutting (tombol hijau → /checking-rfid-cutting). */
export function isCuttingCheckingArea(pathname: string): boolean {
    return (
        pathname === '/cutting' ||
        pathname.startsWith('/dashboard-cutting') ||
        pathname.startsWith('/daftar-rfid-cutting') ||
        pathname.startsWith('/dashboard-qc-cutting') ||
        pathname.startsWith('/dashboard-supermarket-cutting') ||
        pathname.startsWith('/dashboard-supply-sewing-cutting') ||
        pathname === '/checking-rfid-cutting'
    );
}

/** Area Sewing (tombol ungu → /checking-rfid-sewing). */
export function isSewingCheckingArea(pathname: string): boolean {
    return (
        pathname === '/sewing' ||
        pathname.startsWith('/sewing/line/') ||
        pathname.startsWith('/dashboard-sewing-line') ||
        pathname === '/sewing/rfid-identity' ||
        pathname === '/checking-rfid-sewing'
    );
}
