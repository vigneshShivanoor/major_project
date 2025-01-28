import React from "react";
import { Settings, Bell, Shield, Clock } from "lucide-react";

export default function LeaveSettings() {
  return (
    <div className="max-w-4xl mx-auto pt-16">
      <h2 className="text-2xl font-bold text-white mb-6">Leave Settings</h2>

      <div className="space-y-6">
        {/* Notification Settings */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Preferences
          </h3>

          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <span className="text-gray-300">Email notifications</span>
              <input
                type="checkbox"
                defaultChecked
                className="rounded border-gray-600 text-blue-500 focus:ring-blue-500 bg-gray-700"
              />
            </label>

            <label className="flex items-center justify-between">
              <span className="text-gray-300">
                Leave approval notifications
              </span>
              <input
                type="checkbox"
                defaultChecked
                className="rounded border-gray-600 text-blue-500 focus:ring-blue-500 bg-gray-700"
              />
            </label>

            <label className="flex items-center justify-between">
              <span className="text-gray-300">Leave balance reminders</span>
              <input
                type="checkbox"
                defaultChecked
                className="rounded border-gray-600 text-blue-500 focus:ring-blue-500 bg-gray-700"
              />
            </label>
          </div>
        </div>

        {/* Approval Settings */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Approval Chain
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Primary Approver
              </label>
              <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500">
                <option>Head of Department</option>
                <option>Dean</option>
                <option>Principal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Secondary Approver
              </label>
              <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500">
                <option>Principal</option>
                <option>Dean</option>
                <option>Head of Department</option>
              </select>
            </div>
          </div>
        </div>

        {/* Auto-Approval Rules */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Auto-Approval Rules
          </h3>

          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <span className="text-gray-300">
                Auto-approve casual leave ≤ 2 days
              </span>
              <input
                type="checkbox"
                className="rounded border-gray-600 text-blue-500 focus:ring-blue-500 bg-gray-700"
              />
            </label>

            <label className="flex items-center justify-between">
              <span className="text-gray-300">
                Auto-approve compensatory leave
              </span>
              <input
                type="checkbox"
                className="rounded border-gray-600 text-blue-500 focus:ring-blue-500 bg-gray-700"
              />
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
