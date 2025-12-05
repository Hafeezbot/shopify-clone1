"use client"

import type React from "react"

import { useState } from "react"
import { X, ChevronRight, ChevronLeft, Menu, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SubMenuItem
{
    label: string
    items?: string[]
}

interface MenuItem
{
    label: string
    hasSubmenu?: boolean
    icon?: React.ReactNode
    submenu?: SubMenuItem[]
}

const mainMenuItems: MenuItem[] = [
    {
        label: "New & Featured",
        hasSubmenu: true,
        submenu: [
            { label: "New Releases" },
            { label: "Best Sellers" },
            { label: "Member Exclusive" },
            { label: "Trending" },
        ],
    },
    {
        label: "Men",
        hasSubmenu: true,
        submenu: [{ label: "Shoes" }, { label: "Clothing" }, { label: "Accessories" }, { label: "Sports" }],
    },
    {
        label: "Women",
        hasSubmenu: true,
        submenu: [{ label: "Shoes" }, { label: "Clothing" }, { label: "Accessories" }, { label: "Sports" }],
    },
    {
        label: "Kids",
        hasSubmenu: true,
        submenu: [{ label: "Boys" }, { label: "Girls" }, { label: "Baby & Toddler" }, { label: "Grade School" }],
    },
    {
        label: "Sale",
        hasSubmenu: true,
        submenu: [
            { label: "Men's Sale" },
            { label: "Women's Sale" },
            { label: "Kids' Sale" },
            { label: "Accessories Sale" },
        ],
    },
    { label: "SNKRS" },
]

export function MobileMenu()
{
    const [isOpen, setIsOpen] = useState(false)
    const [currentSubmenu, setCurrentSubmenu] = useState<MenuItem | null>(null)
    const [isSubmenuOpen, setIsSubmenuOpen] = useState(false)

    const toggleMenu = () =>
    {
        setIsOpen(!isOpen)
        if (!isOpen)
        {
            setCurrentSubmenu(null)
            setIsSubmenuOpen(false)
        }
    }

    const openSubmenu = (item: MenuItem) =>
    {
        if (item.hasSubmenu && item.submenu)
        {
            setCurrentSubmenu(item)
            setIsSubmenuOpen(true)
        }
    }

    const closeSubmenu = () =>
    {
        setIsSubmenuOpen(false)
        setTimeout(() => setCurrentSubmenu(null), 300) // Wait for animation to complete
    }

    return (
        <>
            {/* Menu Trigger Button */}
            <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Open menu">
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M3.5 7.5H20.5" stroke="#000000" strokeLinecap="round" />
                    <path d="M3.5 12H17.5" stroke="#000000" strokeLinecap="round" />
                    <path d="M3.5 16.5H20.5" stroke="#000000" strokeLinecap="round" />
                </svg>
            </Button>



            {/* Overlay */}
            {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={toggleMenu} />}

            {/* Mobile Menu */}
            <div
                className={`fixed top-0 right-0 h-full w-80 bg-white z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {/* Main Menu */}
                {!isSubmenuOpen && (
                    <div className="absolute inset-0">
                        {/* Header */}
                        <div className="flex justify-between items-center p-4 border-b">
                            <div className="flex items-center">
                                {/* Nike Swoosh */}
                                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M24 7.8L6.442 15.276c-1.456.616-2.679.925-3.668.925-1.456 0-2.525-.616-3.668-1.848 1.456 1.232 3.052 1.848 4.508 1.848 1.456 0 3.052-.616 4.508-1.232L24 7.8z" />
                                </svg>
                            </div>
                            <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Close menu">
                                <X className="h-6 w-6" />
                            </Button>
                        </div>

                        {/* Menu Content */}
                        <div className="flex flex-col h-full">
                            {/* Main Navigation */}
                            <nav className="flex-1 py-4">
                                <ul className="space-y-1">
                                    {mainMenuItems.map((item, index) => (
                                        <li key={index}>
                                            <button
                                                className="w-full flex items-center justify-between px-6 py-4 text-left text-lg font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                                                onClick={() => (item.hasSubmenu ? openSubmenu(item) : undefined)}
                                            >
                                                <span>{item.label}</span>
                                                {item.hasSubmenu && <ChevronRight className="h-5 w-5 text-gray-400" />}
                                            </button>
                                        </li>
                                    ))}
                                </ul>

                                {/* Jordan Section */}
                                <div className="mt-8 px-6">
                                    <div className="flex items-center space-x-3 py-4">
                                        {/* Jordan Jumpman Logo */}
                                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12.3 2.5c-.8 0-1.5.3-2.1.8L8.7 4.8c-.3.3-.7.5-1.1.5-.8 0-1.5-.7-1.5-1.5 0-.4.2-.8.5-1.1L8.1 1.2C9.3.4 10.8 0 12.3 0c3.3 0 6 2.7 6 6 0 1.5-.6 2.9-1.5 3.9l-1.5 1.5c-.3.3-.7.5-1.1.5-.8 0-1.5-.7-1.5-1.5 0-.4.2-.8.5-1.1l1.5-1.5c.5-.5.8-1.2.8-2 0-1.7-1.3-3-3-3z" />
                                        </svg>
                                        <span className="text-lg font-medium text-gray-900">Jordan</span>
                                    </div>
                                </div>
                            </nav>

                            {/* Membership Section */}
                            <div className="px-6 py-6 border-t bg-gray-50">
                                <div className="mb-4">
                                    <p className="text-sm text-gray-600 mb-4">
                                        Become a Nike Member for the best products, inspiration and stories in sport.{" "}
                                        <span className="font-semibold text-black underline cursor-pointer">Learn more</span>
                                    </p>
                                </div>
                                <div className="flex space-x-3">
                                    <Button className="flex-1 bg-black text-white hover:bg-gray-800 rounded-full">Join Us</Button>
                                    <Button variant="outline" className="flex-1 rounded-full border-gray-300">
                                        Sign In
                                    </Button>
                                </div>
                            </div>

                            {/* Help Section */}
                            <div className="px-6 py-4 border-t">
                                <button className="flex items-center space-x-3 text-gray-900 hover:bg-gray-50 w-full py-2 rounded-lg transition-colors">
                                    <HelpCircle className="h-5 w-5" />
                                    <span className="font-medium">Help</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Submenu */}
                {currentSubmenu && isSubmenuOpen && (
                    <div className="absolute inset-0">
                        {/* Submenu Header */}
                        <div className="flex items-center p-4 border-b">
                            <Button variant="ghost" size="icon" onClick={closeSubmenu} aria-label="Back to main menu">
                                <ChevronLeft className="h-6 w-6" />
                            </Button>
                            <h2 className="ml-2 text-lg font-semibold text-gray-900">{currentSubmenu.label}</h2>
                        </div>

                        {/* Submenu Content */}
                        <div className="py-4">
                            <ul className="space-y-1">
                                {currentSubmenu.submenu?.map((subItem, index) => (
                                    <li key={index}>
                                        <button className="w-full flex items-center justify-between px-6 py-4 text-left text-lg font-medium text-gray-900 hover:bg-gray-50 transition-colors">
                                            <span>{subItem.label}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}
