import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, User, FileText } from 'lucide-react';
import Navbar from "./Navbar";
import Footer from "./Footer";

const CONTACT_METHODS = [
    {
        id: 'email',
        title: 'Email Support',
        description: 'Get help via email within 24 hours',
        icon: <Mail className="w-8 h-8" />,
        color: 'from-blue-500 to-cyan-500',
        contact: 'support@example.com',
        availability: '24/7'
    },
    {
        id: 'phone',
        title: 'Phone Support',
        description: 'Speak directly with our support team',
        icon: <Phone className="w-8 h-8" />,
        color: 'from-purple-500 to-emerald-500',
        contact: '+1 (555) 123-4567',
        availability: 'Mon-Fri 9AM-6PM EST'
    },
    {
        id: 'chat',
        title: 'Live Chat',
        description: 'Chat with us in real-time',
        icon: <MessageCircle className="w-8 h-8" />,
        color: 'from-purple-500 to-pink-500',
        contact: 'Available on website',
        availability: 'Mon-Fri 9AM-6PM EST'
    }
];

const INQUIRY_TYPES = [
    'General Support',
    'Technical Issue',
    'Account Problem',
    'Feature Request',
    'Bug Report',
    'Billing Question',
    'Partnership Inquiry',
    'Other'
];

export default function ContactUs() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        inquiryType: 'General Support',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
        }, 2000);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            subject: '',
            inquiryType: 'General Support',
            message: ''
        });
        setIsSubmitted(false);
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-black dark:via-black dark:to-[#1a2e1a] pt-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-white dark:bg-white/5 dark:backdrop-blur-md rounded-xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden p-12 text-center">
                        <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-emerald-400 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6">
                            ✅
                        </div>
                        <h2 className="text-3xl font-bold dark:text-white text-gray-900 mb-4">Message Sent Successfully!</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                            Thank you for contacting us. We'll get back to you within 24 hours.
                        </p>
                        <button
                            onClick={resetForm}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
                        >
                            Send Another Message
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-black dark:via-black dark:to-[#120024] pt-20">
                {/* Header */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center mb-12">
                        <div className="flex items-center justify-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mr-4">
                                📞
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold dark:text-white text-gray-900">
                                Contact Us
                            </h1>
                        </div>
                        <p className="text-lg dark:text-gray-100 text-gray-600 max-w-3xl mx-auto">
                            Get in touch with our support team. We're here to help!
                        </p>
                    </div>

                    {/* Contact Methods */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12 md:mx-20">
                        {CONTACT_METHODS.map((method) => (
                            <div key={method.id} className="bg-white dark:bg-white/5 dark:backdrop-blur-md rounded-xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden p-6 text-center">
                                <div className={`w-16 h-16 bg-gradient-to-r ${method.color} rounded-2xl flex items-center justify-center text-white mx-auto mb-4`}>
                                    {method.icon}
                                </div>
                                <h3 className="text-lg font-bold dark:text-white text-gray-900 mb-2">{method.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{method.description}</p>
                                <p className="font-semibold dark:text-white text-gray-900 mb-1">{method.contact}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-500">{method.availability}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Contact Form */}
                        <div className="bg-white dark:bg-white/5 dark:backdrop-blur-md rounded-xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden p-8">
                            <h2 className="text-2xl font-bold dark:text-white text-gray-900 mb-6">Send us a Message</h2>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            <User className="w-4 h-4 inline mr-2" />
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-200 dark:border-white/20 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-black placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter your full name"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            <Mail className="w-4 h-4 inline mr-2" />
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-200 dark:border-white/20 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-black placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter your email address"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        <FileText className="w-4 h-4 inline mr-2" />
                                        Subject *
                                    </label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-200 dark:border-white/20 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-black placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Brief description of your inquiry"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Inquiry Type
                                    </label>
                                    <select
                                        name="inquiryType"
                                        value={formData.inquiryType}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-200 dark:border-white/20 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        {INQUIRY_TYPES.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Message *
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        required
                                        rows={6}
                                        className="w-full px-4 py-3 border border-gray-200 dark:border-white/20 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-black placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                                        placeholder="Please provide details about your inquiry..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                >
                                    <Send className="w-5 h-5" />
                                    <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                                </button>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-6">
                            {/* Office Location */}
                            <div className="bg-white dark:bg-white/5 dark:backdrop-blur-md rounded-xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden p-8">
                                <h3 className="text-xl font-bold dark:text-white text-gray-900 mb-6">Our Office</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start space-x-4">
                                        <MapPin className="w-6 h-6 text-blue-600 mt-1" />
                                        <div>
                                            <h4 className="font-semibold dark:text-white text-gray-900">Address</h4>
                                            <p className="text-gray-600 dark:text-gray-400">123 Main Street, Suite 400<br />New York, NY 10001</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-4">
                                        <Phone className="w-6 h-6 text-purple-600 mt-1" />
                                        <div>
                                            <h4 className="font-semibold dark:text-white text-gray-900">Phone</h4>
                                            <p className="text-gray-600 dark:text-gray-400">+1 (555) 123-4567</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-4">
                                        <Mail className="w-6 h-6 text-purple-600 mt-1" />
                                        <div>
                                            <h4 className="font-semibold dark:text-white text-gray-900">Email</h4>
                                            <p className="text-gray-600 dark:text-gray-400">support@example.com</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-4">
                                        <Clock className="w-6 h-6 text-orange-600 mt-1" />
                                        <div>
                                            <h4 className="font-semibold dark:text-white text-gray-900">Business Hours</h4>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                Monday - Friday: 9:00 AM - 6:00 PM EST<br />
                                                Saturday - Sunday: Closed
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Response Times */}
                            <div className="bg-white dark:bg-white/5 dark:backdrop-blur-md rounded-xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden p-8">
                                <h3 className="text-xl font-bold dark:text-white text-gray-900 mb-6">Response Times</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 dark:text-gray-400">General Inquiries</span>
                                        <span className="font-semibold text-purple-600">Within 24 hours</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 dark:text-gray-400">Technical Support</span>
                                        <span className="font-semibold text-blue-600">Within 12 hours</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 dark:text-gray-400">Urgent Issues</span>
                                        <span className="font-semibold text-red-600">Within 4 hours</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 dark:text-gray-400">Live Chat</span>
                                        <span className="font-semibold text-purple-600">Instant</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}