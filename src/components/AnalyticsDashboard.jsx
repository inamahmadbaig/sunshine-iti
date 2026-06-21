import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Users, CreditCard, Banknote, IndianRupee } from 'lucide-react';

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const AnalyticsDashboard = ({ students }) => {

  const stats = useMemo(() => {
    let totalRevenue = 0;
    let totalCollected = 0;
    let totalPending = 0;
    const tradeCounts = {};
    const statusCounts = { COMPLETED: 0, PENDING: 0 };

    students.forEach(student => {
      totalRevenue += student.courseFee || 0;
      totalCollected += student.amountPaid || 0;
      totalPending += student.outstandingBalance || 0;

      // Trade distribution
      const trade = student.trade || 'Unknown';
      tradeCounts[trade] = (tradeCounts[trade] || 0) + 1;

      // Payment status
      const pStatus = student.paymentStatus === 'COMPLETED' ? 'COMPLETED' : 'PENDING';
      statusCounts[pStatus] += 1;
    });

    const tradeData = Object.keys(tradeCounts).map(key => ({
      name: key,
      Students: tradeCounts[key]
    }));

    const paymentData = [
      { name: 'Completed', value: statusCounts.COMPLETED },
      { name: 'Pending', value: statusCounts.PENDING }
    ];

    return {
      totalStudents: students.length,
      totalRevenue,
      totalCollected,
      totalPending,
      tradeData,
      paymentData
    };
  }, [students]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        
        <div style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(37, 99, 235, 0.2)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ backgroundColor: '#2563eb', padding: '1rem', borderRadius: '50%', color: 'white' }}>
            <Users size={24} />
          </div>
          <div>
            <p style={{ margin: 0, color: 'gray', fontSize: '0.9rem', fontWeight: 600 }}>Total Students</p>
            <h3 style={{ margin: 0, fontSize: '1.8rem', color: '#2563eb' }}>{stats.totalStudents}</h3>
          </div>
        </div>

      </div>

      {/* Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        
        {/* Bar Chart */}
        <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#334155' }}>Admissions by Trade</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.tradeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                <Legend />
                <Bar dataKey="Students" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#334155' }}>Payment Status</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.paymentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {stats.paymentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#f59e0b'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};

export default AnalyticsDashboard;
