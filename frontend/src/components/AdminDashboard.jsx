import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("menu");
    const [isLoading, setIsLoading] = useState(true);

    // Data States
    const [menuItems, setMenuItems] = useState([]);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);

    // Modal State for Add Food
    const [showModal, setShowModal] = useState(false);
    const [newFood, setNewFood] = useState({
        name: "", price: "", category: "Protein", calories: "", protein: "", sugarFree: false
    });

    const token = localStorage.getItem("token");

    const fetchData = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };

            if (activeTab === "menu") {
                const res = await axios.get("http://16.16.76.27:5000/api/food");
                setMenuItems(res.data);
            } else if (activeTab === "orders") {
                const res = await axios.get("http://16.16.76.27:5000/api/admin/orders", config);
                setOrders(res.data);
            } else if (activeTab === "users") {
                const res = await axios.get("http://16.16.76.27:5000/api/admin/users", config);
                setUsers(res.data);
            }
        } catch (err) {
            console.error("Error fetching data:", err);
        }
    };

    useEffect(() => {
        const verify = async () => {
            try {
                await axios.get("http://16.16.76.27:5000/api/admin/verify", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setIsLoading(false);
                fetchData();
            } catch (err) {
                navigate("/");
            }
        };
        verify();
    }, [activeTab, navigate]);

    const handleAddFood = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://16.16.76.27:5000/api/admin/food", newFood, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowModal(false);
            fetchData(); // Refresh table
            setNewFood({ name: "", price: "", category: "Protein", calories: "", protein: "", sugarFree: false });
        } catch (err) {
            alert("Error adding food");
        }
    };

    // THE NEW ADMIN SUPERPOWER: Update Order Status
    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        try {
            await axios.put(`http://16.16.76.27:5000/api/admin/orders/${orderId}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchData(); // Instantly refresh the orders list!
        } catch (err) {
            alert("Failed to update order status");
        }
    };

    if (isLoading) return <div className="text-center py-20">Verifying Admin...</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* SIDEBAR */}
            <div className="w-64 bg-gray-900 text-white flex flex-col p-6 space-y-4">
                <h1 className="text-2xl font-black text-orange-500 mb-6">BroBite Admin</h1>
                <button onClick={() => setActiveTab("menu")} className={`p-3 rounded-lg text-left ${activeTab === "menu" ? "bg-orange-600" : "hover:bg-gray-800"}`}>🍔 Menu</button>
                <button onClick={() => setActiveTab("orders")} className={`p-3 rounded-lg text-left ${activeTab === "orders" ? "bg-orange-600" : "hover:bg-gray-800"}`}>📦 Orders</button>
                <button onClick={() => setActiveTab("users")} className={`p-3 rounded-lg text-left ${activeTab === "users" ? "bg-orange-600" : "hover:bg-gray-800"}`}>👥 Users</button>
                <button onClick={() => navigate('/')} className="mt-auto text-gray-400 hover:text-white">← Exit Dashboard</button>
            </div>

            {/* CONTENT */}
            <div className="flex-1 p-10 overflow-y-auto">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 uppercase tracking-tight">{activeTab}</h2>
                    {activeTab === "menu" && (
                        <button onClick={() => setShowModal(true)} className="bg-gray-900 text-white px-6 py-2 rounded-full font-bold hover:bg-orange-600 transition-colors">
                            + Add New Food
                        </button>
                    )}
                </div>

                {/* DATA TABLES */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                    {/* MENU TAB */}
                    {activeTab === "menu" && (
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b">
                                <tr><th className="p-4">Name</th><th className="p-4">Category</th><th className="p-4">Price</th><th className="p-4">Protein</th></tr>
                            </thead>
                            <tbody>
                                {menuItems.map(item => (
                                    <tr key={item.id} className="border-b">
                                        <td className="p-4 font-bold">{item.name}</td>
                                        <td className="p-4 text-sm text-gray-500">{item.category}</td>
                                        <td className="p-4">₹{item.price}</td>
                                        <td className="p-4">{item.protein}g</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {/* USERS TAB */}
                    {activeTab === "users" && (
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b">
                                <tr><th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">Role</th><th className="p-4">Joined</th></tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.id} className="border-b">
                                        <td className="p-4 font-bold">{u.name}</td>
                                        <td className="p-4">{u.email}</td>
                                        <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold ${u.role === 'admin' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>{u.role}</span></td>
                                        <td className="p-4 text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {/* ORDERS TAB (NOW AWESOME!) */}
                    {activeTab === "orders" && (
                        <div className="p-8">
                            <div className="space-y-4">
                                {orders.length === 0 ? (
                                    <div className="text-center py-20 text-gray-400 border-2 border-dashed rounded-xl">No orders placed yet.</div>
                                ) : (
                                    orders.map(order => (
                                        <div key={order.id} className="border border-gray-200 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-shadow bg-white">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="font-black text-lg text-gray-900">Order #{order.id}</span>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        order.status === 'Approved' ? 'bg-blue-100 text-blue-800' :
                                                            order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                                'bg-red-100 text-red-800'
                                                        }`}>
                                                        {order.status || 'Pending'}
                                                    </span>
                                                </div>
                                                <p className="text-gray-600 text-sm mb-1"><span className="font-bold">Total:</span> ₹{order.totalAmount}</p>
                                                <p className="text-gray-600 text-sm"><span className="font-bold border-b border-gray-300">Deliver To:</span> {order.address || "No address provided"}</p>
                                                <p className="text-xs text-gray-400 mt-2">Ordered on: {new Date(order.createdAt).toLocaleString()}</p>
                                            </div>

                                            {/* Action Buttons */}
                                            {(order.status === 'Pending' || !order.status) && (
                                                <div className="flex gap-2 w-full md:w-auto">
                                                    <button
                                                        onClick={() => handleUpdateOrderStatus(order.id, 'Approved')}
                                                        className="flex-1 md:flex-none bg-black hover:bg-green-600 text-white px-6 py-2 rounded-lg font-bold transition-colors">
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateOrderStatus(order.id, 'Denied')}
                                                        className="flex-1 md:flex-none bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-6 py-2 rounded-lg font-bold transition-colors border border-red-200">
                                                        Deny
                                                    </button>
                                                </div>
                                            )}

                                            {order.status === 'Approved' && (
                                                <button
                                                    onClick={() => handleUpdateOrderStatus(order.id, 'Delivered')}
                                                    className="w-full md:w-auto bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-bold transition-colors shadow-sm">
                                                    Mark as Delivered
                                                </button>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ADD FOOD MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
                        <h3 className="text-2xl font-bold mb-6">Add New Dish</h3>
                        <form onSubmit={handleAddFood} className="space-y-4">
                            <input type="text" placeholder="Dish Name" className="w-full border p-3 rounded-lg" required onChange={(e) => setNewFood({ ...newFood, name: e.target.value })} />
                            <div className="grid grid-cols-2 gap-4">
                                <input type="number" placeholder="Price (₹)" className="border p-3 rounded-lg" required onChange={(e) => setNewFood({ ...newFood, price: e.target.value })} />
                                <select className="border p-3 rounded-lg" onChange={(e) => setNewFood({ ...newFood, category: e.target.value })}>
                                    <option>Protein</option><option>Vegetarian</option><option>Main Course</option><option>Snacks</option><option>Breakfast</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input type="number" placeholder="Calories" className="border p-3 rounded-lg" required onChange={(e) => setNewFood({ ...newFood, calories: e.target.value })} />
                                <input type="number" placeholder="Protein (g)" className="border p-3 rounded-lg" required onChange={(e) => setNewFood({ ...newFood, protein: e.target.value })} />
                            </div>
                            <div className="flex gap-4">
                                <button type="submit" className="flex-1 bg-orange-600 text-white py-3 rounded-lg font-bold">Save Item</button>
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 py-3 rounded-lg font-bold">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;