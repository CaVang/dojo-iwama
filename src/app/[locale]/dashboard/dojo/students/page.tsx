"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

interface DojoStudent {
  id: string;
  name: string;
  contact_info: string;
  status: string;
  created_at: string;
  current_belt?: string;
  tuition_paid_until?: string | null;
  dojo_classes?: {
    name: string;
  } | null;
}

const BELTS: Record<string, string> = {
  "6_kyu": "Đai Trắng (6 Kyu)",
  "5_kyu": "Đai Vàng (5 Kyu)",
  "4_kyu": "Đai Cam (4 Kyu)",
  "3_kyu": "Đai Xanh lá (3 Kyu)",
  "2_kyu": "Đai Xanh dương (2 Kyu)",
  "1_kyu": "Đai Nâu (1 Kyu)",
  "shodan": "Shodan (Đen 1 đẳng)",
  "nidan": "Nidan (Đen 2 đẳng)",
  "sandan": "Sandan (Đen 3 đẳng)",
};

export default function StudentsPage() {
  const [students, setStudents] = useState<DojoStudent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({ current_belt: "6_kyu", tuition_paid_until: "" });
  const t = useTranslations("dashboard");

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/dashboard/dojo/students");
      if (res.ok) {
        const data = await res.json();
        setStudents(data.students || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleEditClick = (student: DojoStudent) => {
    setEditingId(student.id);
    setEditForm({
      current_belt: student.current_belt || "6_kyu",
      tuition_paid_until: student.tuition_paid_until || "",
    });
  };

  const handleSave = async (id: string) => {
    try {
      setIsSaving(true);
      const res = await fetch("/api/dashboard/dojo/students", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          current_belt: editForm.current_belt,
          tuition_paid_until: editForm.tuition_paid_until || null,
        }),
      });
      if (res.ok) {
        setStudents(students.map(s => 
          s.id === id 
            ? { 
                ...s, 
                current_belt: editForm.current_belt, 
                tuition_paid_until: editForm.tuition_paid_until || null 
              } 
            : s
        ));
        setEditingId(null);
      } else {
        alert("Lỗi khi cập nhật học viên");
      }
    } catch (err) {
      console.error(err);
      alert("Đã xảy ra lỗi");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-japan-blue/10 pb-4">
        <div>
          <h1 className="font-serif text-2xl text-sumi">Quản lý Học viên</h1>
          <p className="text-sumi-muted text-sm mt-1">Danh sách học viên chính thức của võ đường</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 rounded-full border-4 border-japan-blue border-t-transparent animate-spin"></div>
        </div>
      ) : students.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-japan-blue/10 border-dashed">
          <p className="text-sumi-muted">Chưa có học viên nào được xếp lớp.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-japan-blue/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-washi-cream border-b border-japan-blue/10">
                  <th className="p-4 font-serif font-bold text-sm text-japan-blue uppercase tracking-wider">Họ tên</th>
                  <th className="p-4 font-serif font-bold text-sm text-japan-blue uppercase tracking-wider">Lớp học</th>
                  <th className="p-4 font-serif font-bold text-sm text-japan-blue uppercase tracking-wider">Cấp đai</th>
                  <th className="p-4 font-serif font-bold text-sm text-japan-blue uppercase tracking-wider">Hạn học phí</th>
                  <th className="p-4 font-serif font-bold text-sm text-japan-blue uppercase tracking-wider">Trạng thái</th>
                  <th className="p-4 font-serif font-bold text-sm text-japan-blue uppercase tracking-wider text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {students.map((student) => {
                  const isEditing = editingId === student.id;

                  return (
                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="font-medium text-sumi">{student.name}</div>
                        <div className="text-xs text-sumi-muted mt-1">{student.contact_info}</div>
                      </td>
                      <td className="p-4">
                        {student.dojo_classes?.name ? (
                          <span className="inline-flex px-2 py-1 bg-japan-blue/10 text-japan-blue rounded text-xs whitespace-nowrap">
                            {student.dojo_classes.name}
                          </span>
                        ) : (
                          <span className="text-sumi-muted italic text-xs">Chưa phân lớp</span>
                        )}
                      </td>
                      <td className="p-4">
                        {isEditing ? (
                          <select
                            className="p-1 text-xs border border-gray-300 rounded focus:border-japan-blue focus:ring-1 focus:ring-japan-blue w-full max-w-[140px]"
                            value={editForm.current_belt}
                            onChange={(e) => setEditForm({...editForm, current_belt: e.target.value})}
                          >
                            {Object.entries(BELTS).map(([key, label]) => (
                              <option key={key} value={key}>{label}</option>
                            ))}
                          </select>
                        ) : (
                          <span className="font-medium text-xs text-sumi whitespace-nowrap">
                            {BELTS[student.current_belt || "6_kyu"] || "Đai Trắng (6 Kyu)"}
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        {isEditing ? (
                          <input
                            type="date"
                            className="p-1 text-xs border border-gray-300 rounded focus:border-japan-blue focus:ring-1 focus:ring-japan-blue w-full max-w-[130px]"
                            value={editForm.tuition_paid_until}
                            onChange={(e) => setEditForm({...editForm, tuition_paid_until: e.target.value})}
                          />
                        ) : (
                          <span className={`text-xs whitespace-nowrap ${!student.tuition_paid_until || new Date(student.tuition_paid_until) < new Date() ? 'text-red-500 font-bold' : 'text-green-600'}`}>
                            {student.tuition_paid_until ? new Date(student.tuition_paid_until).toLocaleDateString("vi-VN") : "Chưa đóng phí"}
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                          student.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {student.status === 'active' ? 'Đang học' : 'Đã nghỉ'}
                        </span>
                      </td>
                      <td className="p-4 text-right whitespace-nowrap">
                        {isEditing ? (
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => handleSave(student.id)} 
                              disabled={isSaving}
                              className="px-2 py-1 text-xs bg-japan-blue text-washi rounded hover:bg-japan-blue/90 disabled:opacity-50"
                            >
                              {isSaving ? "Lưu..." : "Lưu"}
                            </button>
                            <button 
                              onClick={handleCancel}
                              disabled={isSaving}
                              className="px-2 py-1 text-xs text-sumi-muted hover:bg-gray-100 rounded"
                            >
                              Hủy
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => handleEditClick(student)}
                            className="text-xs text-japan-blue hover:underline"
                          >
                            Sửa
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
