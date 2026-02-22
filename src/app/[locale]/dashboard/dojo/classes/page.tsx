"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Plus, Edit, Trash2 } from "lucide-react";
import ClassFormModal from "./ClassFormModal";

interface Schedule {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
}

export interface DojoClass {
  id: string;
  name: string;
  target_audience: string;
  tuition_1m: number;
  tuition_3m: number;
  tuition_6m: number;
  tuition_12m: number;
  class_schedules: Schedule[];
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<DojoClass[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<DojoClass | null>(null);
  const t = useTranslations("dashboard");

  const fetchClasses = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/dashboard/dojo/classes");
      if (res.ok) {
        const data = await res.json();
        setClasses(data.classes || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this class?")) return;
    
    try {
      const res = await fetch(`/api/dashboard/dojo/classes?id=${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setClasses(classes.filter(c => c.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openAddModal = () => {
    setEditingClass(null);
    setIsModalOpen(true);
  };

  const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-japan-blue/10 pb-4">
        <div>
          <h1 className="font-serif text-2xl text-sumi">Quản lý Lớp học</h1>
          <p className="text-sumi-muted text-sm mt-1">Hệ thống các lớp và chi phí</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-japan-blue text-washi px-4 py-2 rounded flex items-center gap-2 hover:bg-japan-blue/90"
        >
          <Plus size={16} />
          <span>Thêm lớp</span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 rounded-full border-4 border-japan-blue border-t-transparent animate-spin"></div>
        </div>
      ) : classes.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-japan-blue/10 border-dashed">
          <p className="text-sumi-muted">Chưa có lớp học nào được tạo.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {classes.map(cls => (
            <div key={cls.id} className="bg-white border border-japan-blue/10 p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow relative group">
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {/* Editing disabled for now to simplify, only Delete implemented in V1 */}
                <button 
                  onClick={() => handleDelete(cls.id)}
                  className="p-1.5 bg-red-50 text-red-500 rounded hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <h3 className="font-serif font-bold text-lg text-sumi mb-1">{cls.name}</h3>
              <p className="inline-block px-2 py-0.5 bg-japan-blue/10 text-japan-blue rounded text-xs">
                {cls.target_audience === 'kids' ? 'Thiếu nhi' : cls.target_audience === 'teens' ? 'Thiếu niên' : cls.target_audience === 'adults' ? 'Người lớn' : 'Mọi độ tuổi'}
              </p>

              <div className="mt-4 space-y-2">
                <p className="text-xs font-bold text-sumi-muted uppercase tracking-wider">Lịch học</p>
                {cls.class_schedules && cls.class_schedules.length > 0 ? (
                  <ul className="text-sm space-y-1">
                    {cls.class_schedules.map(s => (
                      <li key={s.id} className="flex gap-2">
                        <span className="font-medium min-w-8">{dayNames[s.day_of_week]}</span>
                        <span className="text-sumi-muted">{s.start_time.slice(0,5)} - {s.end_time.slice(0,5)}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-sumi-muted italic">Chưa sắp lịch</p>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs font-bold text-sumi-muted uppercase tracking-wider mb-2">Học phí (VND)</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-sumi-muted">1 tháng:</span>
                    <span className="font-medium">{cls.tuition_1m.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sumi-muted">3 tháng:</span>
                    <span className="font-medium">{cls.tuition_3m.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sumi-muted">6 tháng:</span>
                    <span className="font-medium">{cls.tuition_6m.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sumi-muted">12 tháng:</span>
                    <span className="font-medium">{cls.tuition_12m.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <ClassFormModal 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => {
            setIsModalOpen(false);
            fetchClasses();
          }} 
        />
      )}
    </div>
  );
}
