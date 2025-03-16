import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";

const AdminNotifications = () => {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [filter, setFilter] = useState("week");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users/contact");
        setMessages(response.data);
        filterMessages(response.data, "week"); // Default filter: Last Week
      } catch (error) {
        console.error("Error fetching messages", error);
      }
    };
    fetchMessages();
  }, []);

  const filterMessages = (data, criteria) => {
    const now = moment();
    let filtered = data;
    
    if (criteria === "today") {
      filtered = data.filter(msg => moment(msg.createdAt).isSame(now, "day"));
    } else if (criteria === "week") {
      filtered = data.filter(msg => moment(msg.createdAt).isAfter(now.subtract(7, "days")));
    } else if (criteria === "month") {
      filtered = data.filter(msg => moment(msg.createdAt).isAfter(now.subtract(30, "days")));
    }
    
    setFilteredMessages(filtered);
    setFilter(criteria);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <FaBell className="text-blue-500" /> Notifications
          </h1>
          <select
            className="p-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
            value={filter}
            onChange={(e) => filterMessages(messages, e.target.value)}
          >
            <option value="all">All</option>
            <option value="today">Today</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
          </select>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredMessages.length > 0 ? (
            filteredMessages.map((msg) => (
              <div
                key={msg._id}
                className="p-5 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition duration-200 border-l-4 border-blue-500"
              >
                <div className="flex items-start space-x-4">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {msg.firstname[0]}
                    </div>
                  </div>

                  {/* Notification Content */}
                  <div className="flex-1">
                    <p className="text-lg font-semibold text-gray-900">
                      {msg.firstname} {msg.lastname}
                    </p>
                    <p className="text-sm text-gray-600">
                      {msg.phonenumber} | {msg.email}
                    </p>
                    <p className="text-gray-700 mt-2">{msg.message}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {moment(msg.createdAt).format("MMMM Do YYYY, h:mm A")}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No notifications found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;
