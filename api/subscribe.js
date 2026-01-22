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

    // Check if credentials are set
    if (!apiKey || !publicationId) {
        console.error('Missing Beehiiv credentials.');
        console.error('BEEHIIV_API_KEY exists:', !!apiKey);
        console.error('BEEHIIV_PUBLICATION_ID exists:', !!publicationId);
        console.error('All env vars:', Object.keys(process.env).filter(k => k.includes('BEEHIIV')));
        return res.status(500).json({ 
            error: 'API not configured. Please add BEEHIIV_API_KEY and BEEHIIV_PUBLICATION_ID environment variables in Vercel settings and redeploy.' 
        });
    }

    try {
        // Prepare request body - Beehiiv API format
        const requestBody = {
            email: email,
            reactivate_existing: true,
            send_welcome_email: true
        };

        // Add UTM parameters if available
        if (data) {
            requestBody.utm_source = data.utm_source || 'unfeed-calculator';
            requestBody.utm_medium = data.utm_medium || 'web';
            requestBody.utm_campaign = data.utm_campaign || 'fee-calculator';
        }

        // Subscribe user to Beehiiv
        const subscribeResponse = await fetch(`https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!subscribeResponse.ok) {
            let errorData;
            try {
                errorData = await subscribeResponse.json();
            } catch (e) {
                errorData = { message: subscribeResponse.statusText || 'Unknown error' };
            }
            
            console.error('Beehiiv API error:', {
                status: subscribeResponse.status,
                statusText: subscribeResponse.statusText,
                error: errorData,
                publicationId: publicationId,
                email: email
            });
            
            // Handle specific error cases
            if (subscribeResponse.status === 400) {
                const errorMessage = errorData.message || errorData.error || errorData.detail || 'Invalid request. Please check your email address and publication ID.';
                return res.status(400).json({ 
                    error: `Beehiiv API error: ${errorMessage}` 
                });
            }
            
            if (subscribeResponse.status === 422) {
                return res.status(400).json({ 
                    error: 'Invalid email address or already subscribed.' 
                });
            }
            
            return res.status(500).json({ 
                error: `Beehiiv API error (${subscribeResponse.status}): ${errorData.message || errorData.error || 'Failed to subscribe. Please try again later.'}` 
            });
        }

        const result = await subscribeResponse.json();
        
        return res.status(200).json({ 
            success: true,
            message: 'Successfully subscribed! Check your email for your fee analysis report.',
            data: result
        });

    } catch (error) {
        console.error('Error subscribing to Beehiiv:', error);
        return res.status(500).json({ 
            error: 'An error occurred. Please try again later.' 
        });
    }
}
