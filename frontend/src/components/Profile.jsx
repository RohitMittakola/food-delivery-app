import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");

    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) {
            navigate("/login");
            return;
        }

        const fetchUserProfile = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/auth/profile/${userId}`);
                setUserData(res.data);
            } catch (error) {
                console.error("Failed to fetch profile", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [userId, navigate]);

    if (loading) {
        return <div className="text-center py-20 text-gray-500 font-medium">Loading profile...</div>;
    }

    if (!userData) {
        return <div className="text-center py-20 text-red-500 font-medium">Error loading profile data.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-gray-900">My Account</h1>
                <p className="text-gray-600 mt-2">Manage your personal information and health goals.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header Section */}
                <div className="bg-gray-900 px-8 py-6 flex items-center space-x-6">
                    <div className="h-20 w-20 bg-orange-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-inner">
                        {userData.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">{userData.name}</h2>
                        <p className="text-gray-400">{userData.email}</p>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="p-8">
                    <h3 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-2 mb-6">Health Profile</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <p className="text-sm text-gray-500 font-medium mb-1">Age</p>
                            <p className="text-xl font-bold text-gray-900">{userData.age || "--"}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <p className="text-sm text-gray-500 font-medium mb-1">Height</p>
                            <p className="text-xl font-bold text-gray-900">{userData.height ? `${userData.height} m` : "--"}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <p className="text-sm text-gray-500 font-medium mb-1">Weight</p>
                            <p className="text-xl font-bold text-gray-900">{userData.weight ? `${userData.weight} kg` : "--"}</p>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                            <p className="text-sm text-orange-600 font-medium mb-1">Primary Goal</p>
                            <p className="text-lg font-bold text-orange-800">{userData.goal || "Not Set"}</p>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            onClick={() => navigate('/diet-plan')}
                            className="bg-gray-900 hover:bg-orange-600 text-white font-medium px-6 py-2.5 rounded-lg transition-colors duration-200">
                            Edit Health Data
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;