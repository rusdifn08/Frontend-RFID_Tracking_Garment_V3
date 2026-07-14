import { useCallback } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Radio } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Breadcrumb from '../components/Breadcrumb';
import backgroundImage from '../assets/background.jpg';
import PageHeader from '../components/checking/PageHeader';
import RFIDInputSection from '../components/checking/RFIDInputSection';
import FiltersAndActions from '../components/checking/FiltersAndActions';
import { useCheckingRFIDSewingQuery } from '../hooks/useCheckingRFIDSewingQuery';

export default function CheckingRFIDSewing() {
    const {
        rfidInput,
        setRfidInput,
        inputRef,
        checkItems,
        setCheckItems,
        isChecking,
        filterStatus,
        setFilterStatus,
        searchQuery,
        setSearchQuery,
        handleRfidCheck,
        handleKeyPress,
        filteredItems,
    } = useCheckingRFIDSewingQuery();

    const handleCheckRFID = useCallback(() => {
        handleRfidCheck(rfidInput);
    }, [handleRfidCheck, rfidInput]);

    return (
        <div className="flex min-h-screen w-full h-screen font-sans overflow-x-hidden fixed inset-0 m-0 p-0"
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: '100% 100%',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'fixed',
            }}
        >
            <div className="fixed left-0 top-0 h-full z-50 shadow-xl">
                <Sidebar />
            </div>

            <div
                className="flex flex-col w-full h-screen transition-all duration-300 ease-in-out"
                style={{
                    marginLeft: 'var(--layout-sidebar-offset)',
                    width: 'var(--layout-sidebar-width)',
                }}
            >
                <div className="sticky top-0 z-40 shadow-md">
                    <Header />
                </div>

                <Breadcrumb />

                <main 
                    className="flex-1 p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6 space-y-3 xs:space-y-4 sm:space-y-5 md:space-y-6 pt-2 xs:pt-3 sm:pt-4 overflow-y-auto min-h-0"
                    style={{
                        WebkitOverflowScrolling: 'touch',
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#cbd5e1 #f1f5f9',
                        paddingBottom: 'clamp(2rem, 4vh, 4rem)'
                    }}
                >
                    <PageHeader theme="sewing" title="Checking Batch" subtitle="Monitor status proses Batch untuk RFID bundles di Sewing" />
                    
                    <RFIDInputSection
                        theme="sewing"
                        rfidInput={rfidInput}
                        setRfidInput={setRfidInput}
                        inputRef={inputRef}
                        isChecking={isChecking}
                        onKeyPress={handleKeyPress}
                        onCheck={handleCheckRFID}
                        checkItems={checkItems as any}
                    />

                    <FiltersAndActions
                        theme="sewing"
                        checkItems={checkItems}
                        setCheckItems={setCheckItems}
                        filterStatus={filterStatus}
                        setFilterStatus={setFilterStatus}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        setRfidInput={setRfidInput}
                    />

                    <div className="bg-white border-2 border-purple-200 rounded-lg p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6">
                        <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 xs:gap-3 mb-3 xs:mb-4 sm:mb-5 md:mb-6">
                            <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 tracking-wide" style={{ textTransform: 'capitalize' }}>
                                Check Results
                            </h2>
                            <span className="text-gray-600 font-mono text-[10px] xs:text-xs sm:text-sm md:text-base">
                                {filteredItems.length} of {checkItems.length} items
                            </span>
                        </div>

                        <div className="space-y-4 max-h-[300px] xs:max-h-[400px] sm:max-h-[450px] md:max-h-[500px] lg:max-h-[600px] overflow-y-auto custom-scrollbar">
                            {filteredItems.length === 0 ? (
                                <div className="text-center py-8 xs:py-12 sm:py-16 text-gray-400">
                                    <Radio className="w-12 xs:w-16 sm:w-20 md:w-24 h-12 xs:h-16 sm:h-20 md:h-24 mx-auto mb-2 xs:mb-3 sm:mb-4 opacity-30" />
                                    <p className="text-sm xs:text-base sm:text-lg md:text-xl font-medium">Belum ada data checking</p>
                                    <p className="text-[10px] xs:text-xs sm:text-sm md:text-base mt-1 xs:mt-2">Scan atau ketik RFID bundle untuk memulai checking</p>
                                </div>
                            ) : (
                                filteredItems.map((item, index) => (
                                    <div
                                        key={`${item.rfid}-${index}`}
                                        className={`relative p-3 sm:p-5 rounded-lg border-2 bg-white transition-all duration-300 ${
                                            item.status === 'found' ? 'border-purple-200 hover:shadow-lg hover:border-purple-300' : 'border-gray-200'
                                        }`}
                                    >
                                        <div className="flex items-start gap-3 sm:gap-4">
                                            <div className={`p-2 sm:p-3 rounded-lg border flex-shrink-0 ${
                                                item.status === 'found' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                                            }`}>
                                                {item.status === 'found' ? (
                                                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                                                ) : (
                                                    <XCircle className="w-6 h-6 text-red-500" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                                    <span className="font-mono text-lg sm:text-xl font-bold text-gray-800 break-all">
                                                        {item.rfid}
                                                    </span>
                                                    <span className="text-xs sm:text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-lg whitespace-nowrap">
                                                        {item.timestamp.toLocaleTimeString()}
                                                    </span>
                                                </div>
                                                <div className="mb-2">
                                                    <span className={`text-xs sm:text-sm font-bold px-3 py-1 rounded-lg ${
                                                        item.status === 'found' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                    }`}>
                                                        {item.status === 'found' ? '✓ Found' : '✗ Not Found'}
                                                    </span>
                                                </div>
                                                {item.details && (
                                                    <p className="text-xs sm:text-sm text-gray-600 mb-4">
                                                        {item.details}
                                                    </p>
                                                )}

                                                {/* Batches Table */}
                                                {item.status === 'found' && item.batches && item.batches.length > 0 && (
                                                    <div className="mt-4 border border-purple-100 rounded-lg overflow-hidden">
                                                        <div className="bg-purple-50 px-4 py-2 border-b border-purple-100 font-bold text-sm text-purple-900">
                                                            Status Proses Batch
                                                        </div>
                                                        <div className="overflow-x-auto">
                                                            <table className="w-full text-sm text-left">
                                                                <thead className="text-xs text-gray-500 bg-gray-50 uppercase">
                                                                    <tr>
                                                                        <th className="px-4 py-2 border-b">Batch</th>
                                                                        <th className="px-4 py-2 border-b">Proses</th>
                                                                        <th className="px-4 py-2 border-b">IN</th>
                                                                        <th className="px-4 py-2 border-b">OUT</th>
                                                                        <th className="px-4 py-2 border-b">Tapping</th>
                                                                        <th className="px-4 py-2 border-b">Status</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {item.batches.map((batch, bIndex) => {
                                                                        const isComplete = batch.status_batch?.toUpperCase() === 'COMPLETE';
                                                                        const isLengkap = batch.status_batch?.toUpperCase() === 'BELUM LENGKAP';
                                                                        
                                                                        let statusColor = 'text-gray-600 bg-gray-100';
                                                                        if (isComplete) statusColor = 'text-green-700 bg-green-100 font-semibold';
                                                                        else if (isLengkap) statusColor = 'text-amber-700 bg-amber-100 font-semibold';

                                                                        return (
                                                                            <tr key={bIndex} className="bg-white border-b hover:bg-gray-50 last:border-0">
                                                                                <td className="px-4 py-2 text-gray-900 font-medium">B{batch.batch_no}</td>
                                                                                <td className="px-4 py-2 text-gray-600">{batch.ket_batch}</td>
                                                                                <td className="px-4 py-2">
                                                                                    {batch.has_in ? (
                                                                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                                                    ) : (
                                                                                        <span className="text-gray-300">-</span>
                                                                                    )}
                                                                                </td>
                                                                                <td className="px-4 py-2">
                                                                                    {batch.has_out ? (
                                                                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                                                    ) : (
                                                                                        <span className="text-gray-300">-</span>
                                                                                    )}
                                                                                </td>
                                                                                <td className="px-4 py-2 text-gray-600 text-xs">{batch.status_tapping}</td>
                                                                                <td className="px-4 py-2">
                                                                                    <span className={`text-[10px] sm:text-xs px-2 py-1 rounded-md ${statusColor}`}>
                                                                                        {batch.status_batch}
                                                                                    </span>
                                                                                </td>
                                                                            </tr>
                                                                        );
                                                                    })}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
