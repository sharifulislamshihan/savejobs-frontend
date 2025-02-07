import Link from "next/link"
import { Facebook, Twitter, Instagram } from "lucide-react"

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-black shadow-md dark:shadow-blue-900/20 py-5 md:p-8">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                        <Link
                            href="/privacy"
                            className="text-sm text-center sm:text-left text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="/terms"
                            className="text-sm text-center sm:text-left text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                        >
                            Terms of Service
                        </Link>
                        <Link
                            href="/contact"
                            className="text-sm text-center sm:text-left text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                        >
                            Contact Us
                        </Link>
                    </div>
                    <div className="flex space-x-4">
                        <a
                            href="https://facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                        >
                            <Facebook size={20} />
                        </a>
                        <a
                            href="https://twitter.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                        >
                            <Twitter size={20} />
                        </a>
                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                        >
                            <Instagram size={20} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer

