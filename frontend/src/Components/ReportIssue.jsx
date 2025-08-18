import React, { useState } from "react";
import { Bug, AlertTriangle, Zap, Shield, Smartphone, Globe, Upload, Send, X } from 'lucide-react';
import Navbar from "./Navbar";
import Footer from "./Footer";

const ISSUE_TYPES = [
    {
        id: 'bug',
        title: 'Bug Report',
        description: 'Something is not working as expected',
        icon: <Bug className="w-8 h-8" />,
        color: 'from-red-500 to-pink-500',
        examples: ['App crashes', 'Features not working', 'Display issues']
    },
    {
        id: 'performance',
        title: 'Performance Issue',
        description: 'Slow loading or poor performance',
        icon: <Zap className="w-8 h-8" />,
        color: 'from-yellow-500 to-orange-500',
        examples: ['Slow page loading', 'App freezes', 'Long response times']
    },
    {
        id: 'security',
        title: 'Security Concern',
        description: 'Potential security vulnerability',
        icon: <Shield className="w-8 h-8" />,
        color: 'from-purple-500 to-indigo-500',
        examples: ['Suspicious activity', 'Data concerns', 'Login issues']
    },
    {
        id: 'mobile',
        title: 'Mobile Issues',
        description: 'Problems on mobile devices',
        icon: <Smartphone className="w-8 h-8" />,
        color: 'from-green-500 to-teal-500',
        examples: ['Touch issues', 'Mobile layout problems', 'App not responsive']
    },
    {
        id: 'browser',
        title: 'Browser Compatibility',
        description: 'Issues with specific browsers',
        icon: <Globe className="w-8 h-8" />,
        color: 'from-blue-500 to-cyan-500',
        examples: ['Chrome issues', 'Safari problems', 'Firefox compatibility']
    },
    {
        id: 'other',
        title: 'Other Issue',
        description: 'Something else not listed above',
        icon: <AlertTriangle className="w-8 h-8" />,
        color: 'from-gray-500 to-slate-500',
        examples: ['Content errors', 'Feature requests', 'General feedback']
    }
];

const PRIORITY_LEVELS = [
    { value: 'low', label: 'Low - Minor issue, can wait' },
    { value: 'medium', label: 'Medium - Affects my experience' },
    { value: 'high', label: 'High - Blocks important functionality' },
    { value: 'critical', label: 'Critical - App is unusable' }
];

const BROWSERS = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera', 'Other'];
const DEVICES = ['Desktop', 'Mobile Phone', 'Tablet', 'Other'];
const OPERATING_SYSTEMS = ['Windows', 'macOS', 'iOS', 'Android', 'Linux', 'Other'];

export default function ReportIssue() {
    const [selectedIssueType, setSelectedIssueType] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        stepsToReproduce: '',
        expectedBehavior: '',
        actualBehavior: '',
        priority: 'medium',
        browser: '',
        device: '',
        operatingSystem: '',
        email: ''
    });
    const [attachments, setAttachments] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        setAttachments(prev => [...prev, ...files]);
    };

    const removeAttachment = (index) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        if (!selectedIssueType || !formData.title || !formData.description) {
            return;
        }

        setIsSubmitting(true);

        // Simulate form submission
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
        }, 2000);
    };

    const resetForm = () => {
        setSelectedIssueType('');
        setFormData({
            title: '',
            description: '',
            stepsToReproduce: '',
            expectedBehavior: '',
            actualBehavior: '',
            priority: 'medium',
            browser: '',
            device: '',
            operatingSystem: '',
            email: ''
        });
        setAttachments([]);
        setIsSubmitted(false);
    };

    if (isSubmitted) {
        return (

            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-black dark:via-black dark:to-[#120024] pt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-transparent dark:text-white overflow-hidden p-12 text-center">
                        <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6">
                            ✅
                        </div>
                        <h2 className="text-3xl font-bold dark:text-white text-gray-900 mb-4">Issue Reported Successfully!</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                            Thank you for helping us improve our platform.
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 mb-8">
                            We'll investigate this issue and get back to you within 24 hours.
                        </p>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={resetForm}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
                            >
                                Report Another Issue
                            </button>
                            <button Link to={'/'} className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 font-semibold px-8 py-3 rounded-lg transition-colors">
                                Back to Help Center
                            </button>
                        </div>
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
                            <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mr-4">
                                🐛
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold dark:text-white text-gray-900">
                                Report an Issue
                            </h1>
                        </div>
                        <p className="text-lg dark:text-gray-100 text-gray-600 max-w-3xl mx-auto">
                            Help us improve by reporting bugs, performance issues, or other problems
                        </p>
                    </div>

                    <div className="max-w-7xl mx-auto">
                        {/* Issue Type Selection */}
                        {!selectedIssueType && (
                            <div className="bg-transparent dark:text-white overflow-hidden p-8 mb-8">
                                <h2 className="text-4xl text-purple-900 text-center font-bold dark:text-white text-gray-900 mb-6">What type of issue are you experiencing?</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {ISSUE_TYPES.map((type) => (
                                        <button
                                            key={type.id}
                                            onClick={() => setSelectedIssueType(type.id)}
                                            className="text-left p-6 rounded-xl border border-gray-200 dark:border-white/20 hover:border-purple-300 dark:hover:border-purple-500 hover:shadow-md transition-all bg-white dark:bg-white/5 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                                        >
                                            <div className={`w-16 h-16 bg-gradient-to-r ${type.color} rounded-2xl flex items-center justify-center text-white mb-4`}>
                                                {type.icon}
                                            </div>
                                            <h3 className="text-lg font-bold dark:text-white text-gray-900 mb-2">{type.title}</h3>
                                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{type.description}</p>
                                            <div className="space-y-1">
                                                {type.examples.map((example, index) => (
                                                    <div key={index} className="text-xs text-gray-500 dark:text-gray-500">• {example}</div>
                                                ))}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Issue Report Form */}
                        {selectedIssueType && (
                            <div className="space-y-8">
                                {/* Selected Issue Type Header */}
                                <div className="bg-white dark:bg-white/5 dark:backdrop-blur-md rounded-xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className={`w-12 h-12 bg-gradient-to-r ${ISSUE_TYPES.find(t => t.id === selectedIssueType)?.color} rounded-xl flex items-center justify-center text-white`}>
                                                {ISSUE_TYPES.find(t => t.id === selectedIssueType)?.icon}
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-bold dark:text-white text-gray-900">
                                                    {ISSUE_TYPES.find(t => t.id === selectedIssueType)?.title}
                                                </h2>
                                                <p className="text-gray-600 dark:text-gray-400">
                                                    {ISSUE_TYPES.find(t => t.id === selectedIssueType)?.description}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setSelectedIssueType('')}
                                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                        >
                                            Change Type
                                        </button>
                                    </div>
                                </div>

                                {/* Form Fields */}
                                <div className="bg-white dark:bg-white/5 dark:backdrop-blur-md rounded-xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden p-8">
                                    <h3 className="text-xl font-bold dark:text-white text-gray-900 mb-6">Issue Details</h3>

                                    <div className="space-y-6">
                                        {/* Title */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Issue Title *
                                            </label>
                                            <input
                                                type="text"
                                                name="title"
                                                value={formData.title}
                                                onChange={handleInputChange}
                                                placeholder="Brief, descriptive title for the issue"
                                                className="w-full px-4 py-3 border border-gray-200 dark:border-white/20 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-black placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>

                                        {/* Priority */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Priority Level
                                            </label>
                                            <select
                                                name="priority"
                                                value={formData.priority}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-200 dark:border-white/20 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                {PRIORITY_LEVELS.map(level => (
                                                    <option key={level.value} value={level.value}>{level.label}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Detailed Description *
                                            </label>
                                            <textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleInputChange}
                                                rows={4}
                                                placeholder="Please provide a detailed description of the issue..."
                                                className="w-full px-4 py-3 border border-gray-200 dark:border-white/20 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-black placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                                            />
                                        </div>

                                        {/* Steps to Reproduce */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Steps to Reproduce
                                            </label>
                                            <textarea
                                                name="stepsToReproduce"
                                                value={formData.stepsToReproduce}
                                                onChange={handleInputChange}
                                                rows={3}
                                                placeholder="1. Go to...&#10;2. Click on...&#10;3. Notice that..."
                                                className="w-full px-4 py-3 border border-gray-200 dark:border-white/20 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-black placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Expected Behavior */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Expected Behavior
                                                </label>
                                                <textarea
                                                    name="expectedBehavior"
                                                    value={formData.expectedBehavior}
                                                    onChange={handleInputChange}
                                                    rows={3}
                                                    placeholder="What should happen?"
                                                    className="w-full px-4 py-3 border border-gray-200 dark:border-white/20 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-black placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                                                />
                                            </div>

                                            {/* Actual Behavior */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Actual Behavior
                                                </label>
                                                <textarea
                                                    name="actualBehavior"
                                                    value={formData.actualBehavior}
                                                    onChange={handleInputChange}
                                                    rows={3}
                                                    placeholder="What actually happens?"
                                                    className="w-full px-4 py-3 border border-gray-200 dark:border-white/20 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-black placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Technical Information */}
                                <div className="bg-white dark:bg-white/5 dark:backdrop-blur-md rounded-xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden p-8">
                                    <h3 className="text-xl font-bold dark:text-white text-gray-900 mb-6">Technical Information</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Browser
                                            </label>
                                            <select
                                                name="browser"
                                                value={formData.browser}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-200 dark:border-white/20 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="">Select browser</option>
                                                {BROWSERS.map(browser => (
                                                    <option key={browser} value={browser}>{browser}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Device Type
                                            </label>
                                            <select
                                                name="device"
                                                value={formData.device}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-200 dark:border-white/20 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="">Select device</option>
                                                {DEVICES.map(device => (
                                                    <option key={device} value={device}>{device}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Operating System
                                            </label>
                                            <select
                                                name="operatingSystem"
                                                value={formData.operatingSystem}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-200 dark:border-white/20 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="">Select OS</option>
                                                {OPERATING_SYSTEMS.map(os => (
                                                    <option key={os} value={os}>{os}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* File Upload */}
                                <div className="bg-white dark:bg-white/5 dark:backdrop-blur-md rounded-xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden p-8">
                                    <h3 className="text-xl font-bold dark:text-white text-gray-900 mb-6">Attachments (Optional)</h3>

                                    <div className="border-2 border-dashed border-gray-200 dark:border-white/20 rounded-lg p-8 text-center">
                                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600 dark:text-gray-400 mb-2">Upload screenshots, videos, or logs</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">PNG, JPG, GIF, MP4, or TXT files up to 10MB</p>
                                        <input
                                            type="file"
                                            multiple
                                            accept=".png,.jpg,.jpeg,.gif,.mp4,.txt,.log"
                                            onChange={handleFileUpload}
                                            className="hidden"
                                            id="file-upload"
                                        />
                                        <label
                                            htmlFor="file-upload"
                                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors cursor-pointer inline-block"
                                        >
                                            Choose Files
                                        </label>
                                    </div>

                                    {attachments.length > 0 && (
                                        <div className="mt-4 space-y-2">
                                            {attachments.map((file, index) => (
                                                <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                                                    <span className="text-sm text-gray-700 dark:text-gray-300">{file.name}</span>
                                                    <button
                                                        onClick={() => removeAttachment(index)}
                                                        className="text-red-500 hover:text-red-700 transition-colors"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Contact Email */}
                                <div className="bg-white dark:bg-white/5 dark:backdrop-blur-md rounded-xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden p-8">
                                    <h3 className="text-xl font-bold dark:text-white text-gray-900 mb-6">Contact Information</h3>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Email Address (Optional)
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="your.email@example.com"
                                            className="w-full px-4 py-3 border border-gray-200 dark:border-white/20 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-black placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                                            We'll use this to contact you about your issue. Leave blank if you prefer no follow-up.
                                        </p>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="text-center">
                                    <button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting || !formData.title || !formData.description}
                                        className="bg-red-600 hover:bg-red-700 text-white font-semibold px-12 py-4 rounded-lg text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3 mx-auto"
                                    >
                                        <Send className="w-6 h-6" />
                                        <span>{isSubmitting ? 'Submitting Issue...' : 'Submit Issue Report'}</span>
                                    </button>
                                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
                                        * Required fields must be filled out
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}