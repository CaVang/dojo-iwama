"use client";

import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

interface ScheduleInput {
  day_of_week: number;
  start_time: string;
  end_time: string;
}

export default function ClassFormModal({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) {
  const { profile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    target_audience: "all",
    tuition_1m: "",
    tuition_3m: "",
    tuition_6m: "",
    tuition_12m: ""
  });

  const [schedules, setSchedules] = useState<ScheduleInput[]>([
    { day_of_week: 1, start_time: "18:00", end_time: "19:30" } // Default T2
  ]);

  const addSchedule = () => {
    setSchedules([...schedules, { day_of_week: 1, start_time: "18:00", end_time: "19:30" }]);
  };

  const removeSchedule = (index: number) => {
    setSchedules(schedules.filter((_, i) => i !== index));
  };

  const updateSchedule = (index: number, field: keyof ScheduleInput, value: string | number) => {
    const newSchedules = [...schedules];
    newSchedules[index] = { ...newSchedules[index], [field]: value };
    setSchedules(newSchedules);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Using a fake dojo_id for Local simulation if needed. In real life,
    // the backend will infer it from `dojo_owners` auth. But we'll pass a dummy if missing
    // or just let the backend handle it entirely via profile context.
    const dojo_id = "iwama-honbu"; // Hardcoded for this mockup since we usually rely on user profile

    try {
      const payload = {
        dojo_id, // We'll pass it, but real backend relies on RLS and dojo_owners table
        name: formData.name,
        target_audience: formData.target_audience,
        tuition_1m: parseInt(formData.tuition_1m) || 0,
        tuition_3m: parseInt(formData.tuition_3m) || 0,
        tuition_6m: parseInt(formData.tuition_6m) || 0,
        tuition_12m: parseInt(formData.tuition_12m) || 0,
        schedules
      };

      const res = await fetch("/api/dashboard/dojo/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create class");

      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-sumi/50 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white w-full max-w-2xl rounded-lg shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-japan-blue/10 shrink-0">
          <h2 className="font-serif text-xl font-bold text-sumi">Thêm Lớp Mới</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X size={20} className="text-sumi-muted" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded text-sm">
              {error}
            </div>
          )}

          <form id="classForm" onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-japan-blue border-b border-japan-blue/10 pb-2">Thông tin chung</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-sumi mb-1">Tên lớp học *</label>
                  <input
                    required
                    type="text"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-japan-blue focus:ring-1 focus:ring-japan-blue"
                    placeholder="VD: Aikido Thiếu nhi A"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-sumi mb-1">Đối tượng</label>
                  <select
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-japan-blue focus:ring-1 focus:ring-japan-blue"
                    value={formData.target_audience}
                    onChange={(e) => setFormData({...formData, target_audience: e.target.value})}
                  >
                    <option value="kids">Thiếu nhi</option>
                    <option value="teens">Thiếu niên</option>
                    <option value="adults">Người lớn</option>
                    <option value="all">Mọi độ tuổi</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-japan-blue/10 pb-2">
                <h3 className="font-serif font-bold text-japan-blue">Thời khóa biểu</h3>
                <button
                  type="button"
                  onClick={addSchedule}
                  className="text-xs flex items-center gap-1 text-japan-blue hover:text-sumi transition-colors"
                >
                  <Plus size={14} /> Thêm buổi học
                </button>
              </div>
              
              <div className="space-y-3">
                {schedules.map((schedule, index) => (
                  <div key={index} className="flex flex-wrap items-center gap-2 p-3 bg-gray-50 rounded border border-gray-100">
                    <select
                      className="border border-gray-300 rounded px-2 py-1.5 text-sm"
                      value={schedule.day_of_week}
                      onChange={(e) => updateSchedule(index, 'day_of_week', parseInt(e.target.value))}
                    >
                      <option value={1}>Thứ Hai</option>
                      <option value={2}>Thứ Ba</option>
                      <option value={3}>Thứ Tư</option>
                      <option value={4}>Thứ Năm</option>
                      <option value={5}>Thứ Sáu</option>
                      <option value={6}>Thứ Bảy</option>
                      <option value={0}>Chủ Nhật</option>
                    </select>
                    
                    <span className="text-sm text-sumi-muted px-1">Từ</span>
                    <input
                      type="time"
                      className="border border-gray-300 rounded px-2 py-1.5 text-sm"
                      value={schedule.start_time}
                      onChange={(e) => updateSchedule(index, 'start_time', e.target.value)}
                    />
                    
                    <span className="text-sm text-sumi-muted px-1">đến</span>
                    <input
                      type="time"
                      className="border border-gray-300 rounded px-2 py-1.5 text-sm"
                      value={schedule.end_time}
                      onChange={(e) => updateSchedule(index, 'end_time', e.target.value)}
                    />
                    
                    <button
                      type="button"
                      onClick={() => removeSchedule(index)}
                      disabled={schedules.length === 1}
                      className="ml-auto p-1.5 text-red-500 hover:bg-red-50 rounded disabled:opacity-50 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-serif font-bold text-japan-blue border-b border-japan-blue/10 pb-2">Học phí (VND)</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-sumi-muted mb-1">1 Tháng</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="VD: 500000"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    value={formData.tuition_1m}
                    onChange={(e) => setFormData({...formData, tuition_1m: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs text-sumi-muted mb-1">3 Tháng</label>
                  <input
                    type="number"
                    min="0"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    value={formData.tuition_3m}
                    onChange={(e) => setFormData({...formData, tuition_3m: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs text-sumi-muted mb-1">6 Tháng</label>
                  <input
                    type="number"
                    min="0"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    value={formData.tuition_6m}
                    onChange={(e) => setFormData({...formData, tuition_6m: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs text-sumi-muted mb-1">12 Tháng</label>
                  <input
                    type="number"
                    min="0"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    value={formData.tuition_12m}
                    onChange={(e) => setFormData({...formData, tuition_12m: e.target.value})}
                  />
                </div>
              </div>
              <p className="text-xs text-sumi-muted italic mt-2">Bỏ trống các ô không áp dụng. Ghi chú: Hệ thống ưu tiên để số VNĐ để tiện cho xuất biểu đồ doanh thu sau này.</p>
            </div>
          </form>
        </div>

        <div className="p-4 border-t border-japan-blue/10 bg-gray-50 flex justify-end gap-3 shrink-0 rounded-b-lg">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-sumi hover:bg-gray-200 rounded transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            form="classForm"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium bg-japan-blue text-washi rounded hover:bg-japan-blue/90 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? "Đang lưu..." : "Lưu lớp học"}
          </button>
        </div>
      </div>
    </div>
  );
}
