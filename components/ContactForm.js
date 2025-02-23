// "use client";

import { useState } from "react";
import { motion } from "framer-motion";

const ContactForm = () => {
  const [formData, setFormData] = useState({ email: "", phone: "" });
  const [errors, setErrors] = useState({ email: "", phone: "" });
  const [submitted, setSubmitted] = useState(false);

  // 🔹 Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear previous errors
  };

  // 🔹 Validation before submission
  const validate = () => {
    let newErrors = {};
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = "Invalid email format.";
    }
    if (!formData.phone.match(/^\+?\d{7,15}$/)) {
      newErrors.phone = "Invalid phone number.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔹 Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setSubmitted(true);
      console.log("Form submitted:", formData);
      // API call can be added here
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-md mt-10 border border-white/20"
    >
      <h2 className="text-3xl font-bold text-white text-center mb-6">Stay Updated</h2>

      {submitted ? (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-green-400 text-center"
        >
           Thank you! We&apos;ll be in touch.
        </motion.p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="peer w-full p-3 bg-transparent border-b-2 border-white/30 text-white placeholder-transparent focus:outline-none focus:border-white transition-all duration-300"
              placeholder="Email Address"
            />
            <label className="absolute left-0 top-0 text-white/60 text-sm peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/40 peer-focus:top-0 peer-focus:text-sm peer-focus:text-white transition-all duration-300">
              Email Address
            </label>
            {errors.email && <p className="text-red-400 text-xs mt-2">{errors.email}</p>}
          </div>

          {/* Phone Input */}
          <div className="relative">
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="peer w-full p-3 bg-transparent border-b-2 border-white/30 text-white placeholder-transparent focus:outline-none focus:border-white transition-all duration-300"
              placeholder="Phone Number"
            />
            <label className="absolute left-0 top-0 text-white/60 text-sm peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/40 peer-focus:top-0 peer-focus:text-sm peer-focus:text-white transition-all duration-300">
              Phone Number
            </label>
            {errors.phone && <p className="text-red-400 text-xs mt-2">{errors.phone}</p>}
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
          >
            Subscribe
          </motion.button>
        </form>
      )}
    </motion.div>
  );
};

export default ContactForm;
// 