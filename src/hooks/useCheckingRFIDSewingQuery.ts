import { useMutation } from '@tanstack/react-query';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { API_BASE_URL, getDefaultHeaders } from '../config/api';

export interface RFIDSewingBatchItem {
  batch_no: number;
  batch_value: number;
  rfid_batch: string;
  ket_batch: string;
  has_in: number;
  has_out: number;
  status_tapping: string;
  status_batch: string;
}

export interface RFIDSewingCheckItem {
  rfid: string;
  timestamp: Date;
  status: 'found' | 'not_found' | 'checking';
  details?: string;
  id_bundles?: number;
  batches?: RFIDSewingBatchItem[];
}

interface UseCheckingRFIDSewingReturn {
  rfidInput: string;
  setRfidInput: (value: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  checkItems: RFIDSewingCheckItem[];
  setCheckItems: React.Dispatch<React.SetStateAction<RFIDSewingCheckItem[]>>;
  isChecking: boolean;
  filterStatus: 'all' | 'found' | 'not_found';
  setFilterStatus: (value: 'all' | 'found' | 'not_found') => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  handleRfidCheck: (rfid: string) => Promise<void>;
  handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  filteredItems: RFIDSewingCheckItem[];
}

const fetchSewingBatchCheck = async (rfid: string): Promise<any> => {
  const url = `${API_BASE_URL}/api/sewing/check/batch?rfid_garment=${encodeURIComponent(rfid)}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      ...getDefaultHeaders(),
      'rfid-key': '0011779933', // as required by API
    },
  });

  if (!response.ok) {
    let errorMessage = 'RFID tidak ditemukan';
    try {
      const errData = await response.json();
      if (errData.message || errData.messages) {
        errorMessage = errData.message || errData.messages;
      }
    } catch (e) {
      // Ignore JSON parse error on non-ok responses
    }
    throw new Error(errorMessage);
  }

  return await response.json();
};

export const useCheckingRFIDSewingQuery = (): UseCheckingRFIDSewingReturn => {
  const [rfidInput, setRfidInput] = useState('');
  const [checkItems, setCheckItems] = useState<RFIDSewingCheckItem[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'found' | 'not_found'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, []);

  const checkRFIDMutation = useMutation({
    mutationFn: fetchSewingBatchCheck,
    onSuccess: (data, rfid) => {
      const timestamp = new Date();
      let newItem: RFIDSewingCheckItem;

      if ((data.status === 'success' || data.code === 200) && data.data) {
        newItem = {
          rfid: rfid.trim(),
          timestamp,
          status: 'found',
          id_bundles: data.data.id_bundles,
          batches: data.data.batches || [],
          details: data.messages || 'Data status batch berhasil ditampilkan.',
        };
      } else {
        newItem = {
          rfid: rfid.trim(),
          timestamp,
          status: 'not_found',
          details: data.messages || data.message || 'RFID tidak ditemukan di database',
        };
      }

      setCheckItems(prev => [newItem, ...prev]);
      setRfidInput('');
      setIsChecking(false);

      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    },
    onError: (error, rfid) => {
      const timestamp = new Date();
      const newItem: RFIDSewingCheckItem = {
        rfid: rfid.trim(),
        timestamp,
        status: 'not_found',
        details: error instanceof Error ? error.message : 'Error saat checking RFID',
      };
      setCheckItems(prev => [newItem, ...prev]);
      setRfidInput('');
      setIsChecking(false);

      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    },
  });

  const handleRfidCheck = useCallback(async (rfid: string) => {
    if (!rfid.trim()) return;

    const trimmedRfid = rfid.trim();
    setIsChecking(true);

    setTimeout(() => {
      checkRFIDMutation.mutate(trimmedRfid);
    }, 500);
  }, [checkRFIDMutation]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isChecking) {
      handleRfidCheck(rfidInput);
    }
  }, [isChecking, rfidInput, handleRfidCheck]);

  const filteredItems = useMemo(() => {
    return checkItems.filter(item => {
      const matchStatus = filterStatus === 'all' || item.status === filterStatus;
      const matchSearch = !searchQuery.trim() || 
        item.rfid.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [checkItems, filterStatus, searchQuery]);

  return {
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
  };
};
