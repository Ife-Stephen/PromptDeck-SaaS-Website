import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import { supabase } from "@/integrations/supabase/client";

interface SubscriptionData {
  subscribed: boolean;
  subscription_tier: string;
  subscription_end?: string;
}

interface UsageData {
  prompts_used: number;
  limit: number;
}

export const useSubscription = () => {
  const { user, session } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionData>({
    subscribed: false,
    subscription_tier: 'free'
  });
  const [usage, setUsage] = useState<UsageData>({ prompts_used: 0, limit: 5 });
  const [loading, setLoading] = useState(true);

  const checkSubscription = async () => {
    if (!user || !session) return;
    
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      
      if (error) throw error;
      setSubscription(data);
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  const fetchUsage = async () => {
    if (!user) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('usage_tracking')
        .select('prompts_used')
        .eq('user_id', user.id)
        .eq('usage_date', today)
        .single();

      const prompts_used = data?.prompts_used || 0;
      const limits = { free: 5, pro: 1000, enterprise: 10000 };
      const limit = limits[subscription.subscription_tier as keyof typeof limits] || 5;
      
      setUsage({ prompts_used, limit });
    } catch (error) {
      console.error('Error fetching usage:', error);
      setUsage({ prompts_used: 0, limit: 5 });
    }
  };

  const trackUsage = async () => {
    if (!user) return false;

    if (usage.prompts_used >= usage.limit) {
      return false; // Usage limit exceeded
    }

    try {
      const today = new Date().toISOString().split('T')[0];
      const { error } = await supabase
        .from('usage_tracking')
        .upsert({
          user_id: user.id,
          usage_date: today,
          prompts_used: usage.prompts_used + 1
        }, { 
          onConflict: 'user_id,usage_date'
        });

      if (error) throw error;
      
      setUsage(prev => ({ ...prev, prompts_used: prev.prompts_used + 1 }));
      return true;
    } catch (error) {
      console.error('Error tracking usage:', error);
      return false;
    }
  };

  const createCheckout = async (plan: 'pro' | 'enterprise') => {
    if (!session) throw new Error('Not authenticated');

    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: { plan },
      headers: { Authorization: `Bearer ${session.access_token}` }
    });

    if (error) throw error;
    return data.url;
  };

  const openCustomerPortal = async () => {
    if (!session) throw new Error('Not authenticated');

    const { data, error } = await supabase.functions.invoke('customer-portal', {
      headers: { Authorization: `Bearer ${session.access_token}` }
    });

    if (error) throw error;
    window.open(data.url, '_blank');
  };

  useEffect(() => {
    if (user && session) {
      Promise.all([checkSubscription(), fetchUsage()]).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user, session]);

  useEffect(() => {
    if (subscription.subscription_tier) {
      fetchUsage();
    }
  }, [subscription.subscription_tier]);

  return {
    subscription,
    usage,
    loading,
    checkSubscription,
    trackUsage,
    createCheckout,
    openCustomerPortal,
    canUseFeature: usage.prompts_used < usage.limit
  };
};