// src/app/api/merchant/me/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
    // Mock merchant data for testing
    const mockMerchant = {
        id: 1,
        name: 'Isaac Books',
        slug: 'isaac-books',
        service_type: 'both', // 'payment_collection', 'airtime_automation', or 'both'
        email: 'isaac@books.com',
        business_shortcode: '9203342',
        is_active: true
    };
    
    return NextResponse.json({ merchant: mockMerchant });
}