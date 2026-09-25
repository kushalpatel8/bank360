'use client';

import { useState, useEffect } from 'react';
import { Customer, Interaction, FollowUp } from '@/types/customer';

interface UseCustomerResult {
  customer: Customer | null;
  interactions: Interaction[];
  followUps: FollowUp[];
  loading: boolean;
  error: string | null;
}

export function useCustomer(customerId: string): UseCustomerResult {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!customerId) return;
    fetch(`/api/customers/${customerId}`)
      .then((r) => {
        if (!r.ok) throw new Error('Customer not found');
        return r.json();
      })
      .then((d) => {
        setCustomer(d.customer);
        setInteractions(d.interactions || []);
        setFollowUps(d.followUps || []);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [customerId]);

  return { customer, interactions, followUps, loading, error };
}
