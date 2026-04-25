import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const Payment = ({ userId }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const total = location.state?.total || 0;

  const [selected, setSelected] = useState("");
  const [upiId, setUpiId] = useState("");
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  const methods = [
    { id: "upi", label: "UPI", icon: "📱", desc: "Pay via UPI ID" },
    { id: "card", label: "Credit / Debit Card", icon: "💳", desc: "Visa, Mastercard, Rupay" },
    { id: "cod", label: "Cash on Delivery", icon: "💵", desc: "Pay when your order arrives" },
  ];

  const handlePay = async () => {
    if (!selected) return setError("Please select a payment method.");
    if (selected === "upi" && !upiId.trim()) return setError("Please enter your UPI ID.");
    if (selected === "card") {
      if (!card.number || !card.name || !card.expiry || !card.cvv)
        return setError("Please fill all card details.");
    }

    setPaying(true);
    setError("");
    try {
      await axios.post(`http://localhost:5000/api/orders/${userId}`);
      navigate("/orders", { state: { justOrdered: true } });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order. Try again.");
      setPaying(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white min-h-screen">
      <div className="max-w-lg mx-auto px-4 py-12">

        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/checkout")}
            className="text-gray-500 hover:text-orange-600 font-medium mb-4 flex items-center gap-1 transition-colors"
          >
            ← Back to Cart
          </button>
          <h2 className="text-3xl font-black text-gray-900">💳 Payment</h2>
          <p className="text-gray-500 mt-1">Choose how you'd like to pay</p>
        </div>

        {/* Order Total Banner */}
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-6 flex justify-between items-center">
          <span className="text-gray-700 font-medium">Amount to Pay</span>
          <span className="text-2xl font-black text-orange-600">₹{parseFloat(total).toFixed(2)}</span>
        </div>

        {/* Payment Methods */}
        <div className="space-y-3 mb-6">
          {methods.map((m) => (
            <button
              key={m.id}
              onClick={() => { setSelected(m.id); setError(""); }}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${selected === m.id
                ? "border-orange-500 bg-orange-50"
                : "border-gray-200 bg-white hover:border-orange-300"
                }`}
            >
              <span className="text-3xl">{m.icon}</span>
              <div className="flex-grow">
                <p className="font-bold text-gray-900">{m.label}</p>
                <p className="text-sm text-gray-500">{m.desc}</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selected === m.id ? "border-orange-500" : "border-gray-300"
                }`}>
                {selected === m.id && <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />}
              </div>
            </button>
          ))}
        </div>

        {/* UPI Input */}
        {selected === "upi" && (
          <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">UPI ID</label>
            <input
              type="text"
              placeholder="yourname@upi"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            />
          </div>
        )}

        {/* Card Input */}
        {selected === "card" && (
          <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6 space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Card Number</label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                value={card.number}
                onChange={(e) => setCard({ ...card, number: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Cardholder Name</label>
              <input
                type="text"
                placeholder="Name on card"
                value={card.name}
                onChange={(e) => setCard({ ...card, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Expiry</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  maxLength={5}
                  value={card.expiry}
                  onChange={(e) => setCard({ ...card, expiry: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">CVV</label>
                <input
                  type="password"
                  placeholder="•••"
                  maxLength={3}
                  value={card.cvv}
                  onChange={(e) => setCard({ ...card, cvv: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* COD Note */}
        {selected === "cod" && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-6">
            <p className="text-yellow-800 font-medium text-sm">
              💡 Keep exact change ready. Our delivery partner will collect payment at your door.
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        {/* Pay Button */}
        <button
          onClick={handlePay}
          disabled={paying || !selected}
          className="w-full py-4 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-black text-lg rounded-2xl shadow-lg transition-all active:scale-95"
        >
          {paying ? (
            <span className="flex items-center justify-center gap-2">
              <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </span>
          ) : (
            `Pay ₹${parseFloat(total).toFixed(2)}`
          )}
        </button>

        <p className="text-center text-xs text-gray-400 mt-4">🔒 Secure & encrypted payment</p>
      </div>
    </div>
  );
};

export default Payment;
