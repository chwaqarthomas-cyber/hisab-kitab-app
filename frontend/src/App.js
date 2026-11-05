import React, { useState } from 'react';

function App() {
  const [distributors, setDistributors] = useState([]);
  const [name, setName] = useState('');
  const [accountNo, setAccountNo] = useState('');
  const [limit, setLimit] = useState('');
  const [commission, setCommission] = useState('');

  const [usageAccount, setUsageAccount] = useState('');
  const [usageAmount, setUsageAmount] = useState('');

  // Naya Distributor Add Karne Ka Function
  const addDistributor = (e) => {
    e.preventDefault();
    if(distributors.find(d => d.accountNo === accountNo)) {
      alert("Yeh Account Number pehle se mojood hai! Double entry allow nahi hai.");
      return;
    }
    setDistributors([...distributors, {
      id: Date.now(),
      name: name,
      accountNo: accountNo,
      totalLimit: Number(limit),
      usedLimit: 0,
      commission: Number(commission),
      status: 'Active' // Status block ya active rakhne ke liye
    }]);
    setName(''); setAccountNo(''); setLimit(''); setCommission('');
  };

  // Daily Entry (Limit Use) Karne Ka Function
  const addDailyUsage = (e) => {
    e.preventDefault();
    setDistributors(distributors.map(dist => {
      if (dist.accountNo === usageAccount) {
        if (dist.status === 'Blocked') {
          alert("Yeh account suspend/block ho chuka hai. Entry nahi ho sakti!");
          return dist;
        }
        if (dist.usedLimit + Number(usageAmount) > dist.totalLimit) {
          alert("Limit full ho chuki hai! Aap total limit se zyada use nahi kar sakte.");
          return dist;
        }
        return { ...dist, usedLimit: dist.usedLimit + Number(usageAmount) };
      }
      return dist;
    }));
    setUsageAccount(''); setUsageAmount('');
  };

  // PDF Save / Print Report Function
  const printReport = () => {
    window.print();
  };

  // Dashboard Calculations
  const totalAccounts = distributors.length;
  const activeAccounts = distributors.filter(d => d.status === 'Active').length;
  const fullLimitAccounts = distributors.filter(d => d.usedLimit === d.totalLimit).length;

  return (
    <div className="container mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center bg-dark text-white p-3 rounded mb-4">
        <h2 className="m-0">📊 Professional Hisab Kitab System</h2>
        <button onClick={printReport} className="btn btn-primary">Download PDF Report</button>
      </div>

      {/* DASHBOARD */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card bg-info text-white text-center p-3">
            <h5>Total Accounts</h5>
            <h3>{totalAccounts}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-success text-white text-center p-3">
            <h5>Active Accounts</h5>
            <h3>{activeAccounts}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-danger text-white text-center p-3">
            <h5>Limit Full / Blocked</h5>
            <h3>{fullLimitAccounts}</h3>
          </div>
        </div>
      </div>

      <div className="row">
        {/* NAYA DISTRIBUTOR ADD FORM */}
        <div className="col-md-6 mb-4">
          <div className="card p-3 shadow-sm">
            <h4 className="text-primary border-bottom pb-2">➕ Naya Distributor Add Karein</h4>
            <form onSubmit={addDistributor}>
              <input type="text" className="form-control mb-2" placeholder="Distributor Ka Naam" value={name} onChange={(e) => setName(e.target.value)} required />
              <input type="text" className="form-control mb-2" placeholder="Account Number" value={accountNo} onChange={(e) => setAccountNo(e.target.value)} required />
              <input type="number" className="form-control mb-2" placeholder="Total Limit (Maslan: 300000)" value={limit} onChange={(e) => setLimit(e.target.value)} required />
              <input type="number" className="form-control mb-3" placeholder="Commission % (Maslan: 5)" value={commission} onChange={(e) => setCommission(e.target.value)} required />
              <button type="submit" className="btn btn-primary w-100">Save Distributor</button>
            </form>
          </div>
        </div>

        {/* DAILY ENTRY (LIMIT USAGE) FORM */}
        <div className="col-md-6 mb-4">
          <div className="card p-3 shadow-sm border-warning">
            <h4 className="text-warning border-bottom pb-2">📝 Daily Limit Entry Karein</h4>
            <form onSubmit={addDailyUsage}>
              <select className="form-control mb-2" value={usageAccount} onChange={(e) => setUsageAccount(e.target.value)} required>
                <option value="">Select Account Number...</option>
                {distributors.map(d => (
                  <option key={d.id} value={d.accountNo}>{d.name} - {d.accountNo}</option>
                ))}
              </select>
              <input type="number" className="form-control mb-3" placeholder="Aj kitni limit use hui?" value={usageAmount} onChange={(e) => setUsageAmount(e.target.value)} required />
              <button type="submit" className="btn btn-warning w-100 text-dark fw-bold">Add Entry (Audit)</button>
            </form>
          </div>
        </div>
      </div>

      {/* AUDIT & RECORDS TABLE */}
      <div className="card p-3 shadow-sm">
        <h4 className="text-secondary border-bottom pb-2">📂 Sab Accounts Ki Report</h4>
        <div className="table-responsive">
          <table className="table table-bordered table-striped mt-3">
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Account No</th>
                <th>Comm %</th>
                <th>Total Limit</th>
                <th>Used Limit</th>
                <th>Pending Limit</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {distributors.length === 0 ? <tr><td colSpan="7" className="text-center">Koi record nahi hai...</td></tr> : null}
              {distributors.map(d => (
                <tr key={d.id} className={d.usedLimit === d.totalLimit ? "table-danger" : ""}>
                  <td>{d.name}</td>
                  <td>{d.accountNo}</td>
                  <td>{d.commission}%</td>
                  <td>Rs {d.totalLimit.toLocaleString()}</td>
                  <td className="text-danger fw-bold">Rs {d.usedLimit.toLocaleString()}</td>
                  <td className="text-success fw-bold">Rs {(d.totalLimit - d.usedLimit).toLocaleString()}</td>
                  <td>
                    {d.usedLimit === d.totalLimit ? 
                      <span className="badge bg-danger">Limit Full</span> : 
                      <span className="badge bg-success">Active</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default App;