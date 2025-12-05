'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function AddToCartButton({ productId }: { productId: number })
{
    const [loading, setLoading] = useState(false);

    const handleAddToCart = async () =>
    {
        setLoading(true);

        try
        {
            const sessionRes = await fetch('/api/user-session');
            const sessionData = await sessionRes.json();

            if (!sessionRes.ok || !sessionData?.user?.email)
            {
                alert('⚠️ Failed to get user session. Please log in.');
                setLoading(false);
                return;
            }

            const email = sessionData.user.email;

            const res = await fetch('/api/cart/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, product_id: productId, quantity: 1 }),
            });

            const data = await res.json();

            if (res.ok)
            {
                alert('✅ Product added to cart!');
            } else
            {
                alert(`❌ Failed to add: ${data.error}`);
            }
        } catch (error)
        {
            console.error('Add to cart error:', error);
            alert('❌ Something went wrong.');
        } finally
        {
            setLoading(false);
        }
    };

    return (
        <Button onClick={handleAddToCart} disabled={loading}>
            {loading ? 'Adding...' : 'Add to Cart'}
        </Button>
    );
}
