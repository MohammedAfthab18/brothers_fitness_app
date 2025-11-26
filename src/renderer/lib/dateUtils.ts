import { differenceInCalendarDays, addDays, addMonths, addYears } from 'date-fns';
import type { PlanType } from '@shared/types';

/**
 * Calculate end date based on plan type
 * Handles leap years and different month lengths correctly
 */
export function calculateEndDate(joinDate: Date, plan: PlanType): Date {
  const start = new Date(joinDate);
  
  switch (plan) {
    case '1day':
      return addDays(start, 1);
    
    case '1week':
      return addDays(start, 7);
    
    case '1month':
      return addMonths(start, 1);
    
    case '3months':
      return addMonths(start, 3);
    
    case '6months':
      return addMonths(start, 6);
    
    case '1year':
      // Use addYears to properly handle leap years
      return addYears(start, 1);
    
    default:
      throw new Error(`Invalid plan type: ${plan}`);
  }
}

/**
 * Calculate days remaining until membership expires
 * Returns negative number if expired
 */
export function calculateDaysLeft(endDate: Date): number {
  const today = new Date();
  // Set time to start of day for accurate comparison
  today.setHours(0, 0, 0, 0);
  
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  
  return differenceInCalendarDays(end, today);
}

/**
 * Get color class for days left indicator
 */
export function getDaysLeftColor(daysLeft: number): {
  bg: string;
  text: string;
  border: string;
} {
  if (daysLeft <= 0) {
    return {
      bg: 'bg-red-50',
      text: 'text-apple-red',
      border: 'border-apple-red/20'
    };
  }
  
  if (daysLeft <= 5) {
    return {
      bg: 'bg-orange-50',
      text: 'text-apple-orange',
      border: 'border-apple-orange/20'
    };
  }
  
  return {
    bg: 'bg-green-50',
    text: 'text-apple-green',
    border: 'border-apple-green/20'
  };
}

/**
 * Format date for display
 */
export function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Get plan display name
 */
export function getPlanDisplayName(plan: PlanType): string {
  const planMap: Record<PlanType, string> = {
    '1day': '1 Day',
    '1week': '1 Week',
    '1month': '1 Month',
    '3months': '3 Months',
    '6months': '6 Months',
    '1year': '1 Year'
  };
  
  return planMap[plan] || plan;
}

/**
 * Check if membership is expiring soon (within 5 days)
 */
export function isExpiringSoon(endDate: Date): boolean {
  const daysLeft = calculateDaysLeft(endDate);
  return daysLeft > 0 && daysLeft <= 5;
}

/**
 * Check if membership is expired
 */
export function isExpired(endDate: Date): boolean {
  return calculateDaysLeft(endDate) <= 0;
}