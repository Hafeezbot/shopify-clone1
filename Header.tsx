'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FiShoppingCart, FiUser } from 'react-icons/fi';

import { MobileMenu } from '../components/mobile-menu';

export default function Header()
{
    const [search, setSearch] = useState('');
    const [cartCount, setCartCount] = useState(0);

    useEffect(() =>
    {
        const fetchCartCount = async () =>
        {
            try
            {
                const sessionRes = await fetch('/api/user-session');
                const session = await sessionRes.json();
                const email = session?.user?.email;
                if (!email) return;

                const cartRes = await fetch(`/api/cart/list?email=${email}`);
                const cartItems = await cartRes.json();

                const totalQuantity = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
                setCartCount(totalQuantity);
            }
            catch (err)
            {
                console.error('Failed to fetch cart count', err);
            }
        };

        fetchCartCount();
    }, []);

    const handleSearch = (e: React.FormEvent) =>
    {
        e.preventDefault();
        if (search.trim())
        {
            window.location.href = `/search?q=${search}`;
        }
    };

    return (
        <header className="shadow-md sticky top-0 z-50 bg-white">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                {/* Left Section: Mobile Menu + Logo */}
                <div className="flex items-center gap-4">
                    <MobileMenu />
                    <Link href="/" className="text-2xl font-bold text-black">JungleLion</Link>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex gap-6 text-sm font-medium">
                    <Link href="/shop" className="hover:text-blue-600">Shop</Link>
                    <Link href="/categories" className="hover:text-blue-600">Categories</Link>
                    <Link href="/about" className="hover:text-blue-600">About</Link>
                    <Link href="/contact" className="hover:text-blue-600">Contact</Link>
                </nav>

                {/* Search + Icons */}
                <div className="flex items-center gap-4">
                    <form onSubmit={handleSearch} className="hidden md:flex border rounded-md overflow-hidden">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="px-3 py-1 outline-none w-40"
                            placeholder="Search products..."
                        />
                        <button type="submit" className="bg-blue-600 text-white px-3 py-1">Search</button>
                    </form>

                    {/* Cart Icon + Count */}
                    <Link href="/cart" className="relative text-xl text-gray-700 hover:text-black">
                        <FiShoppingCart />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {/* User Icon */}
                    <Link href="/login" className="text-xl text-gray-700 hover:text-black">
                        <FiUser />
                    </Link>
                </div>
            </div>
        </header>
    );
}
