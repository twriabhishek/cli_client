import React, { useState, useEffect } from 'react';

const AuditContactStats = () => {
  const [auditData, setAuditData] = useState([]);

  useEffect(() => {
    const fetchAuditData = async () => {
      try {
        const response = await fetch('http://localhost:8085/contactInfo/auditContacts');
        const data = await response.json();
        console.log(data);
        setAuditData(data);
        console.log(auditData);
      } catch (error) {
        console.error('Error fetching audit data:', error);
      }
    };

    fetchAuditData();
  }, []);

  // Process the audit data to calculate date-wise number of valid and invalid contacts
  const calculateStats = () => {
    const dateWiseStats = {};

    auditData.forEach((entry) => {
      const date = entry.date; // Assuming there is a 'date' field in your audit data
      const status = entry.status; // Assuming there is a 'status' field indicating valid/invalid

      // Initialize date entry if not present
      if (!dateWiseStats[date.slice(0,10)]) {
        dateWiseStats[date.slice(0,10)] = {
          valid: 0,
          invalid: 0,
        };
      }

      // Update the count based on the status
      if (status === 'Valid') {
        dateWiseStats[date.slice(0,10)].valid += 1;
      } else if (status === 'Invalid') {
        dateWiseStats[date.slice(0,10)].invalid += 1;
      }
    });

    return dateWiseStats;
  };

  const dateWiseStats = calculateStats();

  // Render the date-wise stats
  return (
    <>
    <div>
      <h2>Date-wise Contact Statistics</h2>
      <ul>
        {Object.keys(dateWiseStats).map((date) => (
          <li key={date}>
            Date: {date}, Valid Contacts: {dateWiseStats[date.slice(0,10)].valid}, Invalid Contacts: {dateWiseStats[date.slice(0,10)].invalid}
          </li>
        ))}
      </ul>
    </div>
    </>
  );
};

export default AuditContactStats;