// Beehiiv API Integration - Serverless Function
// Deploy this to Vercel, Netlify, or your preferred serverless platform
// 
// Setup Instructions:
// 1. Get your Beehiiv API key from: Settings → API in your Beehiiv dashboard
// 2. Get your Publication ID from your Beehiiv publication settings
// 3. Set environment variables:
//    - BEEHIIV_API_KEY=your_api_key_here
//    - BEEHIIV_PUBLICATION_ID=your_publication_id_here
//
// For Vercel: Add these in Project Settings → Environment Variables
// For Netlify: Add these in Site Settings → Environment Variables

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, data } = req.body;

    // Validate email
    if (!email || !email.includes('@')) {
        return res.status(400).json({ error: 'Valid email is required' });
    }

    // Get credentials from environment variables
    const apiKey = process.env.BEEHIIV_API_KEY;
    const publicationId = process.env.BEEHIIV_PUBLICATION_ID;

    if (!apiKey || !publicationId) {
        console.error('Beehiiv credentials not configured');
        return res.status(500).json({ 
            error: 'Beehiiv API not configured. Please set BEEHIIV_API_KEY and BEEHIIV_PUBLICATION_ID environment variables.' 
        });
    }

    try {
        // Add subscriber to Beehiiv
        const beehiivResponse = await fetch(`https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                reactivate_existing: false, // Set to true if you want to reactivate unsubscribed users
                send_welcome_email: true,
                utm_source: 'unfeed',
                utm_medium: 'calculator',
                utm_campaign: 'fee_analysis',
                custom_fields: {
                    loss_amount: data?.lossAmount || '',
                    monthly_revenue: data?.revenue || '',
                    platforms: data?.platforms || ''
                }
            })
        });

        if (!beehiivResponse.ok) {
            const errorData = await beehiivResponse.json();
            console.error('Beehiiv API error:', errorData);
            
            // Handle specific error cases
            if (beehiivResponse.status === 409) {
                return res.status(200).json({ 
                    success: true, 
                    message: 'Email already subscribed' 
                });
            }
            
            throw new Error(errorData.message || `Beehiiv API error: ${beehiivResponse.status}`);
        }

        const result = await beehiivResponse.json();

        // Optional: Send email with breakdown using a service like Resend, SendGrid, etc.
        // For now, we'll just add them to the list
        
        return res.status(200).json({ 
            success: true, 
            message: 'Successfully subscribed!',
            data: result
        });

    } catch (error) {
        console.error('Subscription error:', error);
        return res.status(500).json({ 
            error: error.message || 'Failed to subscribe. Please try again.' 
        });
    }
}

// For Netlify Functions, use this format instead:
/*
exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    const { email, data } = JSON.parse(event.body);
    const apiKey = process.env.BEEHIIV_API_KEY;
    const publicationId = process.env.BEEHIIV_PUBLICATION_ID;

    // ... rest of the code same as above, but return:
    return {
        statusCode: 200,
        body: JSON.stringify({ success: true, message: 'Successfully subscribed!' })
    };
};
*/
