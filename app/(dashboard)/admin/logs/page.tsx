import { ShieldAlert, AlertTriangle, Info, CheckCircle2, Search, Filter, Download } from "lucide-react";

export default function AuditLogsPage() {
  const logs = [
    { id: "LOG-928", type: "Security", action: "Failed Login Attempt", user: "Unknown", ip: "192.168.1.104", time: "2 mins ago", severity: "high" },
    { id: "LOG-927", type: "Access", action: "Role Changed to Administrator", user: "elena.r@bank360.com", ip: "10.0.0.5", time: "1 hour ago", severity: "medium" },
    { id: "LOG-926", type: "System", action: "Database Backup Completed", user: "System", ip: "localhost", time: "3 hours ago", severity: "info" },
    { id: "LOG-925", type: "Access", action: "Customer Data Exported", user: "sarah.w@bank360.com", ip: "10.0.0.12", time: "5 hours ago", severity: "medium" },
    { id: "LOG-924", type: "Auth", action: "User Password Reset", user: "david.c@bank360.com", ip: "10.0.0.18", time: "1 day ago", severity: "low" },
    { id: "LOG-923", type: "Security", action: "Multiple API Failures", user: "Service Account", ip: "External", time: "1 day ago", severity: "high" },
  ];

  return (
    <div className="bg-[#EDF2F7] min-h-[calc(100vh-4rem)] p-8 -m-8 space-y-8 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#1A365D] mb-2">Audit Logs</h1>
            <p className="text-[#4A5568]">Review system events, access history, and security alerts.</p>
          </div>
          <button className="bg-[#2B6CB0] hover:bg-[#1A365D] text-[#FFFFFF] px-5 py-2.5 rounded-md text-sm font-bold transition-all border border-[#1A365D]/10 flex items-center gap-2 shadow-sm">
            <Download className="w-4 h-4" /> Export Logs (CSV)
          </button>
        </div>

        <div className="bg-[#FFFFFF] border border-[#CBD5E0] rounded-xl shadow-sm overflow-hidden">
          {/* Filters Bar */}
          <div className="p-4 border-b border-[#CBD5E0] flex flex-col sm:flex-row sm:items-center gap-4 bg-[#EDF2F7]/50">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#4A5568]" />
              <input 
                type="text" 
                placeholder="Search event ID, user, or IP..." 
                className="w-full bg-[#FFFFFF] border border-[#CBD5E0] rounded-md pl-10 pr-4 py-2 text-[#FFFFFF] placeholder:text-[#4A5568] focus:outline-none focus:border-[#2B6CB0] focus:ring-1 focus:ring-[#2B6CB0] transition-colors"
              />
            </div>
            <select className="bg-[#FFFFFF] border border-[#CBD5E0] text-[#0D1117] px-4 py-2 rounded-md focus:outline-none focus:border-[#2B6CB0] text-sm font-medium">
              <option>All Severities</option>
              <option>High Severity</option>
              <option>Medium Severity</option>
              <option>Low / Info</option>
            </select>
            <select className="bg-[#FFFFFF] border border-[#CBD5E0] text-[#0D1117] px-4 py-2 rounded-md focus:outline-none focus:border-[#2B6CB0] text-sm font-medium">
              <option>Last 24 Hours</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1A365D] border-b border-[#CBD5E0]">
                  <th className="p-4 text-sm font-bold text-[#FFFFFF]">Event Info</th>
                  <th className="p-4 text-sm font-bold text-[#FFFFFF]">User / Service</th>
                  <th className="p-4 text-sm font-bold text-[#FFFFFF]">IP Address</th>
                  <th className="p-4 text-sm font-bold text-[#FFFFFF]">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#CBD5E0]">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#EDF2F7]/80 transition-colors">
                    <td className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${
                          log.severity === 'high' ? 'bg-red-100 text-red-600' :
                          log.severity === 'medium' ? 'bg-orange-100 text-orange-600' :
                          log.severity === 'low' ? 'bg-emerald-100 text-emerald-600' :
                          'bg-blue-100 text-[#2B6CB0]'
                        }`}>
                          {log.severity === 'high' ? <ShieldAlert className="w-4 h-4" /> :
                           log.severity === 'medium' ? <AlertTriangle className="w-4 h-4" /> :
                           log.severity === 'low' ? <CheckCircle2 className="w-4 h-4" /> :
                           <Info className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="text-[#0D1117] font-bold text-sm mb-0.5">{log.action}</p>
                          <div className="flex items-center gap-2 text-xs font-mono text-[#4A5568]">
                            <span className="font-semibold">{log.id}</span>
                            <span className="w-1 h-1 rounded-full bg-[#CBD5E0]" />
                            <span>{log.type}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-[#4A5568] font-medium">
                      {log.user}
                    </td>
                    <td className="p-4 text-sm text-[#4A5568] font-mono">
                      {log.ip}
                    </td>
                    <td className="p-4 text-sm text-[#0D1117] font-medium">
                      {log.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
