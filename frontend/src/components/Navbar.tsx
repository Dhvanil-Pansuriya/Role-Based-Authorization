import { LogOut, User2, User } from "lucide-react"
import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate, useLocation } from "react-router-dom"
import Breadcrumbs from "../utils/Breadcrumbs"
import { logoutUser } from "../features/users/userSlice"
import { motion, AnimatePresence } from "framer-motion"
import { RootState } from "../app/store"

interface LayoutProps {
    children?: React.ReactNode
}

const Navbar: React.FC<LayoutProps> = ({ children }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()
    const [isPopupOpen, setIsPopupOpen] = useState(false)
    const popupRef = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)

    const user = useSelector((state: RootState) => state.user.userData)

    const handleLogout = () => {
        dispatch(logoutUser())
        navigate("/login")
    }

    const handleEditProfile = () => {
        navigate("/dashboard/profile")
        setIsPopupOpen(false)
    }

    const isDashboardRoute = location.pathname.startsWith("/dashboard")

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                popupRef.current &&
                !popupRef.current.contains(event.target as Node) &&
                !buttonRef.current?.contains(event.target as Node)
            ) {
                setIsPopupOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    const handleProfileClick = () => {
        setIsPopupOpen(!isPopupOpen)
    }

    return (
        <>
            <nav className="sticky top-0 z-10 bg-white flex items-center justify-between h-16 px-4 border-b ">
                {children}
                <div className="text-black text-xl font-bold">
                    <Link to="/" className="text-xl font-semibold hover:text-gray-700 transition-colors flex items-center gap-2 justify-center">
                        My App
                    </Link>
                </div>
                <div className="relative">

                    <button
                        ref={buttonRef}
                        className="flex items-center justify-center mr-1 w-10 h-10 text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-sm transition-colors"
                        onClick={handleProfileClick}
                    >
                        <User2 className="w-5 h-5" />
                    </button>

                    <AnimatePresence>
                        {isPopupOpen && (
                            <motion.div
                                ref={popupRef}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="absolute right-0 mt-4 w-80 bg-white rounded-sm shadow-lg overflow-hidden border border-gray-100"
                            >
                                <div className="px-6 py-4">
                                    <div className="flex space-x-4">
                                        <div className="h-16 w-16 rounded-sm bg-gray-100 flex items-center justify-center flex-shrink-0">
                                            <User2 className="w-8 h-8 text-gray-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-semibold text-gray-900 break-all hover:cursor-pointer" title={user?.name}>
                                                {user?.name}
                                            </h3>
                                            <p className="text-sm text-gray-500 break-all hover:cursor-pointer" title={user?.email}>
                                                {user?.email}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="border-t border-gray-100">
                                    <button
                                        onClick={handleEditProfile}
                                        className="flex items-center w-full px-6 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        <User className="w-5 h-5 mr-3" />
                                        <span className="text-sm font-medium">Profile</span>
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center w-full px-6 py-3 text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        <LogOut className="w-5 h-5 mr-3" />
                                        <span className="text-sm font-medium">Logout</span>
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </nav>
            <section className="sticky top-16 bg-gray-100 z-0 px-4 py-2">
                <Breadcrumbs />
            </section>
        </>
    )
}

export default Navbar